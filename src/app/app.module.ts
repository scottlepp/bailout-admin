import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { defaultFirebase, FIREBASE_PROVIDERS } from 'angularfire2';
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from './app.routes';
import { LoginComponent } from '../login/login';
import { BondsComponent } from '../reports/bonds';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { ReportComponent } from '../reports/report';
import { AuthGuard } from './auth-guard.service';
import { EditComponent } from '../reports/edit';
import { ModalComponent } from '../reports/modal';

const firebaseConfig  = {
    apiKey: 'AIzaSyBG9SdyCTKlowUnCN4F47rb8DQtXocf1Ro',
    authDomain: 'bailout-38e42.firebaseapp.com',
    databaseURL: 'https://bailout-38e42.firebaseio.com',
    storageBucket: 'bailout-38e42.appspot.com',
    messagingSenderId: '94440734373'
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BondsComponent,
    ReportComponent,
    EditComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig , myFirebaseAuthConfig),
    RouterModule.forRoot(appRoutes),
    ToastModule.forRoot()
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
