import db from "../../db/client.js";

export async function getAllFilesWithFolderNames() {
  const result = await db.query(`
    SELECT files.*, folders.name AS folder_name
    FROM files
    JOIN folders ON files.folder_id = folders.id
  `);
  return result.rows;
}
export async function createFile({ name, size, folder_id }) {
  const result = await db.query(
    `
    INSERT INTO files (name, size, folder_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [name, size, folder_id]
  );
  return result.rows[0];
}