import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";

type AudioFormat = "wav" | "mp3" | "m4a" | "aac";

const VALID_AUDIO_OUTPUT_FORMATS: Array<AudioFormat> = [
  "wav",
  "mp3",
  "m4a",
  "aac",
];

const VALID_AUDIO_INPUT_FORMATS = [...VALID_AUDIO_OUTPUT_FORMATS, "opus"];

const FFMPEG_PATH = "./.ffmpeg/ffmpeg";
const TMP_PATH = "/tmp/ffmpeg-api";

export const convertAudioFile = async (
  filename: string,
  buffer: Buffer,
  format: AudioFormat
) => {
  const extension = filename.match(/[.][\w]{2,6}$/)?.[0].replace(".", "");

  if (!extension || !VALID_AUDIO_INPUT_FORMATS.includes(extension)) {
    throw `Valid input extensions are: ${VALID_AUDIO_INPUT_FORMATS.join(", ")}`;
  }

  fs.mkdir(TMP_PATH, { recursive: true });

  // Save audio file to temporary storage
  const temporaryFilePath = `${TMP_PATH}/${filename}`;
  await fs.writeFile(temporaryFilePath, buffer);

  ffmpeg.setFfmpegPath(FFMPEG_PATH);

  return ffmpeg(temporaryFilePath)
    .toFormat(format)
    .on("end", async function () {
      console.log("\tConversion complete:", filename);
      await fs.rm(temporaryFilePath);
    });
};
