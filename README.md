## Setup Instructions

If running outside of Docker, first, run `yarn setup` to get the FFMPEG binary, then run `yarn start`.

If running inside Docker, simply run `docker compose up` on your server from the root project directory. The FFMPEG and Whisper ASR APIs will be pulled and served locally.

You can use the sample systemd service at `./systemd/obsidian-smart-transcription.service` by placing it into `/etc/systemd/system`:

```bash
cp ./systemd/obsidian-smart-transcription.service /etc/systemd/system
```

Be sure to replace the `WorkingDirectory` line inside the service file with the actual working directory on your server.

Then run the following to start as a system service.

```bash
systemctl daemon-reload
systemctl enable obsidian-smart-transcription
systemctl start obsidian-smart-transcription
```

## Using the API

### Convert Audio Endpoint `/convert/audio`

To convert an audio file, send a POST request to `http://{HOST}:1337/convert/audio`.
Ensure your request format is using form-data, setting the `audio_file` field to the binary data of your audio file and the `format` field to your desired audio output format.

You can input the following formats:

- "wav"
- "mp3"
- "m4a"
- "aac"
- "opus"

You can convert to the following formats:

- "wav"
- "mp3"
- "m4a"
- "aac"

### Transcribe Audio Endpoint `/transcribe`

To transcribe an audio file, send a POST request to `http://{HOST}:1337/transcribe`.
Ensure your request format is using form-data, setting the `audio_file` field to the binary data of your audio file.

## Server Setup

1. Install Docker Engine

According to [this guide](https://gist.github.com/ingo-m/0952a9d77dc39250b559cbbb91ca9dae), set up NVIDIA to run on Docker on your server.

Install CUDA

- Allow nonfree packages with apt

  ```bash
  echo "deb http://deb.debian.org/debian/ sid main contrib non-free non-free-firmware" >> /etc/apt/sources.list
  ```

- Install CUDA

  ```bash
  apt update
  apt install nvidia-driver firmware-misc-nonfree

  ```

If your server has GPU access (NVIDIA), run
`docker compose --file ./docker-compose-gpu.yml up --build`
