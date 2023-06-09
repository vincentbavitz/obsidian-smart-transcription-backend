import cors from "cors";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import multer from "multer";
import { convertAudioFile } from "./utils/convert";

const PORT = 1337;

const main = async () => {
  const app = express();
  app.use(cors());

  /**
   * Forward our request to the Transcription Service
   * Simply send a POST request of multi-part-form-data to /transcribe
   * containing audio_file: File
   **/
  app.use(
    "/transcribe",
    createProxyMiddleware({
      target: "http://whisper-asr:9000/asr?language=en&task=transcribe",
      changeOrigin: true,
    })
  );

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
  });

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
