/* core angular 2 modules */
import { Component } from '@angular/core';

/* core ionic 2 modules */
//import { NavController } from 'ionic-angular';

/* third party external library */
//import { Observable } from 'rxjs/Rx';
import { PubNubAngular } from 'pubnub-angular2';

/* app services */
import { AuthService } from '../../services/auth.service';

/* helpers for app wide use */
import { pubnubKeyDev } from '../../helpers/pubnub.environment';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class Dashboard {

  /* memeber variables */

  // sensor specific
  private occupancyStatus = {
    sensors: {
      ldr: { id: 123, status: 0, occurred_on: 123456789 },
      temp: { id: 123, status: 0, occurred_on: 123456789 },
      dst: { id: 123, status: 0, occurred_on: 123456789 },
      bmp: { id: 123, status: 0, occurred_on: 123456789 }
    },
    appliances: {
      led: { id: 123, status: 0, occurred_on: 123456789 }
    }
  };

  private sensorData = {
    sensors: {
      ldr: { id: 123, data: '123', last_modified_on: 123456789 },
      temp: { id: 123, data: '123', last_modified_on: 123456789 },
      dst: { id: 123, data: '123', last_modified_on: 123456789 },
      bmp: { id: 123, data: '123', last_modified_on: 123456789 }
    }
  };

  private applianceData = {
    appliances: {
      led: { id: 123, data: '123', last_modified_on: 123456789 }
    }
  };

  // connection specific
  private isCientOnline: boolean = false;

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
        this.getHubMessage();
        this.getSensorData();
        this.getApplianceData();

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
    this.pubnub.init(pubnubKeyDev);
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

    this.pubnub.subscribe({
      channels: ['applcomm'],
      triggerEvents: ['message']
    });
  }

  // publish message
  publishMsgToAppl(payload: object) {
      this.pubnub.publish({
        message: payload,
        channel: 'applcomm'
      }, (status, response) => {
        console.log('publish callback status');
        console.log(status);

        console.log('publish callback response');
        console.log(response);
      });
  }

  // get network connectivity on the channel first which will also determine this client application network connectivity
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

  // get hub message which will consists sensor or appliance plugged / unplugged information
  getHubMessage() {
    this.pubnub.getMessage('hubcomm', msg => {
      console.log('Hub message');
      console.log(msg.message);

      let hubMsg = msg.message;

      /** the sample sensor status or appliance status :
        *  { sensors: { temp: { id: 1234, status: 1, occurred_on: 174523... }}}
        *  { appliances: { temp: { id: 1234, status: 1, occurred_on: 174523... }}}
        */

      // get the root key first
      let subjectType = Object.keys(hubMsg)[0]; // `sensors`
      // get the sensor or appliance key
      let objectType = Object.keys(hubMsg[subjectType])[0]; // `temp` or `led`

      // assign or overwrite
      if(Object.keys(this.occupancyStatus).indexOf(subjectType) != -1 || Object.keys(this.occupancyStatus[subjectType]).indexOf(objectType)) {
        this.occupancyStatus[subjectType][objectType] = hubMsg[subjectType][objectType];
      }

    });
  }

  // get occupancy information
  getHubOccupancy() {
    this.pubnub.getPresence('hubcomm', presence => {
      console.log('Hub presence status');
      console.log(presence);
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

  // get sensor messages
  getSensorData() {
    this.pubnub.getMessage('sensorcomm', msg => {
      console.log('sensor message');
      console.log(msg.message);

      let sensorMsg = msg.message;

      /** the sample sensor status or appliance status :
        *  { sensors: { temp: { id: 1234, data: '', occurred_on: 174523... }}}
        */

      // get the root key first
      let subjectType = Object.keys(sensorMsg)[0]; // `sensors`
      // get the sensor or appliance key
      let objectType = Object.keys(sensorMsg[subjectType])[0]; // `temp` or `led`

      // assign or overwrite
      if(Object.keys(this.sensorData).indexOf(subjectType) != -1 || Object.keys(this.sensorData[subjectType]).indexOf(objectType)) {
        this.sensorData[subjectType][objectType] = sensorMsg[subjectType][objectType];
      }

    });
  }

  // get appliance messages
  getApplianceData() {
    this.pubnub.getMessage('applcomm', msg => {
      console.log('appliance message');
      console.log(msg.message);

      let applMsg = msg.message;

      /** the sample sensor status or appliance status :
        *  { appliances: { led: { id: 1234, data: '', occurred_on: 174523... }}}
        */

      // get the root key first
      let subjectType = Object.keys(applMsg)[0]; // `appliances`
      // get the sensor or appliance key
      let objectType = Object.keys(applMsg[subjectType])[0]; // `led`

      // assign or overwrite
      if(Object.keys(this.applianceData).indexOf(subjectType) != -1 || Object.keys(this.applianceData[subjectType]).indexOf(objectType)) {
        this.applianceData[subjectType][objectType] = applMsg[subjectType][objectType];
      }

    });
  }

  // toggle appliances
  toggleAppl(e) {
    let payload = { name: 'led' };

    payload['req_status'] = e? 100:0;
    payload['requested_on'] = Date.now();

    // call publish method and pass payload
    this.publishMsgToAppl(payload);
  }
}
