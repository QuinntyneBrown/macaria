import {Component, ViewEncapsulation, ElementRef } from "@angular/core";
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
        private _eventHub: EventHub
    ) { }
    
    public quillEditorFormControl: FormControl = new FormControl('');
    
    ngAfterViewInit() {

        this.note$.subscribe(x => {
            this.quillEditorFormControl.patchValue(x.body);
        });

        if (this._activatedRoute.snapshot.params["slug"]) {
            this._notesService.getBySlugAndCurrentUser({ slug: this._activatedRoute.snapshot.params["slug"] })
                .subscribe(x => this.note$.next(x.note));
        } else {
            this._notesService.getByTitleAndCurrentUser({ title: moment().format(constants.DATE_FORMAT) })
                .subscribe(x => this.note$.next(x.note == null ? new Note() : x.note));
        }

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

                this._eventHub.events.subscribe(x => {
                    if (x.payload.correlationId == correlationId) {
                        if (x.payload.entity)
                            this.notes$.next(addOrUpdate({
                                item: x.payload.entity,
                                items: this.notes$.value
                            }));
                    }
                });
            }).subscribe();
    }
    
    private _saveSubscription: Subscription;

    public notes$: BehaviorSubject<Array<Note>> = new BehaviorSubject([]);

    public note$: BehaviorSubject<Note> = new BehaviorSubject(new Note());    
}
