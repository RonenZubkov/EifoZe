import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, REACTIVE_FORM_DIRECTIVES, FormControl} from '@angular/forms';
@Component({
  moduleId: module.id,
  styleUrls: [],
  selector: 'editable-items',
  directives: [REACTIVE_FORM_DIRECTIVES],
  template: `
    <section>
      <form [formGroup]="frmItem" (submit)="save()" >
        <div class="form-group">
          <label>Name:</label>
          <input type="text" class="form-control" formControlName="name">
        </div>

        <div class="form-group">
          <label>lat:</label>
          <input type="string" class="form-control" formControlName="lat">
        </div>

        <div class="form-group">
        <label>lan:</label>
        <input type="string" class="form-control" formControlName="lan">
        </div>

        <button type="submit" [disabled]="!frmItem.valid" class="btn btn-default">Submit</button>
      </form>

      <h2> Deletable Items</h2>

    
      <table class="table table-hover">
                    <tr>
                        <th>Name</th>
                        <th>Actions</th> 
                    </tr> 
                     <tr *ngFor="let item of items ">
                        <td>{{item.name}}</td>
                        <td>
                            <button class="btn btn-danger" (click)="removeItem(item)">Delete</button>
                        </td>
                    </tr>
      </table>
      
    </section>
  `
})
export class EditableItemsComponent  {
 

@Output() private edit = new EventEmitter();
@Input() private items; 
 private frmItem: FormGroup;
 
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.prepareForm();
  
    
    }

  removeItem(item){
     
      console.log(item);
      
      this.edit.emit({type: 'remove', item})
    }

  save() {
      // a new item
    
      let newItem ={name: this.frmItem.value.name, lat: this.frmItem.value.lat, lan: this.frmItem.value.lan};
      this.edit.emit({type: 'add', item: newItem});
  }
   
   prepareForm() {
     this.frmItem = this.formBuilder.group({
      name: ['',
              Validators.compose([Validators.required,
                                  Validators.minLength(3),
                                  Validators.maxLength(100)])],
      lat:  [0,Validators.required],
      lan:  [0,Validators.required]
      
    });
  }


}