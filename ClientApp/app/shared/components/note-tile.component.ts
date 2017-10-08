import { Component, Input, ElementRef } from "@angular/core";
import { Note } from "../models/note.model";
import { customEvents } from "../services/custom-events";
import { Logger } from "../services/logger.service";

export const NOTE_TILE_CLICKED = "NOTE TILE CLICKED";

@Component({
    templateUrl: "./note-tile.component.html",
    styleUrls: ["./note-tile.component.css"],
    selector: "ce-note-tile"
})
export class NoteTileComponent {

    constructor(private _elementRef: ElementRef) {
        this.onClick = this.onClick.bind(this);    
    }

    @Input()
    public note: Note;

    public ngOnInit() { this._elementRef.nativeElement.addEventListener("click", this.onClick); }

    public ngOnDestroy() { this._elementRef.nativeElement.removeEventListener("click", this.onClick); }

    public onClick() {        
        this._elementRef.nativeElement.dispatchEvent(customEvents.create({ name: NOTE_TILE_CLICKED, detail: { note: this.note } }));
    }
}
