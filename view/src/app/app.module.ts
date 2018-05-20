import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from  '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ListCVComponent } from './components/list-cv/list-cv.component';
import { ListJobComponent } from './components/list-job/list-job.component';
import { MatchComponent } from './components/match/match.component';

import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';



const appRoutes: Routes = [
  {path:'', component: HomeComponent},
  {path:'list-cv',component: ListCVComponent},
  {path:'list-job',component: ListJobComponent},
  {path:'match',component: MatchComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ListCVComponent,
    ListJobComponent,
    MatchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService,DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
