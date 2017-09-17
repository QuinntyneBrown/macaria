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
    ) {
        this.saveNote = this.saveNote.bind(this);
    }

    public ngOnInit() {
        
    }
    
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

        this._elementRef.nativeElement.querySelector("ce-quill-text-editor").addEventListener("keydown", this.saveNote);        
    }

    public timeoutId: any = null;
    public saving: boolean = false;

    public saveNote() {       
        if (this.saving) return;

        this.saving = true;

        setTimeout(() => {
            
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
                    
                    if(x.payload.entity)
                        this.notes$.next(addOrUpdate({
                            item: x.payload.entity,
                            items: this.notes$.value
                        }));                                         
                    this.saving = false;
                }
            });
        }, 1000);
        
    }

    private _saveSubscription: Subscription;

    public notes$: BehaviorSubject<Array<Note>> = new BehaviorSubject([]);

    public note$: BehaviorSubject<Note> = new BehaviorSubject(new Note());    
}
