export default class FolderUtil {
  public static async createNamedFolder(
    name: string,
    parent: Folder | null = null
  ): Promise<Folder | null> {
    if (name == null || name.length === 0) {
      return null;
    }
    let folder: Folder | null = null;
    if (name.includes('/')) {
      let splitedName = name.split('/');
      if (splitedName.length > 2) {
        splitedName = splitedName.filter((_n, index) => index <= 2);
        console.warn(
          `Folder's name trunked to keep only 2 sub-folders maximum : ${splitedName.join(
            '/'
          )}`
        );
      }
      for (let path of splitedName) {
        folder = await FolderUtil.createNamedFolder(path, folder);
      }
    } else {
      folder =
        game.folders.find(
          (f) =>
            (<any>f.data).name === name &&
            (<any>f.data).parent === ((<any>parent?.data)?._id ?? null)
        ) ?? <Folder>await Folder.create({
          name: name,
          type: 'Actor',
          parent: parent?._id ?? null,
        });
    }
    return folder;
  }
}
