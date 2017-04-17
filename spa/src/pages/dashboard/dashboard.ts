/* core angular 2 modules */
import { Component } from '@angular/core';

/* core ionic 2 modules */
import { NavController } from 'ionic-angular';

/* third party external library */
import { Observable } from 'rxjs/Rx';
import { PubNubAngular } from 'pubnub-angular2';

/* app services */
import { AuthService } from '../../services/auth.service';
import { NetworkWatcherService } from '../../services/network-watcher.service';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class Dashboard {

  // memeber variables
  // PubNub production keyset
  private pubnubKeyProd = {
    publishKey: 'pub-c-c2afe15d-b8f5-4761-b856-df5d40f58769',
    subscribeKey: 'sub-c-452ec980-1cf6-11e7-962a-02ee2ddab7fe',
    ssl: true,
    restore: true
  };

  // PubNub development keyset
  private pubnubKeyDev = {
    publishKey: 'pub-c-10de8c04-0008-44a4-b20f-bae630c6ccd8',
    subscribeKey: 'sub-c-711a4a72-1a0f-11e7-a9ec-0619f8945a4f',
    ssl: true,
    restore: true
  };

  private isCientOffline: boolean = true;
  private isApplianceOn: boolean = false;
  private nodeMCUOffline: boolean = true;

  constructor(public auth: AuthService, private network: NetworkWatcherService, private pubnub: PubNubAngular) {
    /* init pubnub sdk & subscribe to channels */
    this.initPubNubSDK();
    this.channelSubscription();

    /* call network watcher service */
    this.determineNetworkState();
    this.watchNetworkState();

    /* listen for PubNub events */
    this.getHubStatus();
    this.getHubMessage();
  }

  // initialize pubnub SDK
  initPubNubSDK() {
    this.pubnub.init(this.pubnubKeyDev);
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

  // subscribing to hubs and sensor comms
  channelSubscription() {
    this.pubnub.subscribe({
      channels: ['hubcomm', 'sensorcomm'],
      withPresence: true,
      triggerEvents: true
    });
  }

  // get hub status first
  getHubStatus() {
    this.pubnub.getStatus('hubcomm', status => {
      console.log('Hub status');
      console.log(status);
    });
  }

  // get hub message
  getHubMessage() {
    this.pubnub.getMessage('hubcomm', message => {
      console.log('Hub message');
      console.log(message);
    });
  }
}
