document.addEventListener('DOMContentLoaded', () => {
    const audioFileInput = document.getElementById('audioFile');
    const playButton = document.getElementById('playButton');
    const stopButton = document.getElementById('stopButton');
    const visualizationCanvas = document.getElementById('visualization');
  
    let audioContext;
    let audioSource;
    let analyzerNode;
    let visualizationContext;
    let visualizationWidth;
    let visualizationHeight;
  
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
          // Create a new audio source and connect it to the analyzer node
          audioSource = audioContext.createBufferSource();
          audioSource.buffer = buffer;
          audioSource.connect(analyzerNode);
          analyzerNode.connect(audioContext.destination);
  
          // Start playing the audio
          audioSource.start();
          visualizeAudio();
        });
      };
  
      reader.readAsArrayBuffer(file);
    };
  
    // Stop the currently playing audio
    const stopAudio = () => {
      if (audioSource) {
        audioSource.stop();
      }
    };
  
    // Visualize the audio data
    const visualizeAudio = () => {
      const bufferLength = analyzerNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
  
      // Set up the visualization canvas
      visualizationContext = visualizationCanvas.getContext('2d');
      visualizationWidth = visualizationCanvas.width;
      visualizationHeight = visualizationCanvas.height;
  
      const drawFrame = () => {
        requestAnimationFrame(drawFrame);
        analyzerNode.getByteFrequencyData(dataArray);
  
        visualizationContext.clearRect(0, 0, visualizationWidth, visualizationHeight);
        visualizationContext.fillStyle = '#ff0000'; // Adjust the visualization color as needed
  
        const barWidth = visualizationWidth / bufferLength;
        let x = 0;
  
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * visualizationHeight;
  
          visualizationContext.fillRect(x, visualizationHeight - barHeight, barWidth, barHeight);
  
          x += barWidth + 1;
        }
      };
  
      drawFrame();
    };
  
    // Event listeners for buttons
    playButton.addEventListener('click', loadAudioFile);
    stopButton.addEventListener('click', stopAudio);
  
    // Initialize the audio context
    initAudioContext();
  });  