import {Component, Input, Output, EventEmitter, ElementRef} from "@angular/core";
import {Tag} from "../models/tag.model";
import { Logger } from "../services/logger.service";

@Component({
    templateUrl: "./tags.component.html",
    styleUrls: ["./tags.component.css"],
    selector: "ce-tags"
})
export class TagsComponent {

    constructor(private _elementRef: ElementRef) {
        this.tagClicked = new EventEmitter();
    }
    
    @Output()
    public tagClicked: EventEmitter<any>;

    @Input()
    public tags: Array<Tag> = [];

    @Input()
    public selectedTags: Array<Tag> = [];
}
