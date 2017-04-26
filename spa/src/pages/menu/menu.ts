import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { Dashboard } from '../dashboard/dashboard';
import { Hiw } from '../hiw/hiw';
import { Developers } from '../developers/developers';
import { About } from '../about/about';
import { TermsConditions } from '../terms/terms';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {
  rootPage: any = Dashboard;
  pageSets = [
    { name: 'hiw', title: 'How it works', component: Hiw, icon: 'flask' },
    { name: 'developers', title: 'Developers', component: Developers, icon: 'code' },
    { name: 'tc', title: 'Terms & Conditions', component: TermsConditions, icon: 'briefcase' },
    { name: 'about', title: 'About', component: About, icon: 'information-circle' }
  ];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {
  }

  openPage(page) {
    this.navCtrl.push(page.component);
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }
}
