/* core angular modules */
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
//import { RouterModule } from '@angular/router';
import { Http, HttpModule } from '@angular/http';

/* core ionic 2 modules */
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';

/* third party external library */
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { PubNubAngular } from 'pubnub-angular2';

/* import custom services */
import { AuthService } from '../services/auth.service';

/* import app specific routes */
//import { appRoutes } from './app.routes';

/* import root app component */
import { MyApp } from './app.component';

/* import other components , directives or pipes */
import { Dashboard } from '../pages/dashboard/dashboard';

/* configure factory for providers */
let storage: Storage = new Storage('localstorage');

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}

@NgModule({
  declarations: [
    MyApp,
    Dashboard
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Dashboard
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    PubNubAngular
  ]
})
export class AppModule {}
