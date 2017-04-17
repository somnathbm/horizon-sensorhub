import { Injectable } from '@angular/core';

/* PubNub DSN library */
import { PubNubAngular } from 'pubnub-angular2';

@Injectable()
export class DataStreamingService {

  // PubNub production keyset
  private pubnubKeyProd = {
    publishKey: 'pub-c-c2afe15d-b8f5-4761-b856-df5d40f58769',
    subscribeKey: 'sub-c-452ec980-1cf6-11e7-962a-02ee2ddab7fe'
  };

  // PubNub development keyset
  private pubnubKeyDev = {
    publishKey: 'pub-c-10de8c04-0008-44a4-b20f-bae630c6ccd8',
    subscribeKey: 'sub-c-711a4a72-1a0f-11e7-a9ec-0619f8945a4f'
  };

  constructor(private pubnub: PubNubAngular) {}

  /* initialize PubNub SDK */
  initPubNubSDK() {
    this.pubnub.init(this.pubnubKeyDev);
  }


}
