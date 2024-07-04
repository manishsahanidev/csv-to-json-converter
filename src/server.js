import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import { parseCSV } from "./parseCSV.js";
import { insertData, clearTable } from "./dbOperations.js";

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/upload", upload.single("csvFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    const data = await parseCSV(req.file.path);
    await insertData(data);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/clear", async (req, res) => {
  try {
    await clearTable();
    res.send("Table content deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
