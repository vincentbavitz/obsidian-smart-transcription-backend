## Setup Instructions

First, run `yarn setup` to get the FFMPEG binary.

Then simply run `docker compose up` from your server.
The FFMPEG and Whisper ASR APIs will be pulled and served locally.

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

To convert an audio file, send a POST request to
`http://{HOST}:9001/convert/audio`. Ensure your reequet format is using form-data, setting the `audio` field to the binary data of your audio file and the `format` field to your desired audio output format.

You can input the following formats:

- "wav"
- "mp3"
- "m4a"
- "aac"

You can convert to the following formats:

- "wav"
- "mp3"
- "m4a"
- "aac"
- "opus"
