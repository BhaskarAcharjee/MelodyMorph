# MelodyMorph - Transforming Music into Visual Symphony

MelodyMorph is a web-based audio visualizer built with Python Flask and Gunicorn. It allows you to upload audio files and visualize the audio data in real-time using various visualization modes.

**Note: This project is currently in the development phase.**

## Features

- Upload and play audio files
- Real-time visualization of audio data
- Multiple visualization modes (waveform, spectrogram, frequency bars, 3D visualization, and more)
- Playback control (play, pause, stop)
- Volume and playback speed adjustment

## Deployment

The live deployment of MelodyMorph can be accessed at [MelodyMorph Live Webpage](https://melodymorph.onrender.com/).


## Preview

![melodymorph_screenshot1](https://github.com/BhaskarAcharjee/MelodyMorph/assets/76872572/b254a208-df09-450f-88c7-566bd1d93f4d)
![melodymorph_screenshot2](https://github.com/BhaskarAcharjee/MelodyMorph/assets/76872572/d453ac6e-063b-4ad9-8c02-2a31bd730b98)

## Prerequisites

- Python 3.10
- Flask
- Gunicorn
- Web browser with Web Audio API support

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/BhaskarAcharjee/MelodyMorph.git
```

2. Navigate to the project directory:

```bash
cd MelodyMorph
```

3. Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

4. Install the required Node.js development dependencies:

```bash
npm install
```

5. Build the JavaScript bundle:

```bash
npm run bundle
```

6. Build the Docker image:

```bash
docker build -t melody-morph .
```

7. Run the Docker container:

```bash
docker run -p 5000:5000 melody-morph
```

8. Open your web browser and visit `http://localhost:5000` to access MelodyMorph.

## Usage

1. Click on the "Choose File" button to select an audio file.
2. Click on the "Play" button to start playing the audio and visualize it.
3. Use the playback control buttons (pause, stop) to control the audio playback.
4. Adjust the volume and playback speed using the sliders.
5. Select different visualization modes using the mode buttons.
6. Explore the audio visualizations and enjoy!

## Implemented Visualization Modes

1. Waveform: Displays the amplitude of the audio signal over time as a continuous waveform.
2. Spectrogram: Represents the audio frequency spectrum over time using a color-coded intensity plot.
3. Frequency Bars: Visualizes audio frequency bands as vertical bars with varying heights.
4. Circular Visualization: Audio-reactive shapes distributed around the center forming a circle.
5. Time-Frequency Heatmap: Shows the audio spectrum with color-coded cells based on amplitude and frequency.
6. Audio Reactive Shapes: Various shapes and sizes change with the music's amplitude and frequency.
7. Fractals: Displays self-replicating geometric patterns that change in response to audio data.
8. Spectrum Waterfall: A cascading visualization of the audio spectrum over time.
9. Particle System: Animated particles moving or emitting based on audio data.
10. Frequency Rings: Divides the canvas into rings, each representing a different frequency range.
11. 3D Visualization: Three-dimensional shapes that rotate and change with the music.
12. Kaleidoscope: Mirrored shapes and patterns that change with the music.
13. Glitch Art: Visual distortions and glitches triggered by audio events.
14. Motion Trails: Visualizes motion paths of audio-reactive objects over time.
15. VU Meter: Classic volume unit meter that shows audio level intensity.
16. Neon Glow: Vibrant neon colors and glows that pulse with the music.
17. Geometric Patterns: Audio-reactive geometric shapes arranged in intricate patterns.
18. Audio Fireworks: Firework-like particles that burst on audio events.
19. Spectrum Flowers: Flowers that bloom and change colors based on audio frequencies.
20. Pixelation: Pixels that change color and size according to audio data.
21. Audio Tornado: Audio-reactive tornado-like spirals moving across the canvas.
22. Audio Rain: Raindrops that fall and splash based on audio intensity.
23. Audio Metronome: Metronome-like visuals pulsing to the beat of the music.
24. Audio Jellyfish: Jellyfish-like creatures floating and pulsating with audio.
25. Fractal Tree: Recursive tree-like patterns synced with audio.
26. Audio Galaxy: Mesmerizing galaxy visualization with audio sync.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
