import { Component, Directive,OnInit,NgZone,provide} from '@angular/core';
import {ToggleButton} from '../directives/toggle-button';
import {provideLazyMapsAPILoaderConfig, GoogleMapsAPIWrapper ,MapsAPILoader, NoOpMapsAPILoader, MouseEvent, GOOGLE_MAPS_PROVIDERS, GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {SymFilterPipe} from '../pipes/filter-list.pipe';
import {LayerService} from '../../layer/layer.service';
import {LayerModel} from "../../layer/layer.model";
import {MarkerManager} from "angular2-google-maps/core/services/managers/marker-manager";
import {google} from "../directives/googleplace.directive";

interface marker {
    lat: number;
    lng: number;
    label?: string;
    isShown: boolean;
    icon?: string;
    symbol?: string;
}


@Component({
    moduleId: module.id,
    selector: 'sebm-google-map',
    directives: [GOOGLE_MAPS_DIRECTIVES,ToggleButton],
    providers: [GoogleMapsAPIWrapper,provideLazyMapsAPILoaderConfig],
    pipes: [SymFilterPipe],
    // providers: [ANGULAR2_GOOGLE_MAPS_PROVIDERS,layers],
    // providers: [LayerService],
    styles: [`
    .sebm-google-map-container {
       margin-top: 25%;
       height: 300px;
     }
  `],

    template: `
    <div>Hello</div>
    <google-search-bar></google-search-bar>
    <sebm-google-map 
      [latitude]="lat"
      [longitude]="lng"
      [zoom]="zoom"
      [disableDefaultUI]="false"
      [zoomControl]="false"
      (mapClick)="mapClicked($event)
        ">
        
      <sebm-google-map-marker 
          *ngFor="let m of markers | markPipe; let i = index"
          (markerClick)="clickedMarker(m.label, i)"
          [latitude]="m.lat"
          [longitude]="m.lng"
          [label]="m.label"
          [markerDraggable]="m.draggable"
          (dragEnd)="markerDragEnd(m, $event)
          ">
          
        <sebm-google-map-info-window>
        
          <strong>{{m.label}}</strong>
          
        </sebm-google-map-info-window>
      </sebm-google-map-marker>
    </sebm-google-map>
    
     <toggleButton [(on)]="state">Atm
        {{state ? 'On' : 'Off'}}
     </toggleButton>

     <toggleButton>Wc</toggleButton>
`
})

export class MapComponent implements OnInit {

    state: boolean = false;
    // google maps zoom level
    zoom: number = 18;

    // initial center position for the map
    lat: number = 32.087289;
    lng: number = 34.803521;


    constructor(private _wrapper: GoogleMapsAPIWrapper,_zone : NgZone,_markerManger: MarkerManager, private layerService: LayerService){
         this._wrapper.getNativeMap().then((m) => {
             let options = {
                 // center: {lat: this._latitude, lng: this._longitude},
                 minZoom: 2, maxZoom: 15,
                 disableDefaultUI: true,
                 draggable: false,
                 disableDoubleClickZoom: false,
                 panControl: false,
                 scaleControl: false,
             }})
    }


    ngOnInit(){

        const prmLayers = this.layerService.query();
        prmLayers.then((layers :LayerModel[]) =>{
            console.log('layers:',layers);
            this.markers = [];
            layers.forEach(layer => {
                layer.locs.forEach(loc => {
                    const marker = Object.assign({}, loc, {symbol : layer.symbol} , {isShown: true});
                    console.log('marker', marker);
                    this.markers.push(marker)
                })
            });
        });

        if(navigator.geolocation) {
            console.log('navigator.geolocation:');
            // console.log('lets see what fucking info we get from this useless function: ',navigator.geolocation.getCurrentPosition(this.showError.bind(this)));
            navigator.geolocation.watchPosition(this.showPosition.bind(this), this.showError.bind(this));
            // this.showError);
        }

        let autocomplete = new google.maps.places.Autocomplete(document.getElementById('your-search-bar'), {});
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            this.zone.run(() => {
                let place = autocomplete.getPlace();
                if (place.geometry.location) {
                    this.lat = place.geometry.location.lat();
                    this.lng = place.geometry.location.lng();
                }
            });
        });
    });
}


}



    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`)
    }

    mapClicked($event: MouseEvent) {
        this.markers.push({
        lat: $event.coords.lat,
        lng: $event.coords.lng,
        isShown: true
        });
    }


    markerDragEnd(m: marker, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
    }

    showPosition(pos){
        let mySelf = {lat: 0,lng:0,isShown: true, label: 'Me'};

        console.log(pos);
        mySelf.lat = pos.coords.latitude;
        mySelf.lng = pos.coords.longitude;
        console.log(mySelf);

        console.warn('Your current position is:');
        // console.log('Latitude : ' + this.latHome);
        // console.log('Longitude: ' + this.lngHome);
        // console.log('More or less ' + crd.accuracy + ' meters.');
        this.markers.push(mySelf);
        console.log(this.markers);
    }

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

    // autocomplete() {
    //     this._loader.load().then(() => {
    //         let autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocompleteInput"), {});
    //         google.maps.event.addListener(autocomplete, 'place_changed', () => {
    //             let place = autocomplete.getPlace();
    //             console.log(place);
    //         });
    //     })};

    markers: marker[] = [
        {
            lat: 32.087289,
            lng: 34.803521,
            label: 'A',
            isShown: true,
            symbol: 'atm'
        },
        {
            lat: 32.087871,
            lng: 34.803089,
            label: 'B',
            isShown: false,
            symbol: 'atm'
        },
        {
            lat: 32.087516,
            lng: 34.802052,
            label: 'C',
            isShown: true,
            symbol: 'wc'
        }
    ]

}


// private _initMapInstance(el: HTMLElement) { this._mapsWrapper.createMap(el, {  }); this._handleBoundaries();
// private _handleBoundaries() {    this._mapsWrapper.subscribeToMapEvent<void>('dragend').subscribe(() => {
//     this._mapsWrapper.getCenter().then((center: LatLng) => {        var x = this._longitude;
//         var y = this._latitude;        // console.log('y',y, 'x', x);
// //  var maxX = 5.139133754119953;       var maxY = 51.52773156266013;
// //  var minX = 5.105831446991047;       var minY = 51.51337849651561;        if (x < minX) x = minX;
// //    if (x > maxX) x = maxX;       if (y < minY) y = minY;       if (y > maxY) y = maxY;
// //    this._mapsWrapper.setCenter({lat: y, lng: x});    }); });