import {Component, Input, Output, EventEmitter, HostBinding} from "@angular/core";
import { Tag } from "../models/tag.model";
import { Logger } from "../services/logger.service";

@Component({
    templateUrl: "./tag.component.html",
    styleUrls: ["./tag.component.css"],
    selector: "ce-tag"
})
export class TagComponent {   


    @Input()
    public tag: Tag = <Tag>{};

    @Input()
    public selectedTags: Array<Tag> = [];

    @HostBinding("class.is-selected")
    public get isSelected(): boolean { return this.selectedTags.filter((x) => this.tag.id == x.id).length > 0; }
}
