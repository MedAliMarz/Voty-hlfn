import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoterBoardComponent } from './pages/voter-board/voter-board.component';
import { AdminBoardComponent } from './pages/admin-board/admin-board.component';
import { LoginComponent } from './components/login/login.component';
import { CandidacyComponent } from './components/candidacy/candidacy.component';
import { VotingComponent } from './components/voting/voting.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { StatsComponent } from './pages/stats/stats.component';
// guards
import {AuthGuard} from './guards/auth.guard'
import {LoginGuard} from './guards/login.guard'

import { CandidateComponent } from './components/candidate/candidate.component';
import { ElectionComponent } from './components/election/election.component';
import { LandingComponent } from './pages/landing/landing.component';
const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'admin',
    component: AdminBoardComponent,
    
  },
  {
    path: 'voter',
    component: VoterBoardComponent,
    
  },
  {
    path:'candidacy',
    component: CandidacyComponent,
    
  },
  {
    path:'voting',
    component: VotingComponent,
    
  },
  {
    path:'faq',
    component: FaqComponent
  },
  {
    path:'about',
    component: AboutComponent
  },
  {
    path:'contact',
    component: ContactComponent
  },
  {
    path:'stats',
    component: StatsComponent
  },
  {
    path:'candidate/:id',
    component: CandidateComponent,
    
  },
  {
    path:'election/:id',
    component: ElectionComponent,

    
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
