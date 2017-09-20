import {Component, ElementRef } from "@angular/core";
import {NotesService} from "../shared/services/notes.service";
import {Note} from "../shared/models/note.model";
import {constants} from "../shared/constants";
import {CorrelationIdsList} from "../shared/services/correlation-ids-list";
import {addOrUpdate} from "../shared/utilities/add-or-update";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EventHub} from "../shared/services/event-hub";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {FormGroup,FormControl,Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {Router, NavigationEnd} from "@angular/router";
import {Storage} from "../shared/services/storage.service";
import {Tag} from "../shared/models/tag.model";
import {TagsService} from "../shared/services/tags.service";
import {SpeechRecognitionService} from "../shared/services/speech-recognition.service";
import {Ruler} from "../shared/services/ruler";
import {pluckOut} from "../shared/utilities/pluck-out";
import {addOrUpdate} from "../shared/utilities/add-or-update";

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
        private _speechRecognitionService: SpeechRecognitionService,
        private _ruler: Ruler
    ) {
        
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

    ngOnInit() {
        if (this._speechRecognitionService.isSupported) {
            this._speechRecognitionService.start();
        }
    }

    ngOnDestroy() {
        if (this._speechRecognitionService.isSupported) {
            this._speechRecognitionService.stop();
        }
    }

    async ngAfterViewInit() {
        setTimeout(async () => {
            var rect = await this._ruler.measure(this.tagsElement);
            var quillTextEditorHeight = this.viewPortHeight - (102 + rect.height);            
            (this._elementRef.nativeElement as HTMLElement).style.setProperty("--quill-text-editor-height", `${quillTextEditorHeight}px`);

        }, 500);
        
        this._subscriptions.push(this._tagsService.get().subscribe(x => {
            this.tags$.next(x.tags);
        }));

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
            if (this._correlationIdsList.hasId(x.payload.correlationId) && x.payload.entity)
                this.notes$.next(addOrUpdate({
                    item: x.payload.entity,
                    items: this.notes$.value
                }));

            if (!this._correlationIdsList.hasId(x.payload.correlationId) && x.payload.entity) {
                this.notes$.next(addOrUpdate({
                    item: x.payload.entity,
                    items: this.notes$.value
                }));
                
                if (x.tenantUniqueId == this._storage.get({ name: constants.TENANT }) && this.note$.value.id == x.payload.entity.id) {
                    this.note$.next(x.payload.entity);
                }                
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

    public get tagsElement() { return this._elementRef.nativeElement.querySelector("ce-tags"); }

    public get viewPortHeight() { return Math.max(document.documentElement.clientHeight, window.innerHeight || 0); }
}