export class SelectModel {
  public key: string;
  public value: string;
  public selected: boolean;

  constructor(key: string, value: string, selected: boolean) {
    this.key = key;
    this.value = value;
    this.selected = selected;
  }
}
