export class LayerModel {

  constructor(public name: string, public power: number, private _id: string) {}

  get id() {
    return this._id;
  }
  getImgUrl() {
    return `public/img/layer/${this.name}.png`;
  }
}
