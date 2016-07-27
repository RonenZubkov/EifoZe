import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  styleUrls: [],
  selector: 'deletable-items',
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
export class DeletableItemsComponent  {
 
@Output() private itemToRemove = new EventEmitter();
@Input() private items; 

  
  
  constructor() { }

  ngOnInit() {
    }

  removeItem( item){
     
      console.log(item);
      
      this.itemToRemove.emit(item)
    }
 
}