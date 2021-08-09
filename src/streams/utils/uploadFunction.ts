import { ensureFile } from "https://deno.land/std@0.101.0/fs/mod.ts";
import { files, PuRelUser } from "../../schemas/mod.ts";

/**for uploading an file 2 steps are necessary
 * step1.store the file meta data in db(the content of file doesn't keep in db)
 * step2.the file itself(name.format) keep in server
 */

/**
 * @interface:an  for defining the FileType */
export interface FileType {
  filename: string;
  type: string;
  size: number;
  content: any;
}

/**
 * @function:upload the file
 */

export const uploadFile = async (file: FileType, user: PuRelUser) => {
  /**step1: write the file meta data in db */
  const objectId = await saveFileInDB(file, user);

  /**step2: write the file itself in server */
  await writeFileInServer(objectId, file.filename, file.content);

  /**return the uploaded file metaData from DB, only return the file metaData */
  return objectId;
};

/**
 * @function: a function to write File in DB
 * @argument: the file that is going to save in db
 * @returns: the objectId of the uploaded file is returned as string
 */
export const saveFileInDB = async (
  file: FileType,
  user: PuRelUser,
): Promise<string> => {
  const uploadedFile = await files.insertOne({
    filename: file.filename!,
    type: file.type!,
    size: file.size!,
    user,
  });
  return uploadedFile.toString();
};

/**
 * @function: a to write file in server
 * @argument:the objectId of the file in db
 * @argument:the name of the file
 * @argument:the content of the file
 *
 */
export const writeFileInServer = async (
  objectId: string,
  name: string,
  data: any,
) => {
  // const path = `files/${objectId}_${name}`;
  const path = `files/${objectId}`;
  await ensureFile(path!);
  return await Deno.writeFile(path!, data, { create: true });
};
