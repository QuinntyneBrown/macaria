import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Tag} from "../models/tag.model";

@Component({
    templateUrl: "./tags.component.html",
    styleUrls: ["./tags.component.css"],
    selector: "ce-tags"
})
export class TagsComponent {

    constructor() {
        this.tagClicked = new EventEmitter();
    }

    ngOnInit() {

    }

    @Output()
    public tagClicked: EventEmitter<any>;

    @Input()
    public tags: Array<Tag> = [];

    @Input()
    public selectedTags: Array<Tag> = [];
}
