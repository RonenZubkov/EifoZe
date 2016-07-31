import {ILoc} from './layer.component';

export class LayerModel {

  constructor(public name: string, public symbol: string, public locs: ILoc[], private _id: string) {
    // this.name = name;
    // this.locs = [{name:string, lat:number, lan:number}];
  }
  get id() {
    return this._id;
  }
  getImgUrl() {
    return `public/img/layer/${this.name}.png`;
  }
}

// export class LocModel {
//   public name : string;
//   public lat : number;
//   public lng : number;
  
//   constructor(name:string, lng:number, lat:number) {
    
//   }
// }
