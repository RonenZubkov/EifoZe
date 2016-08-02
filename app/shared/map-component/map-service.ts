
/**
 * Created by ronen on 01/08/2016.
 */

import {Injectable} from "@angular/core";
import {google} from "../googlePlace/googleplace.directive";




@Injectable()
export class mapService{

    private url = 'https://maps.google.co.il/';

    constructor() {
        let directionsDisplay = new google.maps.DirectionsRenderer();
        console.log('directionsDisplay: ',directionsDisplay);
        let directionsService = new google.maps.DirectionsService();
        console.log('directionsService: ',directionsService);
        let geocoder = new google.maps.Geocoder();
        console.log('geocoder: ',geocoder);

    }


    // this.directions = {
    // origin: "Collins St, Melbourne, Australia",
    // destination: "MCG Melbourne, Australia",
    // showList: false
    // }


}

/*This is how the json should look:
 {
 origin: LatLng | String | google.maps.Place,
 destination: LatLng | String | google.maps.Place,
 travelMode: TravelMode,
 transitOptions: TransitOptions,
 drivingOptions: DrivingOptions,
 unitSystem: UnitSystem,
 waypoints[]: DirectionsWaypoint,
 optimizeWaypoints: Boolean,
 provideRouteAlternatives: Boolean,
 avoidHighways: Boolean,
 avoidTolls: Boolean,
 region: String
 }

 https://developers.google.com/maps/documentation/javascript/directions
 This is the domain we need to sent to: https://maps.google.co.il/

 */
