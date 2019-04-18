import { Routes } from '@angular/router';
import { TicketsComponent } from './comp/tickets/tickets.component';
import { GameListComponent } from './comp/game-list/game-list.component';
import { GameMainComponent } from './comp/game-main/game-main.component';
import { LoginComponent } from './comp/login/login.component';
import { AdminComponent } from './comp/admin/admin.component';
import { ContactComponent } from './comp/contact/contact.component';
import { TermsComponent } from './comp/terms/terms.component';
import { AuthenticationGuardService } from './services/authentication-guard.service';
import { NotFoundComponent } from './comp/not-found/not-found.component';
import { GameModeComponent } from './comp/admin/game-mode/game-mode.component';
import { MainAdminComponent } from './comp/main-admin/main-admin.component';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { AdminGuardService } from './services/admin-guard.service';
import { GameResultsComponent } from './comp/admin/game-results/game-results.component';
import { EmailVerificationComponent } from './comp/email-verification/email-verification.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: 'games', component: GameMainComponent, children: [
    {path: '', component: GameListComponent},
    {path: 'game', component: GameListComponent},
    { path: 'game_results', component: GameResultsComponent},
    { path: 'game_results/:id', component: GameResultsComponent},
  ]},
  { path: 'contact_us', component: ContactComponent, canActivate: [AuthenticationGuardService]},
  { path: 'terms_and_conditions', component: TermsComponent},
  { path: 'login', component: LoginComponent},
  { path: 'verify', component: EmailVerificationComponent},
  { path: 'verify/:id', component: EmailVerificationComponent},
  { path: 'admin', component: AdminComponent,
  canActivateChild: [AdminGuardService],
  children: [
    { path: '', redirectTo: 'main', pathMatch: 'full'},
    { path: 'main', component: MainAdminComponent, canActivate: [AuthenticationGuardService]},
    { path: 'game_mode', component: GameModeComponent,
     canActivate: [AuthenticationGuardService], canDeactivate: [CanDeactivateGuardService]},
    { path: 'game_mode/:id', component: GameModeComponent,
     canActivate: [AuthenticationGuardService], canDeactivate: [CanDeactivateGuardService]},
  ]},
  { path: 'tickets', component: TicketsComponent, canActivate: [AuthenticationGuardService]},
  { path: 'tickets/:gid', component: TicketsComponent, canActivate: [AuthenticationGuardService]},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];
