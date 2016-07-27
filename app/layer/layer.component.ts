import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LayerService} from './layer.service';
import {LayerModel} from './layer.model';


@Component({
  moduleId: module.id,
  styleUrls: [`layer.css`],
  // selector: 'monster-list',
  template: `
    <section *ngIf="layer">
      <h2>Layer {{layer.name}}</h2>
      <img [src]="layer.getImgUrl()" >

    </section>
  `
})
export class LayerComponent implements OnInit {

  private layer : LayerModel;

  constructor(
                private route: ActivatedRoute,
                private _layerService : LayerService
  ) { }

  ngOnInit() {
   this.route.params.subscribe(params => {
    //  console.log('Params are: ', params);
     const id = params['id'];
     const prmLayer = this._layerService.get(id);
     prmLayer.then((layer: LayerModel) => {
       this.layer = layer;
     });
   });
  }



}
