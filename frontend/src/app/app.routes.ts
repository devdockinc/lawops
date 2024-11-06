import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { adminGuard, authGuard, loginGuard } from './guards/auth.guard';
import { FinancesComponent } from './finances/finances.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { ManagementComponent } from './management/management.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [ loginGuard ] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [ authGuard ] },
    { path: 'finances', component: FinancesComponent, canActivate: [ adminGuard ] },
    { path: 'privacy', component: PrivacyPolicyComponent },
    { path: 'management', component: ManagementComponent, canActivate: [ adminGuard ] },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [ authGuard ] },
    { path: 'announcements', component: AnnouncementsComponent, canActivate: [ authGuard ] },
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: '**', component: PageNotFoundComponent }
];
