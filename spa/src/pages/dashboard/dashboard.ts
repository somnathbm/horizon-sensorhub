/* core angular 2 modules */
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

/* third party external library */
import { Observable } from 'rxjs/Rx';
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
  public defaultTitle: string = 'Playground';

  // sensor specific
  private occupancyStatus = {
    sensors: {
      ldr: { id: 123, status: 0, occurred_on: 123456789 },
      temp: { id: 123, status: 0, occurred_on: 123456789 },
      hum: { id: 123, status: 0, occurred_on: 123456789 },
      bmp: { id: 123, status: 0, occurred_on: 123456789 }
    },
    appliances: {
      led: { id: 123, status: 0, occurred_on: 123456789 }
    }
  };

  private sensorData = {
      ldr: {},
      temp: {},
      hum: {},
      bmp: {}
  };

  // private sensorData;

  private applianceData = {
    led: {}
  };

  // private applianceData;

  // connection specific
  private isCientOnline: boolean = false;
  public myTheme: object;

  constructor(public auth: AuthService, private pubnub: PubNubAngular, private title: Title) {

  }

  ngAfterViewInit() {
    this.checkAuthStatus();
    console.log('dashboard theme name');
    console.log(Dashboard.prototype.myTheme);
  }

  ngOnChanges() {
    console.log('dashboard theme name');
    console.log(Dashboard.prototype.myTheme);
  }


  // a hacky approach to check auth status lifecycle hook
  checkAuthStatus() {
    let intervalId = setInterval(() => {
      if(this.auth.authenticated()){
        console.log('user authenticated!!');

        this.title.setTitle('Playground');

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
      console.log(msg);

      // let hubMsg = msg.message;
      //
      // // get the root key first
      // let subjectType = Object.keys(hubMsg)[0]; // `sensors`
      // // get the sensor or appliance key
      // let objectType = Object.keys(hubMsg[subjectType])[0]; // `temp` or `led`
      //
      // // assign or overwrite
      // if(Object.keys(this.occupancyStatus).indexOf(subjectType) != -1 || Object.keys(this.occupancyStatus[subjectType]).indexOf(objectType)) {
      //   this.occupancyStatus[subjectType][objectType] = hubMsg[subjectType][objectType];
      // }

      // observable approach
      let source = Observable.of(msg.message);
      source.subscribe(x => {
        // get the root key first
        let invoker = Object.keys(x)[0]; // `sensors`
        // get the sensor or appliance key
        let entity = Object.keys(x[invoker])[0]; // `temp` or `led`

        // assign or overwrite
        if(Object.keys(this.occupancyStatus).indexOf(invoker) != -1 || Object.keys(this.occupancyStatus[invoker]).indexOf(entity)) {
          this.occupancyStatus[invoker][entity] = x[invoker][entity];
        }

      });

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
      console.log(msg);

      let source = Observable.of(msg.message);
      source.subscribe(x => {
        // --- for actual application use ---
        // get the sensor key first
        let sensorType = Object.keys(x)[0]; // `temp` or `dst`

        // assign or overwrite
        if(Object.keys(this.sensorData).indexOf(sensorType) != -1) {
          this.sensorData[sensorType] = x[sensorType];
        }

        // -- for demo application use ---
        // this.sensorData = x;
      });
    });
  }

  // get appliance messages
  getApplianceData() {
    this.pubnub.getMessage('applcomm', msg => {
      console.log('appliance message');
      console.log(msg);

      let source = Observable.of(msg.message);
      source.subscribe(x => {
        // --- for actual application use ---
        // get the sensor key first
        let applianceType = Object.keys(x)[0]; // `temp` or `dst`

        // assign or overwrite
        if(Object.keys(this.applianceData).indexOf(applianceType) != -1) {
          this.applianceData[applianceType] = x[applianceType];
        }

        // -- for demo application use ---
        // this.applianceData = x;
      });
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

  // user log out
  logout() {
    this.auth.logout();
    this.title.setTitle('Sensor hub');
  }

 // sample message publisher from sensor
  publishSensorMsg() {
    this.pubnub.publish({
      message: { temp: { id: 563421, data: '55.75° C', occurred_on: 1734256787 }},
      channel: 'sensorcomm'
    },
  (status, response) => {
    if(status.error){
      console.error(status);
    }
    else {
      console.log(response);
    }
  });
  }

}
