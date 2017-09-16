import { Component, Input} from "@angular/core";
import { Note } from "../models/note.model";

@Component({
    templateUrl: "./note-list.component.html",
    styleUrls: [
        "../../../styles/forms.css",
        "./note-list.component.css"
    ],
    selector: "ce-note-list"
})
export class NoteListComponent {

    ngOnInit() {

    }

    @Input()
    public notes: Array<Note> = [];
}
