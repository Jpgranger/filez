import db from "../../db/client.js";

export async function getAllFolders() {
  const result = await db.query(`SELECT * FROM folders`);
  return result.rows;
}

export async function folderExists(id) {
  const result = await db.query(`SELECT 1 FROM folders WHERE id = $1`, [id]);
  return result.rowCount > 0;
}

export async function getFolderByIdWithFiles(id) {
  const result = await db.query(
    `
    SELECT 
      folders.id AS id,
      folders.name AS name,
      COALESCE(
        json_agg(
          json_build_object(
            'id', files.id,
            'name', files.name,
            'size', files.size,
            'folder_id', files.folder_id
          )
        ) FILTER (WHERE files.id IS NOT NULL),
        '[]'
      ) AS files
    FROM folders
    LEFT JOIN files ON files.folder_id = folders.id
    WHERE folders.id = $1
    GROUP BY folders.id
    `,
    [id]
  );

  return result.rows[0];
}
