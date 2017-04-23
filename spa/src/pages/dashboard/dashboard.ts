/* core angular 2 modules */
import { Component } from '@angular/core';

/* core ionic 2 modules */
import { NavController } from 'ionic-angular';

/* third party external library */
import { Observable } from 'rxjs/Rx';
import { PubNubAngular } from 'pubnub-angular2';

/* app services */
import { AuthService } from '../../services/auth.service';

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
    restore: true,
    uuid: 'ionic-client',
    presenceTimeout: 60,
    heartbeatInterval: 29
  };

  private isCientOnline: boolean = false;
  private isApplianceOn: boolean = false;
  private nodeMCUOnline: boolean = false;

  private sensorData: object = { hum: '00.00', temp: '00.00' };

  constructor(public auth: AuthService, private pubnub: PubNubAngular) {

  }

  ngAfterViewInit() {
    this.checkAuthStatus();
  }

  // a hacky approach to check auth status lifecycle hook
  checkAuthStatus() {
    let intervalId = setInterval(() => {
      if(this.auth.authenticated()){
        console.log('user authenticated!!');

        /* call pubnub related tasks here */
        this.initPubNubSDK();
        this.channelSubscription();
        this.getHubStatus();
        this.interceptSensorData();

        /* clear the interval because its no longer needed to check */
        clearInterval(intervalId);
      }
      else {
        console.log('user NOT authenticated!!');
      }
    }, 5000);
  }

  // initialize pubnub SDK
  initPubNubSDK() {
    this.pubnub.init(this.pubnubKeyDev);
  }

  // subscribing to hubs and sensor comms
  channelSubscription() {
    this.pubnub.subscribe({
      channels: ['hubcomm'],
      withPresence: true,
      triggerEvents: true
    });

    this.pubnub.subscribe({
      channels: ['sensorcomm'],
      triggerEvents: ['message']
    });
  }

  // publish message
  publishMsg() {
      this.pubnub.publish({
        message: 'hi bro',
        channel: 'hubcomm'
      }, (status, response) => {
        console.log('publish callback status');
        console.log(status);

        console.log('publish callback response');
        console.log(response);
      });
  }

  // get hub status first
  getHubStatus() {
    this.pubnub.getStatus('hubcomm', status => {
      console.log('Hub status');
      console.log(status);

      if( status.category == 'PNConnectedCategory' || status.category == 'PNNetworkUpCategory' || status.category == 'PNReconnectedCategory') {
        this.isCientOnline = true;
      }
      else if( status.category == 'PNNetworkDownCategory') {
        this.isCientOnline = false;
      }
    });
  }

  // get hub message
  getHubMessage() {
    this.pubnub.getMessage('hubcomm', msg => {
      console.log('Hub message');
      console.log(msg.message);
      //this.nodeMCUOnline = msg.message.name == 'hub' && msg.message.status == 1 ? true: false;
    });
  }

  // get here now occupancy
  getHubPresence() {
    this.pubnub.getPresence('hubcomm', presence => {
      console.log('Hub presence status');
      console.log(presence);
    });
  }

  // get hub wherenow occupancy
  getHubOccupancy() {
    this.pubnub.hereNow({
      channels: ['hubcomm'],
      includeUUIDs: true,
      includeState: true
    }, (status, response) => {
      console.log('Hub herenow occupancy status');
      console.log(status);

      console.log('Hub herenow occupancy response');
      console.log(response);
    });
  }

  // get hub state information
  getHubStateInfo() {
    this.pubnub.getState({
      uuid: 'CUWiFi1',
      channels: ['hubcomm']
    }, (status, response) => {
      console.log('Hub state info status');
      console.log(status);

      console.log('Hub state info response');
      console.log(response);
    });
  }

  // intercept sensor message
  interceptSensorData() {
    this.pubnub.getMessage('sensorcomm', msg => {
      console.log('sensor message');
      console.log(msg.message); // {msg: { humidity: 222, temp: 222} }

      this.sensorData = msg.message;
    });
  }
}
