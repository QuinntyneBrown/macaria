import { Component, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { constants } from "../shared/constants";
import { Note } from "../shared/models/note.model";
import { Tag } from "../shared/models/tag.model";
import { NotesService } from "../shared/services/notes.service";
import { CorrelationIdsList } from "../shared/services/correlation-ids-list";
import { EventHub } from "../shared/services/event-hub";
import { SpeechRecognitionService } from "../shared/services/speech-recognition.service";
import { Storage } from "../shared/services/storage.service";
import { TagsService } from "../shared/services/tags.service";
import { addOrUpdate } from "../shared/utilities/add-or-update";
import { pluckOut } from "../shared/utilities/pluck-out";

declare var moment: any;

const NOTE_ADDED_OR_UPDATED = "[Notes] NoteAddedOrUpdated";

@Component({
    templateUrl: "./landing-page.component.html",
    styleUrls: ["./landing-page.component.css"],
    selector: "ce-landing-page"
})
export class LandingPageComponent {
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _correlationIdsList: CorrelationIdsList,
        private _notesService: NotesService,
        private _elementRef: ElementRef,
        private _eventHub: EventHub,
        private _router: Router,
        private _storage: Storage,
        private _tagsService: TagsService,
        private _speechRecognitionService: SpeechRecognitionService
    ) {
        this.onSaveTagClick = this.onSaveTagClick.bind(this);

        _activatedRoute.params
            .takeUntil(this._ngUnsubscribe)
            .switchMap(params => params["slug"] != null
                ? _notesService.getBySlugAndCurrentUser({ slug: params["slug"] })
                : _notesService.getByTitleAndCurrentUser({ title: moment().format(constants.DATE_FORMAT) })
            )
            .map(x => x.note)
            .subscribe(note => this.note$.next(note || this.note$.value));
    }

    private _ngUnsubscribe: Subject<void> = new Subject<void>();

    public quillEditorFormControl: FormControl = new FormControl('');

    onSaveTagClick(e) {
        const correlationId = this._correlationIdsList.newId();
        this._tagsService.addOrUpdate({ tag: e.detail.tag, correlationId }).subscribe();
    }

    ngOnInit() {
        if (constants.SUPPORTS_SPEECH_RECOGNITION)
            this._speechRecognitionService.start();
    }

    ngOnDestroy(): void {
        this._ngUnsubscribe.next();

        if (constants.SUPPORTS_SPEECH_RECOGNITION)
            this._speechRecognitionService.stop();
    }

    async ngAfterViewInit() {
        this._tagsService.get()
            .takeUntil(this._ngUnsubscribe)
            .subscribe(x => this.tags$.next(x.tags));

        this._speechRecognitionService.finalTranscript$
            .takeUntil(this._ngUnsubscribe)
            .filter(x => x && x.length > 0)
            .map(x => this.quillEditorFormControl.patchValue(`${this.quillEditorFormControl.value}<p>${x}</p>`))
            .map(x => this._correlationIdsList.newId())
            .switchMap(correlationId => this._notesService.addOrUpdate({
                    correlationId,
                    note: {
                        id: this.note$.value.id,
                        title: this.note$.value.title,
                        body: this.quillEditorFormControl.value
                    },
            }))
            .subscribe();

        this._eventHub.events
            .takeUntil(this._ngUnsubscribe)
            .filter((x) => !this._correlationIdsList.hasId(x.payload.correlationId))
            .filter((x) => x.type == NOTE_ADDED_OR_UPDATED)
            .filter((x) => x.tenantUniqueId == this._storage.get({ name: constants.TENANT }))
            .filter((x) => this.note$.value.id == x.payload.entity.id)
            .subscribe(x => this.note$.next(x.payload.entity));

        this.note$
            .filter(x => x != null)
            .takeUntil(this._ngUnsubscribe)
            .do(x => this.quillEditorFormControl.patchValue(x.body))
            .subscribe(x => this.selectedTags$.next(x.tags));

        Observable
            .fromEvent(this._textEditor, "keyup")
            .takeUntil(this._ngUnsubscribe)
            .debounce(() => Observable.timer(300))
            .map(() => this._correlationIdsList.newId())
            .switchMap((correlationId) => this._notesService.addOrUpdate({
                correlationId,
                note: {
                    id: this.note$.value.id,
                    title: this.note$.value.title,
                    body: this.quillEditorFormControl.value
                },
            }))
            .subscribe();
    }

    public handleTagClicked($event) {
        const tag = <Tag>$event.tag;
        const correlationId = this._correlationIdsList.newId();

        if (this.note$.value.tags.find((x) => x.id == tag.id) != null) {
            this._notesService.removeTag({ noteId: this.note$.value.id, tagId: tag.id, correlationId })
                .subscribe();

            pluckOut({ items: this.note$.value.tags, value: tag.id });

            return;
        }

        this._notesService.addTag({ noteId: this.note$.value.id, tagId: tag.id, correlationId })
            .subscribe();

        addOrUpdate({ items: this.note$.value.tags, item: tag });
    }

    private get _textEditor() { return this._elementRef.nativeElement.querySelector("ce-quill-text-editor"); }

    public tags$: BehaviorSubject<Array<Tag>> = new BehaviorSubject([]);

    public selectedTags$: BehaviorSubject<Array<Tag>> = new BehaviorSubject([]);

    public note$: BehaviorSubject<Note> = new BehaviorSubject(new Note());
}