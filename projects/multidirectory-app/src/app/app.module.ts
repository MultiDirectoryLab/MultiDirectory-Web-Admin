import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HotkeyModule } from 'angular2-hotkeys';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/app-layout/header/header.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';
import { MultidirectoryAdapterSettings } from './core/api/adapter-settings';
import { ApiAdapter } from './core/api/api-adapter';
import { GlobalErrorHandler } from './core/api/error-handling/global-error-handler';
import { AuthorizationModule } from './core/authorization/authorization.module';
import { TranslocoRootModule } from './transloco-root.module';
import { DisplayErrorComponent } from './components/errors/display-error/display-error.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { EditorsModule } from './features/ldap-browser/components/editors/editors.module';
import { AppSettingsModule } from './features/settings/app-settings.module';
import { SearchPanelModule } from './features/search/search-panel.module';
import { PropertiesModule } from './features/ldap-entry-properties/properties.module';
import { WindowsComponent } from './components/app-layout/shared/windows/windows.component';
import { AppFormsModule } from "./features/forms/forms.module";
import { SharedComponentsModule } from './components/app-layout/shared/shared.module';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        NavigationComponent,
        DisplayErrorComponent,
        AppLayoutComponent,
        SidebarComponent 
    ],
    providers: [
        provideAnimations(),
        {
            provide: 'apiAdapter',
            useFactory: (adapterSettings: MultidirectoryAdapterSettings, httpClient: HttpClient, toastr: ToastrService) => new ApiAdapter<MultidirectoryAdapterSettings>(httpClient, adapterSettings, toastr),
            deps: [MultidirectoryAdapterSettings, HttpClient, ToastrService]
        },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        DragDropModule,
        AppRoutingModule,
        AppSettingsModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MultidirectoryUiKitModule,
        ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
        HotkeyModule.forRoot({
            cheatSheetCloseEsc: true,
        }),
        AuthorizationModule,
        TranslocoRootModule,
        EditorsModule,
        PropertiesModule,
        SearchPanelModule,
        AppFormsModule,
        SharedComponentsModule
    ]
})
export class AppModule { }
