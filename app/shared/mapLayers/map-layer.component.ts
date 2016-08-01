import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MapComponent} from '../map-component/map.component';
import {LayerFilterComponent} from '../../layer/layer-filter.component'
import {LayerListComponent} from '../../layer/layer-list.component'
import {ToggleButton} from '../directives/toggle-button';
import {FilterByPipe} from '../../shared/pipes/filter-list.pipe';

@Component({
    moduleId: module.id,
    selector: 'mapLayers',
    pipes: [FilterByPipe],
    directives: [LayerFilterComponent, ToggleButton, MapLayerComponent],
    styles: [`.mapLayers{background: cadetblue;}`],
    template: `<section class="mapLayers">
                    <layer-filter  (filterChange)="filter = $event"></layer-filter>
                <div>
                    <toggleButton *ngFor="let layer of layers" (click)="onClick($event)" 
                        [ngClass]="on ? 'on' : 'off'">
                        {{layer.name}}
                    </toggleButton>
                </div>
               </section>
                `
})


export class MapLayerComponent implements OnInit {
    private search = true;
    // private layerFilter = false;
    @Input() on = false;
    @Input() private layers;
    @Output() onChange = new EventEmitter();

    onClick(){
     this.on = !this.on;
     this.onChange.emit(this.on);
    }
    constructor(private layerFilter:LayerFilterComponent) { }

    ngOnInit() { 
        // console.log("ngOnInit , adminMode:",this.layerFilter.adminMode );
        
        // this.layerFilter.adminMode(false); //set mode to user mode (display "Search")
        // console.log("ngOnInit , adminMode:",this.layerFilter.isAdminMode );
    }
}