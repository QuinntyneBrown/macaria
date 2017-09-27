import {Component, ElementRef} from "@angular/core";
import {FormGroup,FormControl,Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Router, NavigationEnd} from "@angular/router";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {constants} from "../shared/constants";
import {Note} from "../shared/models/note.model";
import {Tag} from "../shared/models/tag.model";
import {NotesService} from "../shared/services/notes.service";
import {CorrelationIdsList} from "../shared/services/correlation-ids-list";
import {EventHub} from "../shared/services/event-hub";
import {SpeechRecognitionService} from "../shared/services/speech-recognition.service";
import {Storage} from "../shared/services/storage.service";
import {TagsService} from "../shared/services/tags.service";
import {addOrUpdate} from "../shared/utilities/add-or-update";
import {pluckOut} from "../shared/utilities/pluck-out";

declare var moment: any;

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
    }
    
    public quillEditorFormControl: FormControl = new FormControl('');
    
    private _subscriptions: Array<Subscription> = [];

    public onNavigationEnd() {
        if (this._activatedRoute.snapshot.params["slug"]) {
            this._subscriptions.push(this._notesService.getBySlugAndCurrentUser({ slug: this._activatedRoute.snapshot.params["slug"] })
                .subscribe(x => this.note$.next(x.note)));
        } else {
            this._subscriptions.push(this._notesService.getByTitleAndCurrentUser({ title: moment().format(constants.DATE_FORMAT) })
                .subscribe(x => this.note$.next(x.note == null ? new Note() : x.note)));
        }
        window.scrollTo(0, 0);
    }

    onSaveTagClick(e) {        
        const correlationId = this._correlationIdsList.newId();
        this._tagsService.addOrUpdate({ tag: e.detail.tag, correlationId }).subscribe();
    }

    ngOnInit() {        
        if (constants.SUPPORTS_SPEECH_RECOGNITION)
            this._speechRecognitionService.start();
    }

    ngOnDestroy() {
        if (constants.SUPPORTS_SPEECH_RECOGNITION)
            this._speechRecognitionService.stop();        
    }

    async ngAfterViewInit() {        
        this._subscriptions.push(this._tagsService.get().subscribe(x => this.tags$.next(x.tags)));

        this._subscriptions.push(this._speechRecognitionService.finalTranscript$.subscribe(x => {
            if (x) {
                this.quillEditorFormControl.patchValue(`${this.quillEditorFormControl.value}<p>${x}</p>`);
                const correlationId = this._correlationIdsList.newId();
                this._notesService.addOrUpdate({
                    correlationId,
                    note: {
                        id: this.note$.value.id,
                        title: this.note$.value.title,
                        body: this.quillEditorFormControl.value
                    },
                }).subscribe();
            }
        }));

        this._eventHub.events.subscribe(x => {            
            if (this._correlationIdsList.hasId(x.payload.correlationId) && x.payload.entity && x.type == "[Notes] NoteAddedOrUpdated")
                this.notes$.next(addOrUpdate({
                    item: x.payload.entity,
                    items: this.notes$.value
                }));

            if (!this._correlationIdsList.hasId(x.payload.correlationId) && x.payload.entity && x.type == "[Notes] NoteAddedOrUpdatedFailed") {
                this.notes$.next(addOrUpdate({
                    item: x.payload.entity,
                    items: this.notes$.value
                }));
                
                if (x.tenantUniqueId == this._storage.get({ name: constants.TENANT }) && this.note$.value.id == x.payload.entity.id)
                    this.note$.next(x.payload.entity);                                
            }
        });

        this.note$.subscribe(x => {
            this.quillEditorFormControl.patchValue(x.body);
            this.selectedTags$.next(x.tags);
        });

        this.onNavigationEnd();

        this._router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.onNavigationEnd();
            }
        });
        
        this._notesService.getByCurrentUser().subscribe(x => this.notes$.next(x.notes)); 

        Observable
            .fromEvent(this._elementRef.nativeElement.querySelector("ce-quill-text-editor"), "keyup")
            .debounce(() => Observable.timer(300))
            .map(() => {
                const correlationId = this._correlationIdsList.newId();
                this._notesService.addOrUpdate({
                    correlationId,
                    note: {
                        id: this.note$.value.id,
                        title: this.note$.value.title,
                        body: this.quillEditorFormControl.value
                    },
                }).subscribe();
            }).subscribe();
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

    private _saveSubscription: Subscription;

    public tags$: BehaviorSubject<Array<Tag>> = new BehaviorSubject([]);

    public selectedTags$: BehaviorSubject<Array<Tag>> = new BehaviorSubject([]);

    public notes$: BehaviorSubject<Array<Note>> = new BehaviorSubject([]);

    public note$: BehaviorSubject<Note> = new BehaviorSubject(new Note());  
}