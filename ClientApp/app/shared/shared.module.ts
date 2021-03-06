import { constants } from "./constants";
import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {HttpClientModule,HTTP_INTERCEPTORS} from "@angular/common/http";
import {FormsModule,ReactiveFormsModule} from "@angular/forms";

import { AuthenticationService } from "./services/authentication.service";
import { CorrelationIdsList } from "./services/correlation-ids-list";
import { LoginRedirectService } from "./services/login-redirect.service";
import { EventHub, EventHubFactory } from "./services/event-hub";
import { Storage } from "./services/storage.service";
import { ErrorService } from "./services/error.service";
import { Logger } from "./services/logger.service";
import { PopoverService } from "./services/popover.service";
import { Ruler } from "./services/ruler";
import { Position } from "./services/position";
import { Space } from "./services/space";
import { ModalService, ModalServiceFactory } from "./services/modal.service";
import { UsersService } from "./services/users.service";
import { NotesService } from "./services/notes.service";
import { TagsService } from "./services/tags.service";
import { TenantsService } from "./services/tenants.service";
import { SpeechRecognitionService } from "./services/speech-recognition.service";

import { AuthGuardService } from "./guards/auth-guard.service"
import { TenantGuardService } from "./guards/tenant-guard.service";
import { EventHubConnectionGuardService } from "./guards/event-hub-connection-guard.service";
import { CurrentUserGuardService } from "./guards/current-user-guard.service";

import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { HttpLogInterceptor } from "./interceptors/http-log.interceptor";
import { TenantInterceptor } from "./interceptors/tenant.interceptor";

import { HeaderComponent } from "./components/header.component";
import { LoginComponent } from "./components/login.component";
import { NoteListComponent } from "./components/note-list.component";
import { NoteTileComponent } from "./components/note-tile.component";
import { QuillTextEditorComponent } from "./components/quill-text-editor.component";
import { SetTenantFormComponent } from "./components/set-tenant-form.component";
import { HamburgerButtonComponent } from "./components/hamburger-button.component";
import { TagComponent } from "./components/tag.component";
import { TagsComponent } from "./components/tags.component";
import { TagListItemComponent } from "./components/tag-list-item.component";
import { TagListComponent } from "./components/tag-list.component";
import "./components/menu.component";
import "./components/tag-edit-modal.component";
import "./components/tag-edit.component";
import "./components/backdrop.component";

import { LogLevel } from "./services/logger.service";

const declarables = [
    HeaderComponent,
    LoginComponent,
    NoteListComponent,
    NoteTileComponent,
    QuillTextEditorComponent,
    SetTenantFormComponent,
    HamburgerButtonComponent,
    TagComponent,
    TagsComponent,
    TagListComponent,
    TagListItemComponent
];

@NgModule({
    imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
    declarations: [declarables],
    exports:[declarables],
    providers: [
        { provide: constants.MINIMUM_LOG_LEVEL, useValue: LogLevel.Trace },
        { provide: ModalService, useFactory: ModalServiceFactory },
        { provide: EventHub, useFactory: EventHubFactory, deps:[ Logger, Storage] },
        AuthGuardService,
        Logger,
        AuthenticationService,
        CorrelationIdsList,
        ErrorService,
        LoginRedirectService,
        TenantGuardService,
        EventHubConnectionGuardService,
        CurrentUserGuardService,
        Storage,
        PopoverService,
        Space,
        Ruler,
        Position,
        ModalService,
        UsersService,
        NotesService,
        TagsService,
        TenantsService,
        SpeechRecognitionService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TenantInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpLogInterceptor,
            multi: true
        }
    ]
})
export class SharedModule {}