import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { CorrelationIdsList } from "../services/correlation-ids-list";
import { Logger } from "../services/logger.service";
import { Note } from "../models/note.model";
import { Tag } from "../models/tag.model";
import { addOrUpdate } from "../utilities/add-or-update";
import { pluckOut } from "../utilities/pluck-out";
import { NotesService } from "../services/notes.service";

export abstract class NoteTagBehavior {

    public handleNoteTagClicked($event) {
        this.logger.trace(`(NoteTagBehavior) handleTagClicked: ${JSON.stringify($event)}`);

        const tag = <Tag>$event.tag;
        const correlationId = this.correlationIdsList.newId();

        if (this.note$.value.tags.find((x) => x.id == tag.id) != null) {
            this.notesService.removeTag({ noteId: this.note$.value.id, tagId: tag.id, correlationId })
                .subscribe();

            pluckOut({ items: this.note$.value.tags, value: tag.id });

            return;
        }

        this.notesService.addTag({ noteId: this.note$.value.id, tagId: tag.id, correlationId })
            .subscribe();

        addOrUpdate({ items: this.note$.value.tags, item: tag });
    }

    public abstract notesService: NotesService;

    public abstract note$: BehaviorSubject<Note>;
    
    public abstract correlationIdsList: CorrelationIdsList;

    public abstract logger: Logger;
}