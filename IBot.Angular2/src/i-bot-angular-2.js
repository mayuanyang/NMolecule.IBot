import {Component, View} from 'angular2/core';

@Component({
  selector: 'i-bot-angular-2'
})

@View({
  templateUrl: 'i-bot-angular-2.html'
})

export class IBotAngular2 {

  constructor() {
    console.info('IBotAngular2 Component Mounted Successfully');
  }

}
