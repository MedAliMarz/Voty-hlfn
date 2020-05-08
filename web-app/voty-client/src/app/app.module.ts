import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbInputModule,
         NbCardModule, NbSidebarModule, NbMenuModule,
         NbButtonModule, NbAccordionModule,NbIconModule,
         NbStepperModule, NbDatepickerModule, NbToggleModule,
         NbSelectModule, NbDialogModule, NbActionsModule,
         NbContextMenuModule, NbUserModule, NbToastrModule,
         NbSpinnerModule, NbCalendarRangeModule,NbCalendarModule,NbCalendarKitModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { VoterBoardComponent } from './pages/voter-board/voter-board.component';
import { AdminBoardComponent } from './pages/admin-board/admin-board.component';
import { from } from 'rxjs';
import { CandidateComponent } from './components/candidate/candidate.component';
import { CandidatesListComponent } from './components/candidates-list/candidates-list.component';
import { ElectionComponent } from './components/election/election.component';
import { ElectionsListComponent } from './components/elections-list/elections-list.component';
import { VotingComponent } from './components/voting/voting.component';
import { CandidacyComponent } from './components/candidacy/candidacy.component';
import { LandingComponent } from './pages/landing/landing.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { StatsComponent } from './pages/stats/stats.component';
// The smart table module
import { Ng2SmartTableModule } from 'ng2-smart-table';

// Charjs modules
import { ChartModule } from 'angular2-chartjs';

//interceptors
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {JwtInterceptor} from './guards/jwt.interceptor';
// range component
import {NbCalendarRangeComponent} from '@nebular/theme'
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    VoterBoardComponent,
    AdminBoardComponent,
    CandidateComponent,
    CandidatesListComponent,
    ElectionComponent,
    ElectionsListComponent,
    VotingComponent,
    CandidacyComponent,
    LandingComponent,
    FaqComponent,
    ContactComponent,
    AboutComponent,
    StatsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    NbMenuModule.forRoot(),
    NbContextMenuModule,
    NbSidebarModule.forRoot(),
    NbThemeModule.forRoot({ name: 'corporate' }),
    NbLayoutModule,
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot({preventDuplicates:true,limit:5}),
    NbSpinnerModule,
    NbCardModule,
    ChartModule,
    NbUserModule,
    NbAccordionModule,
    NbButtonModule,
    NbStepperModule,
    NbToggleModule,
    NbDatepickerModule.forRoot(),
    NbCalendarRangeModule,
    NbInputModule,
    NbActionsModule,
    NbSelectModule,
    NbEvaIconsModule,
    NbIconModule,
    Ng2SmartTableModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
