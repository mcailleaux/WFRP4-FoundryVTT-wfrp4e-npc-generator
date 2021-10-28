export const wfrp4e = () => (<any>game).wfrp4e;
export const user = () => (<any>game).user;
export const actors = () => (<any>game).actors;
export const i18n = () => (<any>game).i18n;
export const modules = () => (<any>game).modules;
export const packs = () => (<any>game).packs;
export const babele = () => (<any>game).babele;
export const folders = () => (<any>game).folders;
export const settings = () => (<any>game).settings;
export const items = () => (<any>game).items;
export const world = () => (<any>game).world;
export const notifications = () => (<any>ui).notifications;
export const initTemplates = (paths: string[]) => loadTemplates(paths);
export const names = () => (<any>game).wfrp4e.names;
export const generateName = (speciesKey: string) =>
  names().generateName({ species: speciesKey });
