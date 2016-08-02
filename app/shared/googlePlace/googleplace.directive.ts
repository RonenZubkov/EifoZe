/**
 * Created by ronen on 01/08/2016.
 */

import {Directive, ElementRef, EventEmitter, Output} from '@angular/core';
import {NgModel} from '@angular/common';

export declare var google:any;

@Directive({
    selector: '[googleplace]',
    providers: [NgModel],
    host: {
        '(input)' : 'onInputChange()'
    }
})
export class GooglePlaceDirective  {
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    modelValue:any;
    autocomplete:any;
    private _el:HTMLElement;


    constructor(el: ElementRef,private model:NgModel) {
        this._el = el.nativeElement;
        this.modelValue = this.model;
        let input = this._el;
        this.autocomplete = new google.maps.places.Autocomplete(input, {});
        google.maps.event.addListener(this.autocomplete, 'place_changed', ()=> {
            let place = this.autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    invokeEvent(place:Object) {
        this.setAddress.emit(place);
    }


    onInputChange() {
    }
}
