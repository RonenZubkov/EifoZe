import { Component, Directive ,OnInit,NgZone,provide,Output, EventEmitter} from '@angular/core';
import {Observable} from  'rxjs';
import {ToggleButton} from '../directives/toggle-button';
// import {ANGULAR2_GOOGLE_MAPS_PROVIDERS, ANGULAR2_GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {GoogleMapsAPIWrapper ,MapsAPILoader, NoOpMapsAPILoader, MouseEvent, GOOGLE_MAPS_PROVIDERS, GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {MarkFilterPipe} from '../pipes/filter-list.pipe';
import {LayerService} from '../../layer/layer.service';
import {LayerModel} from "../../layer/layer.model";
import {MarkerManager} from "angular2-google-maps/core/services/managers/marker-manager";
import {GooglePlaceSearch} from "../googlePlace/googleplace.component";
import {MapLayerComponent} from '../mapLayers/map-layer.component';
import {LayerFilterComponent} from '../../layer/layer-filter.component';
import {GeolocationService} from '../services/geolocation';


interface marker {
    lat: number;
    lng: number;
    label?: string;
    isShown: boolean;
    symbol?: string;
    layerId: string;
}

declare let google:any;

@Component({
    moduleId: module.id,
    selector: 'sebm-google-map',
    directives: [GOOGLE_MAPS_DIRECTIVES,ToggleButton, MapLayerComponent,GooglePlaceSearch],
    providers: [GoogleMapsAPIWrapper, LayerFilterComponent,MarkerManager,GeolocationService],
    pipes: [MarkFilterPipe],
    // providers: [ANGULAR2_GOOGLE_MAPS_PROVIDERS,layers],
    // providers: [LayerService],
    styles: [`
    .sebm-google-map-container {
       margin-top: 25%;
       height: 83% ;
     }
  `],
    // bindings:[GeolocationService],

    template: `
    <mapLayers [layers]="_layers" (onChange)="filterChanged($event)">map layers</mapLayers>
    <sebm-google-map 
      [latitude]="_lat"
      [longitude]="_lng"
      [zoom]="zoom"
      [disableDefaultUI]="false"
      [zoomControl]="false"
      (mapClick)="mapClicked($event)
        ">

        
      <sebm-google-map-marker 
          *ngFor="let m of _markers | markPipe; let i = index"
          
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
      
              <sebm-google-map-marker *ngIf="_myPos"
          [latitude]="_myPos.lat"
          [longitude]="_myPos.lng"
          [label]="'Me'">
        </sebm-google-map-marker>
        
    </sebm-google-map>
    <!--<input id="address" type="text" />-->
    <google-search-bar></google-search-bar>
    <searchButton></searchButton>


    <nav class="navbar navbar-default navbar-fixed-bottom">
        <a class="btn addLayer-btn" routerLink="/layer/edit">Add your own Layer</a>
    </nav>
    

     <!--<toggleButton [(on)]="state">Atm
        {{state ? 'On' : 'Off'}}
     </toggleButton>

     <toggleButton>Wc</toggleButton>-->


`
})

// @Directive({
//     selector: 'mapStyle'
// })

export class MapComponent implements OnInit {

    state:boolean = false;
    // google maps zoom level
    zoom:number = 18;
    @Output() private locAdded = new EventEmitter;

    // initial center position for the map
    private mySelf$:any;

    private _lat:number = 0;
    private _lng:number = 0;


    lat:number = 32.087289;
    lng:number = 34.803521;

    private _layers:LayerModel[];
    private _markers:marker[] = [];
    private _myPos:marker;


    constructor(geolocationService:GeolocationService, private _wrapper:GoogleMapsAPIWrapper, private _zone:NgZone, _markerManger:MarkerManager, private layerService:LayerService, private _loader:MapsAPILoader) {
        this._wrapper.getNativeMap().then((m) => {
            let options = {
        //         // center: {lat: this._latitude, lng: this._longitude},
                minZoom: 2, maxZoom: 15,
                disableDefaultUI: true,
                draggable: false,
                disableDoubleClickZoom: false,
                panControl: false,
                scaleControl: false,
            };
            m.setOptions(options);
        });

        // this.mySelf$ = geolocationService.getLocation({maximumAge: 600000, timeout: 5000, enableHighAccuracy: true})
        // // console.log(geolocationService)
        //     .subscribe(res => console.log(res));
        // // (this.mySelf$ = res)
        // console.log(this.mySelf$);
    }


