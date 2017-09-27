import {Component,ElementRef} from "@angular/core";
import {Router} from "@angular/router";
import {NOTE_TILE_CLICKED} from "../shared/components/note-tile.component";
import {Note} from "../shared/models/note.model";
import {Tag} from "../shared/models/tag.model";
import {NotesService} from "../shared/services/notes.service";
import {TagsService} from "../shared/services/tags.service";

@Component({
    templateUrl: "./search-page.component.html",
    styleUrls: ["./search-page.component.css"],
    selector: "ce-search-page"
})
export class SearchPageComponent { 
    constructor(
        private _notesService: NotesService,
        private _router: Router,
        private _elementRef: ElementRef,
        private _tagsService: TagsService
    ) {
        this.onNoteTileClicked = this.onNoteTileClicked.bind(this);
    }

    public tags: Array<Tag> = [];

    ngOnInit() {
        this._notesService.getByCurrentUser().subscribe(x => this.notes = x.notes);
        this._tagsService.get().subscribe(x => this.tags = x.tags);
        this._elementRef.nativeElement.addEventListener(NOTE_TILE_CLICKED, this.onNoteTileClicked);
    }

    public onNoteTileClicked(e: any) {
        this._router.navigate([e.detail.note.slug]);
    }

    ngOnDestroy() {
        this._elementRef.nativeElement.removeEventListener(NOTE_TILE_CLICKED, this.onNoteTileClicked);
    }

    public notes: Array<Note> = [];
}
