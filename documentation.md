# Documentation for MelodyMorph (Audio Visualizer)

**Project Folder Structure**
---------------------------
The MelodyMorph project follows the following folder structure:

```
MelodyMorph/
├── app.py
├── static/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js
│   │   ├── bundle.js
│   │   └── audioVisualizer.js
│   └── uploads/
│       ├── images/
│       │   └── image.jpg
│       └── audios/
│           └── audio.wav
├── templates/
│   └── index.html
├── node_modules/
│   └── (dependencies and modules installed by npm)
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .gitignore
└── README.md
```

**Project Overview: How the Flask App Works**
---------------------------------------------

The provided Flask app, named "MelodyMorph," is a web application that allows users to upload audio files and visualize audio features. It uses various libraries, including Librosa, Matplotlib, and Node.js modules, to process audio files, extract audio features, create visualizations, and serve the application to users.

**Flask:**
Flask is a web framework for Python that simplifies web application development. It provides tools for handling HTTP requests, routing, and serving web pages.

**Librosa:**
Librosa is a Python library for analyzing and processing audio and music signals. It is used here to load audio files, extract audio features such as chroma, MFCC, and spectral centroid, and process audio data for visualization.

**Matplotlib:**
Matplotlib is a popular Python plotting library that is used to create visualizations. It is employed to generate visual representations of the audio features extracted using Librosa.

**Node.js Modules (Browserify and Watchify):**
The project includes JavaScript files for client-side logic. To bundle and manage these files, Node.js modules "Browserify" and "Watchify" are used.
- **Browserify:** Browserify allows the use of Node.js-style `require()` statements in the browser. It bundles multiple JavaScript files into a single file (bundle.js) so that they can be loaded efficiently on the client-side.
- **Watchify:** Watchify is an extension of Browserify that automatically updates the bundle whenever changes are made to the JavaScript files. It simplifies the development process by providing live reloading during development.

**Gunicorn:**
Gunicorn (Green Unicorn) is a production-ready WSGI (Web Server Gateway Interface) HTTP server used to serve Python web applications, such as the Flask app in this project. Gunicorn can handle multiple concurrent requests efficiently and is suitable for deployment in production environments.

**Docker:**
Docker is used to containerize the application. The Dockerfile defines the steps required to build the application image, and it also specifies the base image, dependencies, and configuration to create a Docker container that runs the Flask app.

**Step-by-Step Explanation of the Flask App:**
-----------------------------------------------
1. The main Flask application is defined in the `app.py` file. It includes two routes:
   - `/`: This route serves the main page of the web application by rendering the `index.html` template.
   - `/upload`: This route handles POST requests sent by the client when an audio file is uploaded. It processes the uploaded audio file using Librosa, creates visualizations using Matplotlib, and returns the base64-encoded image of the visualizations as a JSON response.

2. The `index.html` template is stored in the `templates/` folder. It contains the HTML structure and layout of the main page. The template includes JavaScript and CSS files required for the web application's functionality and styling.

3. The JavaScript files `main.js` and `audioVisualizer.js` (stored in the `static/js/` folder) handle the client-side logic for the web application. The `main.js` file is the entry point, and it uses Browserify to bundle all required JavaScript files into `bundle.js`, which is then loaded by the main page.

4. When a user uploads an audio file, the `upload()` function in `app.py` is called. It saves the uploaded audio file to the `uploads/audios/` folder and processes it using Librosa to extract audio features.

5. Once the audio features are extracted, Matplotlib is used to create visualizations, which consist of three subplots: Chromagram, MFCC, and Spectral Centroid. These visualizations are saved as PNG images.

6. To display the visualizations on the web application, the PNG images are converted to base64-encoded strings and returned as a JSON response from the `/upload` route.

**Dockerfile Explanation:**
---------------------------
The Dockerfile is divided into two stages: the Build stage and the Production stage.

1. **Build Stage** (Using Node.js):
   - The base image for the build stage is `node:latest`. It installs the required Node.js modules specified in `package.json`.
   - The working directory is set to `/app`, and the necessary files are copied into the container.
   - The command `npm run bundle` is executed to bundle the JavaScript files using Browserify and create `bundle.js`.

2. **Production Stage** (Using Python):
   - The base image for the production stage is `python:3.10-slim`. It installs the Python dependencies specified in `requirements.txt`.
   - The working directory is set to `/app`, and the files from the build stage are copied into the container.
   - The Flask app is started using Gunicorn with the command `CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000"]`, which runs the Flask app on the specified host and port.

**Docker Command**
------------------
- Build Docker image:
  ```
  docker build -t melody-morph .
  ```

- Run Docker container:
  ```
  docker run -d -p 8000:5000 melody-morph
  ```

- Remove unused Docker resources:
  ```
  docker system prune
  ```

**NPM Command**
----------------
- Bundle JavaScript files:
  ```
  npm run bundle
  ```

- Watch for changes in JavaScript files and automatically bundle them:
  ```
  npm run watch
  ```

**Audio Information**
---------------------
**Sample Rate**:
Sample rate refers to the number of samples of audio captured per second, typically measured in Hertz (Hz). It represents the precision or quality of the audio recording. A higher sample rate captures more details and provides a more accurate representation of the original sound. Common sample rates include 44.1 kHz (CD quality) and 48 kHz (standard for digital video and audio production).

**Bit Rate**:
Bit rate refers to the number of bits processed or transmitted per unit of time, typically measured in kilobits per second (kbps) or megabits per second (Mbps). In the context of audio, it represents the amount of data used to encode one second of audio. A higher bit rate generally indicates better audio quality, as more data is allocated to represent the audio signal accurately. It is commonly associated with compressed audio formats like MP3, AAC, or OGG. Bit rate can vary depending on the encoding settings and desired trade-offs between audio quality and file size. Higher bit rates result in larger file sizes.

**Visualization Modes**
------------------------
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


**Issues & Improvements**
-------------------------
1. Seekbar update 00:00 on pause button press.
2. Playback control does not affect the seekbar time.
3. Audio recording while another audio is played (should stop other playing audio while recording).
4. Equalizer effect not noticeable.
5. Improve error handling for invalid audio file formats and empty files during the upload process.
6. Add user authentication and authorization for managing audio files and access control to certain visualizations.
7. Implement database integration to store and manage user uploaded audio files and associated metadata.
8. Enhance the UI/UX with better design, responsiveness, and interactive features.
9. Optimize the audio processing and visualization algorithms to improve performance.
10. Add support for more audio formats and provide options for users to choose their preferred audio format for download.