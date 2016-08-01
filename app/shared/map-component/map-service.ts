/**
 * Created by ronen on 01/08/2016.
 */
import {Component} from '@angular/core';
import {GoogleplaceDirective} from '../directives/googleplace.directive';

@Component({
    selector : '',
    directives: [GoogleplaceDirective],
    template:  `
           <input type="text" [(ngModel)] = "address"  (setAddress) = "getAddress($event)" googleplace/>
           `
})

export class LocationSearch {
    public address : Object;
    getAddress(place:Object) {
        this.address = place['formatted_address'];
        let location = place['geometry']['location']['visualization'];
        let lat =  location.lat();
        let lng = location.lng();
        console.log("Address Object", place);
    }
}
