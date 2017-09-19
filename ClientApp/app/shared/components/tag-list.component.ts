import { Component, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
import { Tag } from "../models/tag.model";

@Component({
    templateUrl: "./tag-list.component.html",
    styleUrls: ["./tag-list.component.css"],
    selector: "ce-tag-list"
})
export class TagListComponent {
    @Input()
    public tags: Array<Tag> = [];

    @Output()
    public select: EventEmitter<any> = new EventEmitter();

    @Output()
    public delete: EventEmitter<any> = new EventEmitter();
}
