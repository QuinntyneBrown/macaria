import { constants } from "../constants";

declare var moment:any;

export class Note { 

    public id:any;
    
    public title: string = moment().format(constants.DATE_FORMAT);

    public body: string;
    
}
