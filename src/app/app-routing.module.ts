import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReviewFwaComponent } from './components/review-fwa/review-fwa.component';
import { ReviewScheduleComponent } from './components/review-schedule/review-schedule.component';
import { SubmitFwaComponent } from './components/submit-fwa/submit-fwa.component';
import { UpdateScheduleComponent } from './components/update-schedule/update-schedule.component';
import { ViewFwaAnalyticsComponent } from './components/view-fwa-analytics/view-fwa-analytics.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'submitFwa', component: SubmitFwaComponent },
    { path: 'reviewFwa', component: ReviewFwaComponent },
    { path: 'updateSchedule', component: UpdateScheduleComponent },
    { path: 'reviewSchedule', component: ReviewScheduleComponent },
    { path: 'viewFWAAnalytics', component: ViewFwaAnalyticsComponent },
    { path: '**', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }