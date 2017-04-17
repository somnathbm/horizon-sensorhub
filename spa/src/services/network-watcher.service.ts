/* import core module first */
import { Injectable } from '@angular/core';

/* import utility module */
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NetworkWatcherService {
  constructor() {}

  /* intercept netwrok offline event */
  notifyNetworkOffline(): Observable<any> {
    return Observable.fromEvent(window, 'offline');
  }

  /* intercept network online event */
  notifyNetworkOnline(): Observable<any> {
    return Observable.fromEvent(window, 'online');
  }
}
