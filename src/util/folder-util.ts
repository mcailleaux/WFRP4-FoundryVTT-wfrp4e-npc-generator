export default class FolderUtil {
  public static async createNamedFolder(
    name: string,
    parent?: Folder | null
  ): Promise<Folder | null> {
    if (name == null || name.length === 0) {
      return null;
    }
    let folder: Folder | null = null;
    if (name.includes('/')) {
      for (let path of name.split('/')) {
        folder = await FolderUtil.createNamedFolder(path, folder);
      }
    } else {
      folder = game.folders.find((f) => f.name === name);
      if (folder == null) {
        const folderData: any = {
          name: name,
          type: 'Actor',
        };
        if (parent != null) {
          folderData.parent = parent._id;
        }
        folder = <Folder>await Folder.create(folderData);
      }
    }
    return folder;
  }
}
