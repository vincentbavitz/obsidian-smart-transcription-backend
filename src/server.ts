import cors from "cors";
import express from "express";
import multer from "multer";
import { convertAudioFile } from "./utils/convert";

const PORT = 9001;

const main = async () => {
  const app = express();

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
  });

  app.use(cors());
  app.post("/convert/audio", upload.single("audio_file"), async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "Invalid audio file." });
      return;
    }

    if (!req.body.format) {
      res.status(400).json({
        message: "Please provide a valid format in the `format` field.",
      });
    }

    try {
      const ffmpegOutput = await convertAudioFile(
        req.file.originalname,
        req.file.buffer,
        req.body.format
      );

      ffmpegOutput.pipe(res, { end: true });
    } catch (error) {
      console.log("Error:", error);
      res.status(400).json({ message: error });
    }
  });

  app.listen(PORT, () => {
    console.log(`Running on http://0.0.0.0:${PORT}`);
  });
};

main();
