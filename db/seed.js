import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await db.query(`DELETE FROM files;`);
  await db.query(`DELETE FROM folders;`);

  const folderNames = ['Documents', 'Photos', 'Music'];

  for (const name of folderNames) {
    const {
      rows: [folder],
    } = await db.query(
      `INSERT INTO folders (name) VALUES ($1) RETURNING *;`,
      [name]
    );

    for (let i = 1; i <= 5; i++) {
      await db.query(
        `INSERT INTO files (name, size, folder_id) VALUES ($1, $2, $3);`,
        [`${name}_file${i}.txt`, i * 100, folder.id]
      );
    }
  }
}
