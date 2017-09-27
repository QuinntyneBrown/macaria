import {Component} from "@angular/core";
import {TagsService} from "../shared/services/tags.service";
import {Tag} from "../shared/models/tag.model";
import {ModalService} from "../shared/services/modal.service";
import {SAVE_TAG} from "../shared/components/tag-edit-modal.component";
import {CorrelationIdsList} from "../shared/services/correlation-ids-list";
import {addOrUpdate} from "../shared/utilities/add-or-update";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EventHub} from "../shared/services/event-hub";
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


    ngOnInit() {
        this._tagsService.get().subscribe(x => this.tags$.next(x.tags));

        document.body.addEventListener(SAVE_TAG, this.onSaveTagClick);

        this._eventHub.events.subscribe(x => {
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
        document.body.removeEventListener(SAVE_TAG, this.onSaveTagClick)
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