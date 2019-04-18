import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { environment} from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';

import { AuthService } from './services/auth.service';
import { AuthenticationGuardService } from './services/authentication-guard.service';
import { FireService } from './services/fire.service';
import { UserService } from './services/user.service';
import { NotificationService } from './services/notification.service';
import { Auth0Service } from './services/auth0.service';
import { EndUserService } from './services/end-user.service';
import { GameService } from './services/game.service';

import { TicketsComponent } from './comp/tickets/tickets.component';
import { SidebarComponent } from './comp/sidebar/sidebar.component';
import { GameListComponent } from './comp/game-list/game-list.component';
import { LoginComponent } from './comp/login/login.component';
import { DataService } from './services/data.service';
import { SpinnerComponent } from './comp/spinner/spinner.component';
import { AdminComponent } from './comp/admin/admin.component';
import { ContactComponent } from './comp/contact/contact.component';
import { TermsComponent } from './comp/terms/terms.component';
import { SafePipe } from './pipes/safe';
import { SuccessComponent } from './comp/spinners/success/success.component';
import { ProcessingComponent } from './comp/spinners/processing/processing.component';
import { FailedComponent } from './comp/spinners/failed/failed.component';
import { GameSetupComponent } from './comp/admin/game-setup/game-setup.component';
import { SponsersSetupComponent } from './comp/admin/sponsers-setup/sponsers-setup.component';
import { TicketSetupComponent } from './comp/admin/ticket-setup/ticket-setup.component';
import { NotFoundComponent } from './comp/not-found/not-found.component';
import { SearchComponent } from './comp/admin/search/search.component';
import { LogsComponent } from './comp/admin/logs/logs.component';
import { GameModeComponent } from './comp/admin/game-mode/game-mode.component';
import { MainAdminComponent } from './comp/main-admin/main-admin.component';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { AdminGuardService } from './services/admin-guard.service';
import { PlayGameService } from './services/play-game.service';
import { GameResultsComponent } from './comp/admin/game-results/game-results.component';
import { GameMainComponent } from './comp/game-main/game-main.component';
import { EmailVerificationComponent } from './comp/email-verification/email-verification.component';
import { EmvReqScreenComponent } from './comp/pages/emv-req-screen/emv-req-screen.component';
import { FileInputComponent } from './comp/aaa/file-input/file-input.component';
import { ShortedStringPipe } from './pipes/shorted-string.pipe';
import { MemSizePipe } from './pipes/mem-size.pipe';
import { FirebaseUploadService } from './services/firebase-upload.service';
import { AssetMapService } from './services/asset-map.service';
import { GameManageComponent } from './comp/admin/game-manage/game-manage.component';
import { TableComponent } from './comp/aaa/table/table.component';
import { UserlistCompComponent } from './comp/admin/search/userlist-comp/userlist-comp.component';

@NgModule({
  declarations: [
    AppComponent,
    TicketsComponent,
    SidebarComponent,
    GameListComponent,
    LoginComponent,
    SpinnerComponent,
    AdminComponent,
    ContactComponent,
    TermsComponent,
    SafePipe,
    SuccessComponent,
    ProcessingComponent,
    FailedComponent,
    GameSetupComponent,
    SponsersSetupComponent,
    TicketSetupComponent,
    NotFoundComponent,
    SearchComponent,
    LogsComponent,
    GameModeComponent,
    MainAdminComponent,
    GameResultsComponent,
    GameMainComponent,
    EmailVerificationComponent,
    EmvReqScreenComponent,
    FileInputComponent,
    ShortedStringPipe,
    MemSizePipe,
    GameManageComponent,
    TableComponent,
    UserlistCompComponent
  ],
  imports: [
    BrowserModule, FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthenticationGuardService,
    FireService,
    UserService,
    NotificationService,
    Auth0Service,
    EndUserService,
    GameService,
    DataService,
    CanDeactivateGuardService,
    AdminGuardService,
    PlayGameService,
    FirebaseUploadService,
    AssetMapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
