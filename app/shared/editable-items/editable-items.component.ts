import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  styleUrls: [],
  selector: 'editable-items',
  template: `
    <section>
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
 
@Output() private remove = new EventEmitter();
@Output() private add = new EventEmitter();
@Input() private items; 

  
  
  constructor() { }

  ngOnInit() {
    }

  removeItem( item){
     
      console.log(item);
      
      this.remove.emit(item)
    }
 
}