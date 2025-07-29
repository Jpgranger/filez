import app from "#app";
import db from "#db/client";

const PORT = process.env.PORT ?? 3000;

try {
  await db.connect();

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}...`);
  });

  process.on("SIGINT", async () => {
    console.log("\n🛑 Closing DB connection...");
    await db.end();
    process.exit(0);
  });
} catch (err) {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
}
