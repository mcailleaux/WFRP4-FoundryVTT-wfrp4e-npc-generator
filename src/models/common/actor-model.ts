import { IOptions } from './options-int.js';

export abstract class ActorModel {
  public name: string;
  public abstract options: IOptions;
}
