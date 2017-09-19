import {Component,Input,Output,EventEmitter} from "@angular/core";

@Component({
    templateUrl: "./tag-list-item.component.html",
    styleUrls: [
        "../../../styles/list-item.css",
        "./tag-list-item.component.css"
    ],
    selector: "ce-tag-list-item"
})
export class TagListItemComponent {  
    constructor() {
        this.edit = new EventEmitter();
        this.delete = new EventEmitter();		
    }
      
    @Input()
    public tag: any = {};
    
    @Output()
    public edit: EventEmitter<any>;

    @Output()
    public delete: EventEmitter<any>;        
}
