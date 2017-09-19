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
        private _storage: Storage
    ) {
        
    }
    
    public quillEditorFormControl: FormControl = new FormControl('');
    

    public onNavigationEnd() {
        if (this._activatedRoute.snapshot.params["slug"]) {
            this._notesService.getBySlugAndCurrentUser({ slug: this._activatedRoute.snapshot.params["slug"] })
                .subscribe(x => this.note$.next(x.note));
        } else {
            this._notesService.getByTitleAndCurrentUser({ title: moment().format(constants.DATE_FORMAT) })
                .subscribe(x => this.note$.next(x.note == null ? new Note() : x.note));
        }
        window.scrollTo(0, 0);
    }

    ngAfterViewInit() {
   
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

        this.note$.subscribe(x => this.quillEditorFormControl.patchValue(x.body));

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
    
    private _saveSubscription: Subscription;

    public tags$: BehaviorSubject<Array<Tag>> = new BehaviorSubject([]);

    public selectedTags$: BehaviorSubject<Array<Tag>> = new BehaviorSubject([]);

    public notes$: BehaviorSubject<Array<Note>> = new BehaviorSubject([]);

    public note$: BehaviorSubject<Note> = new BehaviorSubject(new Note());    
}