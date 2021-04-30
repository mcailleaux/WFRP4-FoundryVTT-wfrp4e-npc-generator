export default class FolderUtil {
  public static async createNamedFolder(
    name: string,
    parent?: Folder | null
  ): Promise<Folder | null> {
    if (name == null) {
      return null;
    }
    let folder: Folder | null = null;
    if (name.includes('/')) {
      for (let path of name.split('/')) {
        folder = await FolderUtil.createNamedFolder(path, folder);
      }
    } else {
      folder =
        game.folders.find((f) => f.name === name) ??
        <Folder>await Folder.create({
          name: name,
          type: 'Actor',
          parent: parent?._id,
        });
    }
    return folder;
  }
}
