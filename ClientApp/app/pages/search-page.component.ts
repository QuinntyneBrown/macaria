import {Component,ElementRef} from "@angular/core";
import {Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {NOTE_TILE_CLICKED} from "../shared/components/note-tile.component";
import {Note} from "../shared/models/note.model";
import {Tag} from "../shared/models/tag.model";
import {NotesService} from "../shared/services/notes.service";
import {TagsService} from "../shared/services/tags.service";
import {Logger} from "../shared/services/logger.service";

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
        private _logger: Logger,
        private _tagsService: TagsService
    ) {
        this.onNoteTileClicked = this.onNoteTileClicked.bind(this);
    }

    private _ngUnsubscribe: Subject<void> = new Subject<void>();

    public tags: Array<Tag> = [];

    ngOnInit() {
        this._logger.trace(`(SearchPage) ngOnInit`);

        this._notesService.getByCurrentUser().takeUntil(this._ngUnsubscribe).subscribe(x => this.notes = x.notes);
        this._tagsService.get().takeUntil(this._ngUnsubscribe).subscribe(x => this.tags = x.tags);
        this._elementRef.nativeElement.addEventListener(NOTE_TILE_CLICKED, this.onNoteTileClicked);

        Observable.fromEvent(this._elementRef.nativeElement, NOTE_TILE_CLICKED)
            .takeUntil(this._ngUnsubscribe)
            .map(this.onNoteTileClicked)
            .subscribe();
    }

    public onNoteTileClicked($event: any) {
        this._logger.trace(`(SearchPage) onNoteTileClicked: ${JSON.stringify($event)}`);

        this._router.navigate([$event.detail.note.slug]);
    }

    ngOnDestroy() {
        this._logger.trace(`(SearchPage) ngOnDestroy`);

        this._ngUnsubscribe.next();
    }

    public notes: Array<Note> = [];
}
