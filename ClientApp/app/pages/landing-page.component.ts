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
import { Logger } from "../shared/services/logger.service";
import { Mixin } from "../shared/utilities/mixin";
import { NoteTagBehavior } from "../shared/behaviors/note-tag.behavior";
import { DictationBehavior } from "../shared/behaviors/dictation.behavior";

declare var moment: any;

const NOTE_ADDED_OR_UPDATED = "[Notes] NoteAddedOrUpdated";

@Component({
    templateUrl: "./landing-page.component.html",
    styleUrls: ["./landing-page.component.css"],
    selector: "ce-landing-page"
})
@Mixin({
        behaviors: [DictationBehavior,NoteTagBehavior]
})
export class LandingPageComponent implements NoteTagBehavior, DictationBehavior {
    constructor(
        public activatedRoute: ActivatedRoute,
        public correlationIdsList: CorrelationIdsList,
        public elementRef: ElementRef,
        public eventHub: EventHub,
        public logger: Logger,
        public notesService: NotesService,        
        public router: Router,
        public speechRecognitionService: SpeechRecognitionService,
        public storage: Storage,
        public tagsService: TagsService
    ) {
        activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap(params => params["slug"] != null
                ? notesService.getBySlugAndCurrentUser({ slug: params["slug"] })
                : notesService.getByTitleAndCurrentUser({ title: moment().format(constants.DATE_FORMAT) })
            )
            .map(x => x.note)
            .subscribe(note => this.note$.next(note || this.note$.value));
    }

    public ngUnsubscribe: Subject<void> = new Subject<void>();

    public quillEditorFormControl: FormControl = new FormControl('');

    
    ngOnDestroy(): void {
        this.logger.trace("(LandingPage) ngOnDestroy");

        this.ngUnsubscribe.next();

        if (constants.SUPPORTS_SPEECH_RECOGNITION)
            this.stopDictationBehavior();
    }

    async ngAfterViewInit() {
        this.logger.trace("(LandingPage) ngAfterViewInit");

        this.tagsService.get()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(x => this.tags$.next(x.tags));

        if (constants.SUPPORTS_SPEECH_RECOGNITION)
            this.startDictationBehavior();

        this.eventHub.events
            .takeUntil(this.ngUnsubscribe)
            .filter((x) => !this.correlationIdsList.hasId(x.payload.correlationId))
            .filter((x) => x.type == NOTE_ADDED_OR_UPDATED)
            .filter((x) => x.tenantUniqueId == this.storage.get({ name: constants.TENANT }))
            .filter((x) => this.note$.value.id == x.payload.entity.id)
            .subscribe(x => this.note$.next(x.payload.entity));

        this.note$
            .filter(x => x != null)
            .takeUntil(this.ngUnsubscribe)
            .do(x => this.quillEditorFormControl.patchValue(x.body))
            .subscribe(x => this.selectedTags$.next(x.tags));

        Observable
            .fromEvent(this.textEditor, "keyup")
            .takeUntil(this.ngUnsubscribe)
            .debounce(() => Observable.timer(300))
            .map(() => this.correlationIdsList.newId())
            .switchMap((correlationId) => this.notesService.addOrUpdate({
                correlationId,
                note: {
                    id: this.note$.value.id,
                    title: this.note$.value.title,
                    body: this.quillEditorFormControl.value
                },
            }))
            .subscribe();
    }

    public handleNoteTagClicked($event) { /* NoteTagBehavior */  }

    public stopDictationBehavior(): void { /* DictationBehavior */ }

    public startDictationBehavior(): void { /* DictationBehavior */ }

    public get textEditor() { return this.elementRef.nativeElement.querySelector("ce-quill-text-editor"); }

    public tags$: BehaviorSubject<Array<Tag>> = new BehaviorSubject([]);

    public selectedTags$: BehaviorSubject<Array<Tag>> = new BehaviorSubject([]);

    public note$: BehaviorSubject<Note> = new BehaviorSubject(new Note());
}