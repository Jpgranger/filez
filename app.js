import express from "express";
import { getAllFilesWithFolderNames, createFile } from "./db/queries/files.js";
import {
  getAllFolders,
  getFolderByIdWithFiles,
  folderExists
} from "./db/queries/folders.js";

const app = express();
app.use(express.json());

app.get("/files", async (req, res) => {
  try {
    const files = await getAllFilesWithFolderNames();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/folders", async (req, res) => {
  try {
    const folders = await getAllFolders();
    res.status(200).json(folders);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/folders/:id", async (req, res) => {
  const folderId = Number(req.params.id);
  if (isNaN(folderId)) {
    return res.status(400).json({ error: "Invalid folder ID" });
  }

  try {
    const folder = await getFolderByIdWithFiles(folderId);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.status(200).json(folder);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/folders/:id/files", async (req, res) => {
  const folderId = Number(req.params.id);
  if (isNaN(folderId)) {
    return res.status(400).json({ error: "Invalid folder ID" });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body required" });
  }

  const { name, size } = req.body;
  if (!name || typeof name !== "string" || typeof size !== "number") {
    return res.status(400).json({ error: "Missing name or size" });
  }

  const exists = await folderExists(folderId);
  if (!exists) return res.status(404).json({ error: "Folder not found" });

  try {
    const newFile = await createFile({ name, size, folder_id: folderId });
    res.status(201).json(newFile);
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Duplicate file name in folder" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default app;
