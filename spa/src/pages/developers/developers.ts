import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
//import { IonicPage, NavController } from 'ionic-angular';

@Component({
  selector: 'developers',
  templateUrl: 'developers.html',
})
export class Developers {

  constructor(private title: Title) {
  }

  ionViewWillLeave() {
    this.title.setTitle('Playground');
  }

}
