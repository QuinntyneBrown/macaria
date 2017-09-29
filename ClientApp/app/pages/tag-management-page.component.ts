import {Component} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {SAVE_TAG} from "../shared/components/tag-edit-modal.component";
import {Tag} from "../shared/models/tag.model";
import {EventHub} from "../shared/services/event-hub";
import {TagsService} from "../shared/services/tags.service";
import {ModalService} from "../shared/services/modal.service";
import {CorrelationIdsList} from "../shared/services/correlation-ids-list";
import {addOrUpdate} from "../shared/utilities/add-or-update";
import {pluckOut} from "../shared/utilities/pluck-out";

@Component({
    templateUrl: "./tag-management-page.component.html",
    styleUrls: ["./tag-management-page.component.css"],
    selector: "ce-tag-management-page"
})
export class TagManagementPageComponent {
    constructor(
        private _correlationIdsList: CorrelationIdsList,
        private _eventHub: EventHub,
        private _modalService: ModalService,
        private _tagsService: TagsService) {
        this.onSaveTagClick = this.onSaveTagClick.bind(this);        
    }

    private _ngUnsubscribe: Subject<void> = new Subject<void>();

    ngOnInit() {
        this._tagsService.get()
            .takeUntil(this._ngUnsubscribe)
            .subscribe(x => this.tags$.next(x.tags));
        
        Observable.fromEvent(document.body, SAVE_TAG)
            .takeUntil(this._ngUnsubscribe)
            .map(e => this.onSaveTagClick(e))
            .subscribe();
        
        this._eventHub.events
            .takeUntil(this._ngUnsubscribe)
            .subscribe(x => {
            if (this._correlationIdsList.hasId(x.payload.correlationId) && x.payload.entity && x.type == "[Tags] TagAddedOrUpdated") {                
                this.tags$.next(addOrUpdate({
                    items: this.tags$.value,
                    item: x.payload.entity
                }));
            }
        });
    }

    onEdit($event) {
        this._modalService.open({
            html: `<ce-tag-edit-modal tag='${JSON.stringify($event.detail.tag)}'></ce-tag-edit-modal>`
        });
    }

    onDelete($event) {
        const correlationId = this._correlationIdsList.newId();

        this._tagsService.remove({
            tag: $event.detail.tag,
            correlationId
        }).subscribe();

        this.tags$.next(pluckOut({
            items: this.tags$.value,
            value: $event.detail.tag.id
        }));
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
    }

    onSaveTagClick(e) {
        const correlationId = this._correlationIdsList.newId();
        this._tagsService.addOrUpdate({ tag: e.detail.tag, correlationId }).subscribe();
    }

    public openEditTagModal() {        
        this._modalService.open({
            html: "<ce-tag-edit-modal></ce-tag-edit-modal>"
        });
    }

    public tags$: BehaviorSubject<Array<Tag>> = new BehaviorSubject([]);
}