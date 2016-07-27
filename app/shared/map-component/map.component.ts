import { Component, Directive,OnInit } from '@angular/core';
import {ToggleButton} from '../directives/toggle-button';
import { GoogleMapsAPIWrapper ,MapsAPILoader, NoOpMapsAPILoader, MouseEvent, GOOGLE_MAPS_PROVIDERS, GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';


// just an interface for type safety.
interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable?: boolean;
    icon?: string;
    sym?: string;
}


@Component({
    moduleId: module.id,
    selector: 'map',
    directives: [GOOGLE_MAPS_DIRECTIVES,ToggleButton],
    providers: [],
    // providers: [ANGULAR2_GOOGLE_MAPS_PROVIDERS],
    styles: [`
    .sebm-google-map-container {
       height: 300px;
     }
  `],

    template: `
    <sebm-google-map 
      [latitude]="lat"
      [longitude]="lng"
      [zoom]="zoom"
      [disableDefaultUI]="false"
      [zoomControl]="false"
      (mapClick)="mapClicked($event)">
    
      <sebm-google-map-marker 
          *ngFor="let m of markers; let i = index"
          (markerClick)="clickedMarker(m.label, i)"
          [latitude]="m.lat"
          [longitude]="m.lng"
          [label]="m.label"
          [markerDraggable]="m.draggable"
          (dragEnd)="markerDragEnd(m, $event)">
          
        <sebm-google-map-info-window>
          <strong>InfoWindow content</strong>
        </sebm-google-map-info-window>
        
      </sebm-google-map-marker>

     
     

    </sebm-google-map>
    
     <toggleButton [(on)]="state">Atm
        {{state ? 'On' : 'Off'}}
     </toggleButton>

     <toggleButton>Wc</toggleButton>
     <!--<h1 *ngIf="state">Example!</h1>-->

`
})

// @Directive({
//     selector: 'map'
// })

export class MapComponent implements OnInit {

    state: boolean = false;
    // google maps zoom level
    zoom: number = 8;

    // initial center position for the map
    lat: number = 32.782548;
    lng: number = 35.014488;

    ngOnInit(){}


    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`)
    }

    mapClicked($event: MouseEvent) {
        this.markers.push({
        lat: $event.coords.lat,
        lng: $event.coords.lng
        });
    }

    markerDragEnd(m: marker, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
    }

    // showPosition(pos){
    //     var crd = pos.coords;
    //     this.latHome = crd.latitude;
    //     this.lngHome = crd.longitude;
    //
    //     console.warn('Your current position is:');
    //     console.log('Latitude : ' + this.latHome);
    //     console.log('Longitude: ' + this.lngHome);
    //     console.log('More or less ' + crd.accuracy + ' meters.');
    // }

    showError(error){
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred");
                break;
        }
    }

    markers: marker[] = [
        {
            lat: 32.087289,
            lng: 34.803521,
            label: 'A',
            draggable: true,
            sym: 'atm'
        },
        {
            lat: 32.087871,
            lng: 34.803089,
            label: 'B',
            draggable: false,
            sym: 'atm'
        },
        {
            lat: 32.087516,
            lng: 34.802052,
            label: 'C',
            draggable: true,
            sym: 'wc'
        }
    ]

}