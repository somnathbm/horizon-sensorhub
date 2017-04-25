/**
* This is a simple config file containing pubnub environment specific settings
**/

// PubNub production keyset
export const pubnubKeyProd = {
  publishKey: 'pub-c-c2afe15d-b8f5-4761-b856-df5d40f58769',
  subscribeKey: 'sub-c-452ec980-1cf6-11e7-962a-02ee2ddab7fe',
  ssl: true,
  restore: true
};

// PubNub development keyset
export const pubnubKeyDev = {
  publishKey: 'pub-c-10de8c04-0008-44a4-b20f-bae630c6ccd8',
  subscribeKey: 'sub-c-711a4a72-1a0f-11e7-a9ec-0619f8945a4f',
  ssl: true,
  restore: true,
  uuid: 'ionic-client',
  presenceTimeout: 60,
  heartbeatInterval: 29
};
