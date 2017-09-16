import { Component, ElementRef, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

declare var Quill: any;

@Component({
    templateUrl: "./quill-text-editor.component.html",
    styleUrls: ["./quill-text-editor.component.css"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => QuillTextEditorComponent),
            multi: true
        }
    ],
    selector: "ce-quill-text-editor"
})
export class QuillTextEditorComponent implements ControlValueAccessor {
    constructor(private _elementRef: ElementRef) { }

    public get value() { return this.nativeElement.children[0].innerHTML; }

    public writeValue(value: any): void { this.nativeElement.children[0].innerHTML = value; }

    public registerOnChange(fn: any): void { this.onChangeCallback = fn; }

    public registerOnTouched(fn: any): void { this.onTouchedCallback = fn; }

    public setDisabledState?(isDisabled: boolean): void {  }

    public onTouchedCallback: () => void = () => { };

    public onChangeCallback: (_: any) => void = () => { };

    public ngAfterViewInit() {
        this._quill = new Quill(this.nativeElement, {
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'underline'],
                    [{ 'list': 'ordered' }],
                    []
                ]
            },
            theme: 'snow'
        });
    }

    public get nativeElement(): HTMLElement { return this._elementRef.nativeElement.querySelector(".editor") as HTMLElement; }

    private _quill: any;
}
