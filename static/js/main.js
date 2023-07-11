document.addEventListener("DOMContentLoaded", () => {
  const audioFileInput = document.getElementById("audioFile");
  const playButton = document.getElementById("playButton");
  const stopButton = document.getElementById("stopButton");
  const visualizationCanvas = document.getElementById("visualization");
  const sampleRateElement = document.getElementById("sampleRate");
  const durationElement = document.getElementById("duration");
  const audioListButtons = document.getElementsByClassName("audio-item");

  let audioContext;
  let audioSource;
  let analyzerNode;
  let visualizationContext;
  let visualizationWidth;
  let visualizationHeight;
  let gradient;
  let currentMode = "frequency-bars"; // Default visualization mode

  // Initialize the audio context
  const initAudioContext = () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyzerNode = audioContext.createAnalyser();
    analyzerNode.fftSize = 256; // Adjust the FFT size as needed
  };

  // Load and play the selected audio file
  const loadAudioFile = (audioPath) => {
    fetch(audioPath)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        audioContext.decodeAudioData(arrayBuffer, (buffer) => {
          // Stop the currently playing audio (if any)
          stopAudio();

          // Create a new audio source and connect it to the analyzer node
          audioSource = audioContext.createBufferSource();
          audioSource.buffer = buffer;
          audioSource.connect(analyzerNode);
          analyzerNode.connect(audioContext.destination);

          // Start playing the audio
          audioSource.start();

          // Update the visualization
          visualizeAudio();

          // Update audio information
          updateAudioInfo();
        });
      })
      .catch((error) => {
        console.log("Error loading audio file:", error);
      });
  };

  // Event listener for audio list buttons
  for (let i = 0; i < audioListButtons.length; i++) {
    audioListButtons[i].addEventListener("click", function () {
      const audioPath = this.getAttribute("data-audio-path");
      loadAudioFile(audioPath);
    });
  }

  // Stop the currently playing audio
  const stopAudio = () => {
    if (audioSource) {
      audioSource.stop();
      audioSource.disconnect();
    }
  };

  // Visualize the audio data
  const visualizeAudio = () => {
    const bufferLength = analyzerNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Set up the visualization canvas
    visualizationContext = visualizationCanvas.getContext("2d");
    visualizationWidth = visualizationCanvas.width;
    visualizationHeight = visualizationCanvas.height;
    gradient = visualizationContext.createLinearGradient(
      0,
      0,
      0,
      visualizationHeight
    );
    gradient.addColorStop(0, "#ff0000");
    gradient.addColorStop(0.5, "#00ff00");
    gradient.addColorStop(1, "#0000ff");

    const drawWaveform = () => {
      requestAnimationFrame(drawWaveform);
      analyzerNode.getByteTimeDomainData(dataArray);

      visualizationContext.fillStyle = "#000";
      visualizationContext.fillRect(
        0,
        0,
        visualizationWidth,
        visualizationHeight
      );
      visualizationContext.lineWidth = 2;
      visualizationContext.strokeStyle = "#fff";
      visualizationContext.beginPath();

      const sliceWidth = visualizationWidth / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * visualizationHeight) / 2;

        if (i === 0) {
          visualizationContext.moveTo(x, y);
        } else {
          visualizationContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      visualizationContext.lineTo(visualizationWidth, visualizationHeight / 2);
      visualizationContext.stroke();
    };

    const drawSpectrogram = () => {
      requestAnimationFrame(drawSpectrogram);
      analyzerNode.getByteFrequencyData(dataArray);

      visualizationContext.clearRect(
        0,
        0,
        visualizationWidth,
        visualizationHeight
      );

      const barWidth = (visualizationWidth / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * visualizationHeight;

        visualizationContext.fillStyle = `hsl(${
          (i / bufferLength) * 360
        }, 100%, 50%)`;
        visualizationContext.fillRect(
          x,
          visualizationHeight - barHeight,
          barWidth,
          barHeight
        );

        x += barWidth + 1;
      }
    };

    const drawFrequencyBars = () => {
      requestAnimationFrame(drawFrequencyBars);
      analyzerNode.getByteFrequencyData(dataArray);

      visualizationContext.clearRect(
        0,
        0,
        visualizationWidth,
        visualizationHeight
      );

      const barWidth = (visualizationWidth / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * visualizationHeight;

        visualizationContext.fillStyle = gradient;
        visualizationContext.fillRect(
          x,
          visualizationHeight - barHeight,
          barWidth,
          barHeight
        );

        x += barWidth + 1;
      }
    };

    const draw3DVisualization = () => {
      // Implementation for 3D visualization goes here
    };

    const drawFrame = () => {
      switch (currentMode) {
        case "waveform":
          drawWaveform();
          break;
        case "spectrogram":
          drawSpectrogram();
          break;
        case "frequency-bars":
          drawFrequencyBars();
          break;
        case "3d-visualization":
          draw3DVisualization();
          break;
        default:
          drawWaveform();
          break;
      }
    };

    drawFrame();
  };

  // Update the audio information
  const updateAudioInfo = () => {
    const sampleRate = audioSource.buffer.sampleRate;
    const duration = audioSource.buffer.duration.toFixed(2);

    sampleRateElement.textContent = sampleRate;
    durationElement.textContent = duration;
  };

  // Switch the visualization mode
  const switchVisualizationMode = (mode) => {
    currentMode = mode;
    visualizeAudio();
  };

  // Event listeners for play and stop buttons
  playButton.addEventListener("click", () => {
    const file = audioFileInput.files[0];
    if (file) {
      const audioPath = URL.createObjectURL(file);
      loadAudioFile(audioPath);
    }
  });

  stopButton.addEventListener("click", stopAudio);

  // Event listeners to the mode buttons
  const modeButtons = document.querySelectorAll(".mode-button");
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-mode");
      switchVisualizationMode(mode);
    });
  });

  // Get the visualization canvas size
  visualizationWidth = visualizationCanvas.clientWidth;
  visualizationHeight = visualizationCanvas.clientHeight;

  // Set the visualization canvas size
  visualizationCanvas.width = visualizationWidth;
  visualizationCanvas.height = visualizationHeight;

  // Initialize the audio context
  initAudioContext();
});