    ngOnInit() {

        //gets the current position
        this.getCurrentPosition();

        const prmLayers = this.layerService.query();
        prmLayers.then((layers:LayerModel[]) => {
            //by query it gets our layers to layers[]
            this._layers = layers;
            this._markers = [];
            layers.forEach(layer => this.createMarkers(layer));
        });

        //its allow to follow the location on moving.
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(this.showPosition.bind(this), this.showError.bind(this));
        }

    }


    // if (navigator.geolocation) {
    //     console.log('navigator.geolocation:');
    //     // console.log('lets see what fucking info we get from this useless function: ',navigator.geolocation.getCurrentPosition(this.showError.bind(this)));
    //     navigator.geolocation.watchPosition(this.showPosition.bind(this), this.showError.bind(this));
    //     // this.showError);
    //
    // }

    // Google Place Autocomplete
    // let autocomplete:any;
    // let inputAddress = document.getElementById("address");
    // autocomplete = new google.maps.places.Autocomplete(inputAddress, {});
    // google.maps.event.addListener(autocomplete, 'place_changed', ()=> {
    //
    //     this._zone.run(() => {
    //         let place = autocomplete.getPlace();
    //         this.lat = place.geometry.location.lat();
    //         this.lng = place.geometry.location.lng();
    //         // For an unknown reason you need to click the map for the relocation to happen (even if these lines are executed before)
    //         console.log(place);
    //     });
    //
    // });

    //gets the current location and rendering it to the map
    getCurrentPosition() {
        console.log('im here...getting position');

        let myPosition;
        navigator.geolocation.getCurrentPosition((pos) => {
            myPosition = {lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'Me'};
            this._myPos = myPosition;
            this._lat = myPosition.lat;
            this._lng = myPosition.lng;
        })
    }


    // let directionsDisplay = new google.maps.DirectionsRenderer();
    // console.log('directionsDisplay: ',directionsDisplay);
    // let directionsService = new google.maps.DirectionsService();
    // console.log('directionsService: ',directionsService);
    // let geocoder = new google.maps.Geocoder();
    // console.log('geocoder: ',geocoder);


    clickedMarker(label:string, index:number, directionsService, directionsDisplay, pointA) {
        console.log(`clicked the marker: ${label && index}`);
        directionsService.route({
            origin: pointA,
            //Need to check the json we receive from DB, might not match with googles request.
            destination: this._markers[index],
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    mapClicked($event:MouseEvent) {
        // this._markers.push({
        //     lat: $event.coords.lat,
        //     lng: $event.coords.lng,
        //     isShown: true
        // });
        this.locAdded.emit($event.coords);
    }


        //If there is an error about zone js || or you cant move the map, the error comes from here.(R.z)

    createMarkers(layer) {
        layer.locs.forEach(loc => {
            console.log(loc);
            const marker = Object.assign({}, loc, {layerId: layer.id , symbol : layer.symbol, isShown: false });
            console.log(marker);
            this._markers.push(marker);
        })
    }

    markerDragEnd(m:marker, $event:MouseEvent) {
        // console.log('dragEnd', m, $event);
    }

    showPosition(pos){
        // let mySelf = {lat: 0, lng:0, isShown: true, label: 'Me', layerId: 'me'};
        // mySelf.lat = pos.coords.latitude;
        // mySelf.lng = pos.coords.longitude;
        // this._markers.push(mySelf);
    }
    //
    //
    // }

    showError(error) {
        switch (error.code) {
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

    calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
        // directionsService.route({
        //     origin: pointA,
        //     destination: pointB,
        //     travelMode: google.maps.TravelMode.DRIVING
        // }, function (response, status) {
        //     if (status == google.maps.DirectionsStatus.OK) {
        //         directionsDisplay.setDirections(response);
        //     } else {
        //         window.alert('Directions request failed due to ' + status);
        //     }
        // });
    }

    filterChanged(layer) {
        // console.log('filterChanged',  layer);
        // console.log('before' ,this._markers);
        if (!layer.isShown) {
            this._markers = this._markers.map((marker)=> {
                if (marker.layerId === layer.id) {
                    const newMarker = Object.assign({}, marker, {isShown: true});
                    return newMarker;
                } else {
                    return marker;
                }
            });
            layer.isShown = !layer.ishown;
            // console.log( 'after:',this._markers, layer);
        } else {
            this._markers = this._markers.map((marker)=> {
                if (marker.layerId === layer.id) {
                    const newMarker = Object.assign({}, marker, {isShown: false});
                    return newMarker;
                } else {
                    return marker;
                }
                ;
            });
            layer.isShown = !layer.isShown;
            // console.log( 'after:',this._markers, layer);
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

}

// }


//Importent!!
// calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);

// private _initMapInstance(el: HTMLElement) { this._mapsWrapper.createMap(el, {  }); this._handleBoundaries();
// private _handleBoundaries() {    this._mapsWrapper.subscribeToMapEvent<void>('dragend').subscribe(() => {
//     this._mapsWrapper.getCenter().then((center: LatLng) => {        var x = this._longitude;
//         var y = this._latitude;        // console.log('y',y, 'x', x);
// //  var maxX = 5.139133754119953;       var maxY = 51.52773156266013;
// //  var minX = 5.105831446991047;       var minY = 51.51337849651561;        if (x < minX) x = minX;
// //    if (x > maxX) x = maxX;       if (y < minY) y = minY;       if (y > maxY) y = maxY;
// //    this._mapsWrapper.setCenter({lat: y, lng: x});    }); });