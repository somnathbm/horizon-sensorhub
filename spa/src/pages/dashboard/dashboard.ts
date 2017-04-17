/* core angular 2 modules */
import { Component } from '@angular/core';

/* core ionic 2 modules */
import { NavController, IonicPage } from 'ionic-angular';

/* third party external library */
import { Observable } from 'rxjs/Rx';
import { PubNubAngular } from 'pubnub-angular2';

/* app services */
import { AuthService } from '../../services/auth.service';
import { NetworkWatcherService } from '../../services/network-watcher.service';
import { DataStreamingService } from '../../services/data-streaming.service';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class Dashboard {

  // memeber variables
  private isCientOffline: boolean = true;
  private isApplianceOn: boolean = false;
  private nodeMCUOffline: boolean = true;

  constructor(public auth: AuthService, private network: NetworkWatcherService, private streamSvc: DataStreamingService) {
    /* call network watcher service */
    this.determineNetworkState();
    this.watchNetworkState();

    /* init streaming sdk */
    this.streamSvc.initPubNubSDK();
  }

  // determine network state
  determineNetworkState() {
    this.isCientOffline = navigator.onLine ? false:true;
  }

  // handle network state by using network watcher service
  watchNetworkState(){
    this.network.notifyNetworkOffline().subscribe( e => this.isCientOffline = true);
    this.network.notifyNetworkOnline().subscribe(e => this.isCientOffline = false);
  }
}
