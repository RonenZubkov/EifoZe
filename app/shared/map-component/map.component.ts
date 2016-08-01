import { Component, Directive,OnInit,Output, EventEmitter} from '@angular/core';
import {ToggleButton} from '../directives/toggle-button';
import {GoogleMapsAPIWrapper ,MapsAPILoader, NoOpMapsAPILoader, MouseEvent, GOOGLE_MAPS_PROVIDERS, GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {MarkFilterPipe} from '../pipes/filter-list.pipe';
import {LayerService} from '../../layer/layer.service';
import {LayerModel} from "../../layer/layer.model";
import {MapLayerComponent} from '../mapLayers/map-layer.component';
import {LayerFilterComponent} from '../../layer/layer-filter.component';


interface marker {
    lat: any;
    lng: any;
    label?: string;
    isShown?: boolean;
    symbol?: string;
}


@Component({
    moduleId: module.id,
    selector: 'map',
    directives: [GOOGLE_MAPS_DIRECTIVES,ToggleButton, MapLayerComponent],
    providers: [GoogleMapsAPIWrapper, LayerFilterComponent],
    pipes: [MarkFilterPipe],
    // providers: [ANGULAR2_GOOGLE_MAPS_PROVIDERS,layers],
    // providers: [LayerService],
    styles: [`
    .sebm-google-map-container {
       margin-top: 25%;
       height: 83% ;
     }
  `],

    template: `
    <sebm-google-map 
      [latitude]="lat"
      [longitude]="lng"
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
    </sebm-google-map>
    <nav class="navbar navbar-default navbar-fixed-bottom">
        <a class="btn addLayer-btn" routerLink="/layer/edit">Add your own Layer</a>
    </nav>
    

     <!--<toggleButton [(on)]="state">Atm
        {{state ? 'On' : 'Off'}}
     </toggleButton>

     <toggleButton>Wc</toggleButton>-->


`
})

export class MapComponent implements OnInit {

    state: boolean = false;
    // google maps zoom level
    zoom: number = 18;

    // initial center position for the map

    lat: number = 32.087289;
    lng: number = 34.803521;
    
    @Output() private locAdded = new EventEmitter;
    private _layers : LayerModel[];
    private _markers : marker[] =         [
  {
    "lat": 32.087289,
    "lng": 34.803089,
    "label": "Hapoalim ",
    "isShown": true,
    "symbol": "cash"
  },
  {
    "lat": 33.087289,
    "lng": 33.803089,
    "label": "Gvirol ",
    "isShown": true,
    "symbol": "cash"
  }  
]
 


    constructor(private _wrapper: GoogleMapsAPIWrapper, private layerService: LayerService){
         this._wrapper.getNativeMap().then((m) => {
             let options = {
                 minZoom: 2, maxZoom: 15,
                 disableDefaultUI: true,
                 draggable: false,
                 disableDoubleClickZoom: false,
                 panControl: false,
                 scaleControl: false,
             }})
        }


    ngOnInit(){
        console.log('the markers1:',this._markers);
        
        const prmLayers = this.layerService.query();
        prmLayers.then((layers : LayerModel[]) =>{
            this._layers = layers;
            console.log('layers:',layers);
            this._markers = [];
            console.log("this._markers:", this._markers);
            
            layers.forEach(layer => {
                layer.locs.forEach(loc => {
                    const marker = Object.assign({}, loc, {symbol : layer.symbol} , {isShown: true});
                    console.log('marker', marker);
                    this._markers.push(marker);
                })
            });
        });

        if(navigator.geolocation) {
            // console.log('navigator.geolocation:');
            // console.log('lets see what fucking info we get from this useless function: ',navigator.geolocation.getCurrentPosition(this.showError.bind(this)));
            navigator.geolocation.watchPosition(this.showPosition.bind(this), this.showError.bind(this));
            // this.showError);
            
            
            
        }

    }



    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`)
    }

    mapClicked($event: MouseEvent) {

        // this.markers.push({
        // lat: $event.coords.lat,
        // lng: $event.coords.lng
        // });
        
        console.log('$event.coords', $event.coords);
        
        this.locAdded.emit($event.coords);

    }


    markerDragEnd(m: marker, $event: MouseEvent) {
        // console.log('dragEnd', m, $event);
    }

    showPosition(pos){
        let mySelf = {lat: 0,lng:0,isShown: true, label: 'Me'};

        // console.log(pos);
        mySelf.lat = pos.coords.latitude;
        mySelf.lng = pos.coords.longitude;
        // console.log(mySelf);

        console.warn('Your current position is:');
        // console.log('Latitude : ' + this.latHome);
        // console.log('Longitude: ' + this.lngHome);
        // console.log('More or less ' + crd.accuracy + ' meters.');
        // console.log('mySelf:',mySelf);
        
        this._markers.push(mySelf);
        
        console.log('this._markers:',this._markers);
        
       
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

    // _markers: marker[] = [];

}