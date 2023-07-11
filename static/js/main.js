document.addEventListener("DOMContentLoaded", () => {
  const audioFileInput = document.getElementById("audioFile");
  const playButton = document.getElementById("playButton");
  const stopButton = document.getElementById("stopButton");
  const visualizationCanvas = document.getElementById("visualization");

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
  const loadAudioFile = () => {
    const file = audioFileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      audioContext.decodeAudioData(reader.result, (buffer) => {
        // Stop the currently playing audio (if any)
        stopAudio();

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

    reader.readAsArrayBuffer(file);
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

  // Event listeners for buttons
  playButton.addEventListener("click", loadAudioFile);
  stopButton.addEventListener("click", stopAudio);

  // Initialize the audio context
  initAudioContext();
});
