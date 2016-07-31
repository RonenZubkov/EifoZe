import { Component, Directive,OnInit} from '@angular/core';
import {ToggleButton} from '../directives/toggle-button';
import {GoogleMapsAPIWrapper ,MapsAPILoader, NoOpMapsAPILoader, MouseEvent, GOOGLE_MAPS_PROVIDERS, GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {SymFilterPipe} from '../pipes/filter-list.pipe';
import {LayerService} from '../../layer/layer.service';
import {LayerModel} from "../../layer/layer.model";

interface marker {
    lat: number;
    lng: number;
    label?: string;
    isShown?: boolean;
    icon?: string;
    symbol?: string;
    // latHome: any;
    // lngHome: any;
}


@Component({
    moduleId: module.id,
    selector: 'map',
    directives: [GOOGLE_MAPS_DIRECTIVES,ToggleButton],
    providers: [GoogleMapsAPIWrapper],
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
        
          <strong>InfoWindow content</strong>
          
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
    private markLayers = [];
    state: boolean = false;
    // google maps zoom level
    zoom: number = 8;

    // initial center position for the map
    lat: number = 32.782548;
    lng: number = 35.014488;

    private _layers : LayerModel[];

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

    // get layers(){
    //     return this._layers;
    // }

    ngOnInit(){

    //private layers : LayerModel[] = [];
        //Too Active this after layer model will be Done, and h0w the fuck i map and push them into markers array

        const prmLayers = this.layerService.query();
        // console.log("prmLayers =", prmLayers);

        prmLayers.then((layers :LayerModel[]) =>{
            console.log('layers:',layers);
            this.markers = [];
            layers.forEach(layer => {
                layer.locs.forEach(loc=> {
                    const marker = Object.assign({}, loc, {symbol : layer.symbol});
                    console.log('marker', marker);
                    this.markers.push(marker)
                })
            });

            // this.markers = [...this.markLayers, this.markers];

        });
        // console.log('markLayers:',this.markLayers);

        // return this.markLayers;
        // //(monsters : MonsterModel[])
        // console.log('check:',prmLayers);
        // console.log('this._layers:');

        // const prmLayers = this.layerService.query();
        //     prmLayers.then((layers) =>{
        //         this.layers = layers;
        //         console.log(prmLayers);
        //     });



        // console.log('this._layers:');

        if(navigator.geolocation) {
            console.log('navigator.geolocation:');
            // console.log('lets see what fucking info we get from this useless function: ',navigator.geolocation.getCurrentPosition(this.showError.bind(this)));
            navigator.geolocation.watchPosition(this.showPosition.bind(this), this.showError.bind(this));
            // this.showError);
        }

    }



    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`)
    }

    mapClicked($event: MouseEvent) {
        this.markers.push({
        lat: $event.coords.lat,
        lng: $event.coords.lng
        });
    }

    // createMarker(options?:MarkerOptions) : Promise<Marker>{
    //
    // }


    markerDragEnd(m: marker, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
    }

    showPosition(pos){
        let mySelf = {lat: 0,lng:0,isShown: true, label: 'Me'};

        console.log(pos);
        // this.latHome = crd.latitude;
        mySelf.lat = pos.coords.latitude;
        mySelf.lng = pos.coords.longitude;
        console.log(mySelf);
        // this.lngHome = crd.longitude;

        console.warn('Your current position is:');
        // console.log('Latitude : ' + this.latHome);
        // console.log('Longitude: ' + this.lngHome);
        // console.log('More or less ' + crd.accuracy + ' meters.');
        // this.markers.push(mySelf);
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