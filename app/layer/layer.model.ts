// import {LocModel} from './layer.model';

export class LayerModel {

  constructor(public name: string, public locs: LocModel[], private _id: string) {}
  get id() {
    return this._id;
  }
  getImgUrl() {
    return `public/img/layer/${this.name}.png`;
  }
}

export class LocModel {
  public name : string;
  public lat : number;
  public lng : number;
  
  constructor(name:string, lng:number, lat:number) {
    
  }
}
