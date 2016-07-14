import {Component, View} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {IBotAngular2} from 'i-bot-angular-2';

@Component({
  selector: 'main'
})

@View({
  directives: [IBotAngular2],
  template: `
    <i-bot-angular-2></i-bot-angular-2>
  `
})

class Main {

}

bootstrap(Main);
