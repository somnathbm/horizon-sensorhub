/* core angular modules */
import { Injectable, NgZone } from '@angular/core';

/* core ionic 2 modules */
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

/* third party external modules */
import { tokenNotExpired, AuthHttp } from 'angular2-jwt';
//import { Observable } from 'rxjs/Rx';

// avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  // configure Auth0
  private lock = new Auth0Lock('5O0AJESQjxeOtKfoFasek5CX0zsbx5FB', 'somnathbm.auth0.com', {
    auth: {
      redirect: false
    }
  });
  //private JwtHelper: JwtHelper = new JwtHelper();
  private storage: Storage = new Storage('localstorage');
  public user: Object;
  private accessToken: string;
  private idToken: string;
  private zoneImpl: NgZone;
  private loader: any;

  constructor(private authHttp: AuthHttp, private zone: NgZone, private loadr: LoadingController) {
    this.zoneImpl = zone;

    // check if there's a profile saved in local storage
    this.storage.get('profile').then(profile => {
      this.user = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });

    this.storage.get('id_token').then(token => {
      this.idToken = token;
    });

    // listen when authentication event
    this.lock.on('authenticated', authResult => {
      if(authResult && authResult.accessToken && authResult.idToken) {
        this.loader.dismiss();
        this.storage.set('access_token', authResult.accessToken);
        this.storage.set('id_token', authResult.idToken);
        this.accessToken = authResult.accessToken;
        this.idToken = authResult.idToken;

        // fetch profile information
        this.lock.getUserInfo(this.accessToken, (error, profile) => {
          if(error) {
            // handle error
            alert(error);
            return;
          }
          profile.user_metadata = profile.user_metadata || {};
          this.storage.set('profile', JSON.stringify(profile));
          this.user = profile;
        });

        this.lock.hide();
        this.zoneImpl.run(() => this.user = authResult.profile);
      }
    });

  }

  // display lock widget and handle sign in or sign up
  public login() {
    this.loader = this.loadr.create({
      content: 'authenticating...',
      dismissOnPageChange: true
    });
    this.loader.present();
    this.lock.show();
  }

  // check authentication status
  public authenticated() {
    return tokenNotExpired('id_token', this.idToken);
  }

  // log out and clear the current users token
  logout() {
    this.storage.remove('profile');
    this.storage.remove('access_token');
    this.storage.remove('id_token');
    this.idToken = null;
    this.zoneImpl.run(() => this.user = null);
  }
}
