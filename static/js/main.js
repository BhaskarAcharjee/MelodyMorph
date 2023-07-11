document.addEventListener("DOMContentLoaded", () => {
  const audioFileInput = document.getElementById("audioFile");
  const playButton = document.getElementById("playButton");
  const stopButton = document.getElementById("stopButton");
  const visualizationCanvas = document.getElementById("visualization");
  const audioListButtons = document.getElementsByClassName("audio-item");

  let audioContext;
  let audioSource;
  let analyzerNode;
  let visualizationContext;
  let visualizationWidth;
  let visualizationHeight;
  let gradient;

  // Initialize the audio context
  const initAudioContext = () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyzerNode = audioContext.createAnalyser();
    analyzerNode.fftSize = 256; // Adjust the FFT size as needed
  };

  // Load and play the selected audio file
  const loadAudioFile = (audioPath) => {
    if (audioSource) {
      audioSource.stop();
      audioSource.disconnect();
    }

    const request = new XMLHttpRequest();
    request.open("GET", audioPath, true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      audioContext.decodeAudioData(request.response, (buffer) => {
        // Create a new audio source and connect it to the analyzer node
        audioSource = audioContext.createBufferSource();
        audioSource.buffer = buffer;
        audioSource.connect(analyzerNode);
        analyzerNode.connect(audioContext.destination);

        // Start playing the audio
        audioSource.start();

        // Update the sample rate and duration values
        const sr = audioContext.sampleRate;
        const duration = buffer.duration.toFixed(2);
        document.getElementById("sampleRate").textContent = sr;
        document.getElementById("duration").textContent = duration;

        visualizeAudio();
      });
    };

    request.send();
  };

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

    const drawFrame = () => {
      requestAnimationFrame(drawFrame);
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

    drawFrame();
  };

  // Event listener for audio list buttons
  for (let i = 0; i < audioListButtons.length; i++) {
    audioListButtons[i].addEventListener("click", function () {
      const audioPath = this.getAttribute("data-audio-path");
      loadAudioFile(audioPath);
    });
  }

  // Event listeners for buttons
  playButton.addEventListener("click", () => {
    const file = audioFileInput.files[0];
    if (file) {
      const audioPath = URL.createObjectURL(file);
      loadAudioFile(audioPath);
    }
  });

  stopButton.addEventListener("click", stopAudio);

  // Initialize the audio context
  initAudioContext();
});
