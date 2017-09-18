import { Component, Input} from "@angular/core";
import { Note } from "../models/note.model";

import { FormControl } from "@angular/forms";

@Component({
    templateUrl: "./note-list.component.html",
    styleUrls: [
        "../../../styles/forms.css",
        "./note-list.component.css"
    ],
    selector: "ce-note-list"
})
export class NoteListComponent {

    ngOnInit() { }

    private _notes: Array<Note> = [];
    
    @Input("notes")
    public set notes(value: Array<Note>) { this._notes = value; }

    public get notes(): Array<Note> {
        return this._notes.filter(note => note.body.toLowerCase().indexOf(this.searchInputFormControl.value.toLowerCase()) > -1 );
    }

    public searchInputFormControl: FormControl = new FormControl('');
}
