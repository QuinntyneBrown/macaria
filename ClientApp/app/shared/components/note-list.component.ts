import { Component, Input} from "@angular/core";
import { Note } from "../models/note.model";
import { Tag } from "../models/tag.model";
import { FormControl } from "@angular/forms";
import { addOrUpdate } from "../utilities/add-or-update";
import { pluckOut } from "../utilities/pluck-out";
import { Logger } from "../services/logger.service";

@Component({
    templateUrl: "./note-list.component.html",
    styleUrls: [
        "../../../styles/forms.css",
        "./note-list.component.css"
    ],
    selector: "ce-note-list"
})
export class NoteListComponent {
    constructor(private _logger: Logger) {
        
    }

    private _notes: Array<Note> = [];

    @Input("tags")
    public tags: Array<Tag> = [];

    public selectedTags: Array<Tag> = [];

    onTagClick($event) {
        this._logger.trace(`(NoteList) onTagClick ${JSON.stringify($event)}`);

        if (this.selectedTags.indexOf($event.tag) > -1) {
            pluckOut({
                items: this.selectedTags,
                value: $event.tag.id
            });
        } else {
            addOrUpdate({
                items: this.selectedTags,
                item: $event.tag
            });
        }        
    }

    @Input("notes")
    public set notes(value: Array<Note>) { this._notes = value; }

    public get notes(): Array<Note> {
        
        if (this.selectedTags.length > 0) {
            return this._notes.filter(note => {                
                if (note.body.toLowerCase().indexOf(this.searchInputFormControl.value.toLowerCase()) > -1) {
                    for (let s = 0; s < this.selectedTags.length; s++) {                        
                        if (note.tags.map(x => x.id).indexOf(this.selectedTags[s].id) > -1) {
                            return true;
                        }
                    }
                    return false;
                }
            });
        } else {
            return this._notes.filter(note => note.body.toLowerCase().indexOf(this.searchInputFormControl.value.toLowerCase()) > -1);
        }
    }

    public searchInputFormControl: FormControl = new FormControl('');
}
