import {Component, ViewEncapsulation, ElementRef} from "@angular/core";
import {NotesService} from "../shared/services/notes.service";
import {Note} from "../shared/models/note.model";
import {constants} from "../shared/constants";
import {CorrelationIdsList} from "../shared/services/correlation-ids-list";
import {addOrUpdate} from "../shared/utilities/add-or-update";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EventHub} from "../shared/services/event-hub";

declare var moment: any;
@Component({
    templateUrl: "./landing-page.component.html",
    styleUrls: ["./landing-page.component.css"],
    selector: "ce-landing-page"
})
export class LandingPageComponent {
    constructor(
        private _correlationIdsList: CorrelationIdsList,
        private _notesService: NotesService,
        private _elementRef: ElementRef,
        private _eventHub: EventHub
    ) {
        this.onKeyDown = this.onKeyDown;
    }

    public ngOnInit() {
        this._notesService.get().subscribe(x => this.notes$.next(x.notes));
    }

    public intervalId: any = 0;

    public onKeyDown() {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            const correlationId = this._correlationIdsList.newId();

            this._notesService.addOrUpdate({
                correlationId,
                note: this.note
            }).subscribe();

            this._eventHub.events.subscribe(x => {
                if (x.correlationId == correlationId)
                    this.notes$.next(addOrUpdate({
                        item: x.payload.entity,
                        items: this.notes$.value
                    }));
            });
        }, 300);
        
    }

    public notes$: BehaviorSubject<Array<Note>> = new BehaviorSubject([]);

    public note: Note = <Note>{};

    public get today(): string { return moment().format(constants.DATE_FORMAT); }
}
