import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, REACTIVE_FORM_DIRECTIVES, FormControl} from '@angular/forms';
import {LayerService} from './layer.service';
import {LayerModel} from './layer.model';
import {UploadDemoComponent} from '../shared/upload-demo/upload-demo.component'

@Component({
  moduleId: module.id,
  // selector: 'monster-edit',
  templateUrl: 'layer-edit.component.html',
  directives: [REACTIVE_FORM_DIRECTIVES, UploadDemoComponent]
})
export class LayerEditComponent implements OnInit {

  private frmLayer: FormGroup;
  private layerToEdit: LayerModel;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private layerService: LayerService) { }

  ngOnInit() {
    console.log('this.route.params', this.route.params);
    this.prepareForm();
    this.route.params.subscribe(params => {
        const id = params['id'];
        // This means EDIT mode
        if (id) {
          this.layerService.get(id)
            .then((layer) =>{

                this.layerToEdit = layer;
                console.log('in edit, ajax returned : ',  this.layerToEdit,  this.frmLayer.controls );
                (<FormControl>this.frmLayer.controls['name']).updateValue(layer.name);
                (<FormControl>this.frmLayer.controls['locName']).updateValue(layer.locs);
                // (<FormControl>this.frmLayer.controls['power']).updateValue(layer.locs);
                // (<FormControl>this.frmLayer.controls['power']).updateValue(layer.power);
            });
        }
      });
  }
  save() {
    const layerId = (this.layerToEdit)?  this.layerToEdit.id : undefined;
    this.layerService.save(this.frmLayer.value, layerId)
      .then(()=>{
          this.router.navigate(['/layer']);
      });

  }

  prepareForm() {
     this.frmLayer = this.formBuilder.group({
      name: ['',
              Validators.compose([Validators.required,
                                  Validators.minLength(3),
                                  Validators.maxLength(100)])],
      locName: [5, Validators.required]
    });
  }
}
