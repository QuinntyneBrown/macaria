import {Component, ViewEncapsulation} from "@angular/core";
import {NotesService} from "../shared/services/notes.service";
import {Note} from "../shared/models/note.model";

@Component({
    templateUrl: "./landing-page.component.html",
    styleUrls: ["./landing-page.component.css"],
    selector: "ce-landing-page"
})
export class LandingPageComponent {
    constructor(private _notesService: NotesService) { }

    public ngOnInit() {
        this._notesService.get().subscribe(x => this.notes = x.notes);
    }

    public notes: Array<Note> = [];
}
