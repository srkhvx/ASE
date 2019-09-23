import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import {LoginPage} from '../pages/login/login';

const config = {
  apiKey: "AIzaSyAwspcTyEMyC7oGlLitRparx4pXrSEGslE",
  authDomain: "ionic-app-6e06a.firebaseapp.com",
  databaseURL: "https://ionic-app-6e06a.firebaseio.com",
  projectId: "ionic-app-6e06a",
  storageBucket: "ionic-app-6e06a.appspot.com",
  messagingSenderId: "399375638734",
  appId: "1:399375638734:web:7d482f52d8220c9c6eb09f"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}
