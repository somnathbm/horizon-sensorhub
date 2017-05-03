import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
//import { NavController } from 'ionic-angular';

@Component({
  selector: 'about',
  templateUrl: 'about.html',
})
export class About {

  constructor(private title: Title) {
  }

  ionViewWillLeave() {
    this.title.setTitle('Playground');
  }
}
