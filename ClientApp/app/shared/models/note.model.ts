import { constants } from "../constants";
import { Tag } from "./tag.model";

declare var moment:any;

export class Note { 

    public id:any;
    
    public title: string = moment().format(constants.DATE_FORMAT);

    public body: string;

    public tags: Array<Tag> = [];
    
}
