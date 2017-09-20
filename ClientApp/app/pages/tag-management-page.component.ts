import {Component} from "@angular/core";
import {TagsService} from "../shared/services/tags.service";
import {Tag} from "../shared/models/tag.model";
import {ModalService} from "../shared/services/modal.service";

@Component({
    templateUrl: "./tag-management-page.component.html",
    styleUrls: ["./tag-management-page.component.css"],
    selector: "ce-tag-management-page"
})
export class TagManagementPageComponent {
    constructor(
        private _modalService: ModalService,
        private _tagsService: TagsService) { }

    ngOnInit() {
        this._tagsService.get().subscribe(x => this.tags = x.tags);
    }

    public openEditTagModal() {        
        this._modalService.open({
            html: "<ce-tag-edit-modal></ce-tag-edit-modal>"
        });
    }

    public tags: Array<Tag> = [];
}
