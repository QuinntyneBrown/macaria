import {Component, Input, Output, EventEmitter} from "@angular/core";
import { Tag } from "../models/tag.model";

@Component({
    templateUrl: "./tag.component.html",
    styleUrls: ["./tag.component.css"],
    selector: "ce-tag"
})
export class TagComponent { 
    constructor() {
        this.tagClicked = new EventEmitter();
    }

    ngOnInit() {

    }

    @Output()
    public tagClicked: EventEmitter<any>;

    @Input()
    public tag: Tag = <Tag>{};

    @Input()
    public selectedTags: Array<Tag> = [];

    public get isSelected(): boolean { return this.selectedTags.filter((x) => this.tag.id = x.id).length > 0; }
}
