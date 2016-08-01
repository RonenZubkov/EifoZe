import {Component} from '@angular/core';
import {GooglePlaceDirective} from '../directives/googleplace.directive';

@Component({
  selector : 'searchButton',
  directives: [GooglePlaceDirective],
  template:  `
           <input type="text" [(ngModel)] = "address"  (setAddress) = "getAddress($event)" googleplace/>
           `
})

export class GooglePlaceSearch {
  public address : Object;
  getAddress(place:Object) {
    console.log(this.address);
    this.address = place['formatted_address'];
    var location = place['geometry']['location'];
    var lat =  location.lat();
    var lng = location.lng();
    console.log("Address Object", place);
  }
}