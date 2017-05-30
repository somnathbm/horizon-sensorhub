import { Component, OnChanges } from '@angular/core';
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

  themes = [
    { name: 'gray', menuThemeClass: 'bluegray-lightgreen', colorMapKey: { primary: 'bluegray-lightgreen-primary', secondary: 'bluegray-lightgreen-secondary'} },
    { name: 'purple', menuThemeClass: 'purple-lightgreen', colorMapKey: { primary: 'purple-lightgreen-primary', secondary: 'purple-lightgreen-secondary'} },
    { name: 'blue', menuThemeClass: 'blue-yellow', colorMapKey: { primary: 'blue-yellow-primary', secondary: 'blue-yellow-secondary'} }
  ];

  defaultColorMapKey: object = { primary: 'bluegray-lightgreen-primary', secondary: 'bluegray-lightgreen-secondary' };
  defaultTheme: string = 'bluegray-lightgreen';

  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {
  }

  ngOnInit() {
      Dashboard.prototype.myTheme = this.defaultColorMapKey;
  }

  openPage(page) {
    this.navCtrl.push(page.component);
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  changeTheme(theme) {
    this.defaultTheme = theme.menuThemeClass;
    this.defaultColorMapKey = theme.colorMapKey;
    Dashboard.prototype.myTheme = theme.colorMapKey;
    Dashboard.prototype.ngOnChanges();
  }
}
