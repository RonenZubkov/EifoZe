import {ILoc} from './layer.component';

export class LayerModel {

  constructor(public name: string, public locs: ILoc[], private _id: string) {
  }
  get id() {
    return this._id;
  }
  getImgUrl() {
    return `public/img/layer/${this.name}.png`;
  }
}