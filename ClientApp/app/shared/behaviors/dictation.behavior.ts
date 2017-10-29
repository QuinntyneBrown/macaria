import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { CorrelationIdsList } from "../services/correlation-ids-list";
import { SpeechRecognitionService } from "../services/speech-recognition.service";
import { Logger } from "../services/logger.service";
import { Note } from "../models/note.model";
import { addOrUpdate } from "../utilities/add-or-update";
import { pluckOut } from "../utilities/pluck-out";
import { NotesService } from "../services/notes.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

export abstract class DictationBehavior {

    public startDictationBehavior() {
        this.speechRecognitionService.start();

        this.speechRecognitionService.finalTranscript$
            .takeUntil(this.ngUnsubscribe)
            .filter(x => x && x.length > 0)
            .map(x => this.quillEditorFormControl.patchValue(`${this.quillEditorFormControl.value}<p>${x}</p>`))
            .map(x => this.correlationIdsList.newId())
            .switchMap(correlationId => this.notesService.addOrUpdate({
                correlationId,
                note: {
                    id: this.note$.value.id,
                    title: this.note$.value.title,
                    body: this.quillEditorFormControl.value
                },
            }))
            .subscribe();
    }
    
    public stopDictationBehavior() { this.speechRecognitionService.stop(); }

    public abstract quillEditorFormControl: FormControl;

    public abstract speechRecognitionService: SpeechRecognitionService;

    public abstract ngUnsubscribe: Subject<void>;

    public abstract notesService: NotesService;

    public abstract note$: BehaviorSubject<Note>;

    public abstract correlationIdsList: CorrelationIdsList;

    public abstract logger: Logger;
}