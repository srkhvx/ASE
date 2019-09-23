import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { MyApp } from './app.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { HomePage } from '../pages/home/home';
import {AngularFireAuth} from 'angularfire2/auth';
import {LoginPage} from "../pages/login/login";


const config = {
  apiKey: "AIzaSyAwspcTyEMyC7oGlLitRparx4pXrSEGslE",
  authDomain: "ionic-app-6e06a.firebaseapp.com",
  databaseURL: "https://ionic-app-6e06a.firebaseio.com",
  projectId: "ionic-app-6e06a",
  storageBucket: "ionic-app-6e06a.appspot.com",
  messagingSenderId: "399375638734",
  appId: "1:399375638734:web:7d482f52d8220c9c6eb09f"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(config),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    AngularFireAuth,
    Device
  ]
})
export class AppModule {}
