(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% audioVisualizer.js %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const visualizationCanvas = document.getElementById("visualization");
const visualization3DCanvas = document.getElementById("visualization3D");

// Get the visualization canvas size
visualizationWidth = visualizationCanvas.clientWidth;
visualizationHeight = visualizationCanvas.clientHeight;

// Set the visualization canvas size
visualizationCanvas.width = visualizationWidth;
visualizationCanvas.height = visualizationHeight;

// ------------------ 3D Visualization ---------------------

// Define variables for 3D visualization
let renderer;
let scene;
let camera;
let mesh;
let geometry;
let material;
let rotationSpeed = 0.001;
let is3DVisualizationActive = false; // Variable to track if 3D visualization is active

// Get the 3D visualization canvas and set its size
visualization3DCanvas.width = visualizationWidth;
visualization3DCanvas.height = visualizationHeight;

// Initialize the three.js renderer, scene, and camera
renderer = new THREE.WebGLRenderer({ canvas: visualization3DCanvas });
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
  75,
  visualizationWidth / visualizationHeight,
  0.1,
  1000
);
camera.position.z = 10;

// Create a basic mesh for the 3D visualization
geometry = new THREE.BoxGeometry(5, 5, 5);
material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Function to stop the 3D visualization
const stop3DVisualization = () => {
  is3DVisualizationActive = false;
  // clear3DVisualizationCanvas();
};

// Function to clear the 3D visualization canvas
const clear3DVisualizationCanvas = () => {
  is3DVisualizationActive = false;
  renderer.clear();
};

// ================================= Visualize Audio =================================

// Visualize the audio data
const visualizeAudio = (analyzerNode, visualizationCanvas, currentMode) => {
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

  // ------------------------------ Waveform ------------------------------

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

  // ------------------------------ Spectrogram ------------------------------

  const drawSpectrogram = () => {
    requestAnimationFrame(drawSpectrogram);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.clearRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const barWidth = visualizationWidth / bufferLength;
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

      x += barWidth;
    }
  };

  // ------------------------------ Frequency Bars ------------------------------

  const drawFrequencyBars = () => {
    requestAnimationFrame(drawFrequencyBars);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.clearRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const barWidth = visualizationWidth / bufferLength;
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

      x += barWidth;
    }
  };

  // ------------------------------ Circle Visualization ------------------------------

  // const drawCircularVisualization = () => {
  //   requestAnimationFrame(drawCircularVisualization);
  //   analyzerNode.getByteFrequencyData(dataArray);

  //   visualizationContext.fillStyle = "#000";
  //   visualizationContext.fillRect(0, 0, visualizationWidth, visualizationHeight);

  //   const centerX = visualizationWidth / 2;
  //   const centerY = visualizationHeight / 2;
  //   const radius = Math.min(centerX, centerY);

  //   for (let i = 0; i < bufferLength; i++) {
  //     const angle = (i / bufferLength) * 2 * Math.PI;
  //     const amplitude = dataArray[i] / 255;

  //     const x = centerX + Math.cos(angle) * radius * amplitude;
  //     const y = centerY + Math.sin(angle) * radius * amplitude;
  //     const circleRadius = 2;

  //     visualizationContext.beginPath();
  //     visualizationContext.arc(x, y, circleRadius, 0, 2 * Math.PI);
  //     visualizationContext.fillStyle = `rgba(255, 255, 255, ${amplitude})`;
  //     visualizationContext.fill();
  //     visualizationContext.closePath();
  //   }
  // };

  const drawCircularVisualization = () => {
    requestAnimationFrame(drawCircularVisualization);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.clearRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const numCircles = bufferLength; // Number of circles
    const circleSpacing = 2; // Spacing between circles

    for (let i = 0; i < numCircles; i++) {
      const amplitude = (dataArray[i] / 255) * 100; // Scale the amplitude to adjust the circle size

      const centerX = visualizationWidth / 2;
      const centerY = visualizationHeight / 2;

      const circleRadius = i * circleSpacing + amplitude;

      visualizationContext.beginPath();
      visualizationContext.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
      visualizationContext.strokeStyle = `hsl(${
        (i / numCircles) * 360
      }, 100%, 50%)`;
      visualizationContext.lineWidth = 2;
      visualizationContext.stroke();
    }
  };

  // ------------------------------ Time Frequency Heatmap ------------------------------

  const drawTimeFrequencyHeatmap = () => {
    requestAnimationFrame(drawTimeFrequencyHeatmap);
    analyzerNode.getByteFrequencyData(dataArray);

    // Clear the visualization canvas
    visualizationContext.clearRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    // Calculate the number of time bins (horizontal resolution)
    const numTimeBins = dataArray.length;
    const timeBinWidth = visualizationWidth / numTimeBins;

    // Calculate the number of frequency bins (vertical resolution)
    const numFrequencyBins = bufferLength;
    const frequencyBinHeight = visualizationHeight / numFrequencyBins;

    // Define custom color map representing emotions or moods
    const heatmapGradient = {
      0.0: "hsl(240, 100%, 50%)", // Blue for low amplitude
      0.25: "hsl(180, 100%, 50%)", // Green
      0.5: "hsl(120, 100%, 50%)", // Yellow
      0.75: "hsl(60, 100%, 50%)", // Orange
      1.0: "hsl(0, 100%, 50%)", // Red for high amplitude
    };

    for (let i = 0; i < numTimeBins; i++) {
      for (let j = 0; j < numFrequencyBins; j++) {
        const value = dataArray[j] / 255; // Normalize the value to [0, 1]
        const x = i * timeBinWidth;
        const y = (numFrequencyBins - j - 1) * frequencyBinHeight;

        // Find the appropriate color for the value using the custom color map
        let color;
        for (const stop in heatmapGradient) {
          if (value <= stop) {
            color = heatmapGradient[stop];
            break;
          }
        }

        // Set the color of the heatmap cell
        visualizationContext.fillStyle = color;
        visualizationContext.fillRect(x, y, timeBinWidth, frequencyBinHeight);
      }
    }
  };

  // ------------------------------ Audio Reactive Shapes ------------------------------

  const drawAudioReactiveShapes = () => {
    requestAnimationFrame(drawAudioReactiveShapes);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.clearRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const numShapes = bufferLength;
    const maxShapeSize = Math.min(centerX, centerY);

    for (let i = 0; i < numShapes; i++) {
      const amplitude = (dataArray[i] / 255) * maxShapeSize; // Scale the amplitude to adjust the shape size

      const x = centerX + Math.cos((i / numShapes) * 2 * Math.PI) * amplitude;
      const y = centerY + Math.sin((i / numShapes) * 2 * Math.PI) * amplitude;

      const shapeSize = amplitude / 2;

      visualizationContext.beginPath();
      visualizationContext.arc(x, y, shapeSize, 0, 2 * Math.PI);
      visualizationContext.fillStyle = `hsl(${
        (i / numShapes) * 360
      }, 100%, 50%)`;
      visualizationContext.fill();
      visualizationContext.closePath();
    }
  };

  // ------------------------------ Fractals ------------------------------

  const drawFractals = () => {
    requestAnimationFrame(drawFractals);
    analyzerNode.getByteTimeDomainData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const radius = Math.min(centerX, centerY);

    for (let i = 0; i < bufferLength; i++) {
      const angle = (i / bufferLength) * 2 * Math.PI;
      const amplitude = dataArray[i] / 128.0;

      const x = centerX + Math.cos(angle) * radius * amplitude;
      const y = centerY + Math.sin(angle) * radius * amplitude;
      const fractalSize = amplitude * 10;

      visualizationContext.beginPath();
      visualizationContext.arc(x, y, fractalSize, 0, 2 * Math.PI);
      visualizationContext.strokeStyle = `rgba(255, 255, 255, ${amplitude})`;
      visualizationContext.lineWidth = 2;
      visualizationContext.stroke();
      visualizationContext.closePath();
    }
  };

  // ------------------------------ Spectrum Waterfall ------------------------------

  const drawSpectrumWaterfall = () => {
    requestAnimationFrame(drawSpectrumWaterfall);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const columnWidth = visualizationWidth / bufferLength;
    const columnSpacing = 2;

    for (let i = 0; i < bufferLength; i++) {
      const amplitude = (dataArray[i] / 255) * visualizationHeight;

      const x = i * (columnWidth + columnSpacing);
      const y = visualizationHeight - amplitude;

      visualizationContext.fillStyle = `hsl(${
        (i / bufferLength) * 360
      }, 100%, 50%)`;
      visualizationContext.fillRect(x, y, columnWidth, amplitude);
    }
  };

  // ------------------------------ Particle System ------------------------------

  const drawParticleSystem = () => {
    requestAnimationFrame(drawParticleSystem);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.clearRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const numParticles = bufferLength;

    const gradient = visualizationContext.createLinearGradient(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );
    gradient.addColorStop(0, "#ff0000"); // Start color (red)
    gradient.addColorStop(1, "#0000ff"); // End color (blue)

    for (let i = 0; i < numParticles; i++) {
      const amplitude = (dataArray[i] / 255) * 100; // Scale the amplitude to adjust the particle size

      const x =
        centerX + Math.cos((i / numParticles) * 2 * Math.PI) * amplitude;
      const y =
        centerY + Math.sin((i / numParticles) * 2 * Math.PI) * amplitude;

      const particleSize = amplitude / 2;

      visualizationContext.beginPath();
      visualizationContext.arc(x, y, particleSize, 0, 2 * Math.PI);

      // Set the particle color based on its position in the canvas
      visualizationContext.fillStyle = gradient;
      visualizationContext.fill();
      visualizationContext.closePath();
    }
  };

  // ------------------------------ Frequency Rings ------------------------------

  const drawFrequencyRings = () => {
    requestAnimationFrame(drawFrequencyRings);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.clearRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const numRings = 6; // You can adjust the number of rings here

    const frequenciesPerRing = Math.floor(bufferLength / numRings);

    for (let i = 0; i < numRings; i++) {
      // Calculate the average amplitude of the audio data in this frequency range
      let sum = 0;
      for (
        let j = i * frequenciesPerRing;
        j < (i + 1) * frequenciesPerRing;
        j++
      ) {
        sum += dataArray[j];
      }
      const averageAmplitude = sum / frequenciesPerRing;

      const ringRadius = ((averageAmplitude / 255) * visualizationHeight) / 2;
      const startAngle = (i / numRings) * 2 * Math.PI;
      const endAngle = ((i + 1) / numRings) * 2 * Math.PI;
      const lineWidth = (visualizationHeight / numRings) * 0.4;

      visualizationContext.beginPath();
      visualizationContext.arc(
        centerX,
        centerY,
        ringRadius,
        startAngle,
        endAngle
      );
      visualizationContext.strokeStyle = `hsl(${
        (i / numRings) * 360
      }, 100%, 50%)`;
      visualizationContext.lineWidth = lineWidth;
      visualizationContext.stroke();
      visualizationContext.closePath();
    }
  };

  // ------------------------------ 3D Visualization ------------------------------

  // Render the 3D visualization
  const render3DVisualization = () => {
    if (!is3DVisualizationActive) return; // Stop rendering if 3D visualization is not active
    requestAnimationFrame(render3DVisualization);
    mesh.rotation.x += rotationSpeed;
    mesh.rotation.y += rotationSpeed;
    renderer.render(scene, camera);
  };

  // ------------------------------ Drawframe ------------------------------

  const drawFrame = () => {
    switch (currentMode) {
      case "waveform":
        drawWaveform();
        is3DVisualizationActive = false;
        break;
      case "spectrogram":
        drawSpectrogram();
        is3DVisualizationActive = false;
        break;
      case "frequency-bars":
        drawFrequencyBars();
        is3DVisualizationActive = false;
        break;
      case "circular-visualization":
        drawCircularVisualization();
        is3DVisualizationActive = false;
        break;
      case "time-frequency-heatmap":
        drawTimeFrequencyHeatmap();
        is3DVisualizationActive = false;
        break;
      case "audio-reactive-shapes":
        drawAudioReactiveShapes();
        is3DVisualizationActive = false;
        break;
      case "fractals":
        drawFractals();
        is3DVisualizationActive = false;
        break;
      case "spectrum-waterfall":
        drawSpectrumWaterfall();
        is3DVisualizationActive = false;
        break;
      case "particle-system":
        drawParticleSystem();
        is3DVisualizationActive = false;
        break;
      case "frequency-rings":
        drawFrequencyRings();
        is3DVisualizationActive = false;
        break;
      case "3d-visualization":
        is3DVisualizationActive = true;
        render3DVisualization();
        break;
      default:
        drawWaveform();
        is3DVisualizationActive = false;
        break;
    }
  };

  drawFrame();
};

// -------------------------------- End ----------------------------------

module.exports = {
  visualizeAudio,
  stop3DVisualization,
  clear3DVisualizationCanvas,
};

},{}],2:[function(require,module,exports){
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% main.js %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const {
  visualizeAudio,
  stop3DVisualization,
  clear3DVisualizationCanvas,
} = require("./audioVisualizer");

document.addEventListener("DOMContentLoaded", () => {
  const audioFileInput = document.getElementById("audioFile");
  const playButton = document.getElementById("playButton");
  const pauseButton = document.getElementById("pauseButton");
  const stopButton = document.getElementById("stopButton");
  const visualizationCanvas = document.getElementById("visualization");
  const visualization3DCanvas = document.getElementById("visualization3D");
  const durationElement = document.getElementById("duration");
  const sampleRateElement = document.getElementById("sampleRate");
  const bitRateElement = document.getElementById("bitRate");
  const fileSizeElement = document.getElementById("fileSize");
  const audioListButtons = document.getElementsByClassName("audio-item");
  const tabItems = document.querySelectorAll(".tab-item");
  const audioLists = document.querySelectorAll(".audio-list");
  const speedSlider = document.getElementById("speedSlider");
  const volumeSlider = document.getElementById("volumeSlider");
  const presetSelect = document.getElementById("preset-select");
  const eqSliders = document.querySelectorAll(".eq-slider input[type='range']");

  let audioContext;
  let audioSource;
  let analyzerNode;
  let visualizationContext;
  let visualizationWidth;
  let visualizationHeight;
  let gradient;
  let currentMode = "frequency-bars"; // Default visualization mode
  let isPaused = false;

  // Get the visualization canvas size
  visualizationWidth = visualizationCanvas.clientWidth;
  visualizationHeight = visualizationCanvas.clientHeight;

  // Set the visualization canvas size
  visualizationCanvas.width = visualizationWidth;
  visualizationCanvas.height = visualizationHeight;

  // -------------------------------- Initialization & Load Audio ----------------------------------

  // Initialize the audio context
  const initAudioContext = () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyzerNode = audioContext.createAnalyser();
    analyzerNode.fftSize = 2048; // Higher FFT size for more frequency bands
  };

  // Load and play the selected audio file
  const loadAudioFile = (audioPath) => {
    fetch(audioPath)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        audioContext.decodeAudioData(arrayBuffer, (buffer) => {
          // Stop the currently playing audio (if any)
          stopAudio();

          // Clear the 3D visualization canvas
          clear3DVisualizationCanvas();

          // Create a new audio source, gain node, and connect them to the analyzer node
          audioSource = audioContext.createBufferSource();
          audioSource.buffer = buffer;
          audioSource.gainNode = audioContext.createGain();
          audioSource.connect(audioSource.gainNode);
          audioSource.gainNode.connect(analyzerNode);
          analyzerNode.connect(audioContext.destination);

          // Resume the audio context
          audioContext.resume().then(() => {
            // Start playing the audio
            audioSource.start();

            // Update the visualization
            visualizeAudio(analyzerNode, visualizationCanvas, currentMode);

            // Update audio information
            updateAudioInfo();

            // Set the initial volume
            updateVolume();

            // Apply equalizer effects
            applyEqualizerFilters();
          });
        });
      })
      .catch((error) => {
        console.log("Error loading audio file:", error);
      });
  };

  // -------------------------------- Visualization ----------------------------------

  // Switch the visualization mode
  const switchVisualizationMode = (mode) => {
    currentMode = mode;
    visualizeAudio(analyzerNode, visualizationCanvas, currentMode);

    // Check if 3D visualization mode is selected
    if (mode === "3d-visualization") {
      // Show the 3D visualization canvas
      visualizationCanvas.style.display = "none";
      visualization3DCanvas.style.display = "block";
    } else {
      // Show the main visualization canvas and hide the 3D visualization canvas
      visualizationCanvas.style.display = "block";
      visualization3DCanvas.style.display = "none";
    }
  };

  // Event listeners to the mode buttons
  const modeButtons = document.querySelectorAll(".mode-button");
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-mode");
      switchVisualizationMode(mode);
    });
  });

  // -------------------------------- Equalizer ----------------------------------

  // Apply equalizer filters
  const applyEqualizerFilters = () => {
    eqSliders.forEach((slider) => {
      const frequency = parseFloat(slider.getAttribute("data-frequency"));
      const gain = parseFloat(slider.value);

      // Check if the frequency and gain values are valid
      if (Number.isFinite(frequency) && Number.isFinite(gain)) {
        const filterNode = audioContext.createBiquadFilter();
        filterNode.type = "peaking";
        filterNode.frequency.value = frequency;
        filterNode.gain.value = gain;
        filterNode.Q.value = 10; // Higher Q-factor for a more noticeable effect

        // Disconnect the previous filter node (if any) and connect the new filter node
        if (audioSource.gainNode.numberOfOutputs > 0) {
          audioSource.gainNode.disconnect();
        }
        audioSource.gainNode.connect(filterNode);

        // Connect the filter node to the analyzer node
        filterNode.connect(analyzerNode);
      }
    });
  };

  // Apply equalizer presets
  const applyEqualizerPresets = () => {
    const preset = presetSelect.value;

    // Define the preset values
    const presets = {
      normal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      pop: [3, 2, 1, 0, 0, -1, -2, -2, -3, -3],
      classic: [-3, -2, -1, 0, 0, 0, 0, -1, -2, -3],
      rock: [4, 3, 1, 0, -1, -1, -2, -2, -3, -4],
      jazz: [3, 4, 4, 3, 1, 0, -1, -2, -3, -3],
    };

    // Check if audioSource is defined and apply the equalizer filters
    if (audioSource) {
      eqSliders.forEach((slider, index) => {
        slider.value = presets[preset][index];

        // Trigger the 'input' event to update the equalizer filters
        const inputEvent = new Event("input");
        slider.dispatchEvent(inputEvent);
      });

      applyEqualizerFilters();
    }
  };

  // Apply equalizer presets
  applyEqualizerPresets();

  // Event listener for equalizer preset select
  presetSelect.addEventListener("change", applyEqualizerPresets);

  // Event listeners for equalizer sliders
  eqSliders.forEach((slider) => {
    slider.addEventListener("input", () => {
      applyEqualizerFilters();
    });
  });

  // -------------------------------- Audio information ----------------------------------

  // Update Audio information
  const updateAudioInfo = () => {
    const sampleRate = audioSource.buffer.sampleRate + " kbps";
    const duration = audioSource.buffer.duration.toFixed(2) + " seconds";
    const bitRate = calculateBitRate();
    const fileSize = calculateFileSize();

    sampleRateElement.textContent = sampleRate;
    durationElement.textContent = duration;
    bitRateElement.textContent = bitRate;
    fileSizeElement.textContent = fileSize;
  };

  // function to calculate the bit rate
  const calculateBitRate = () => {
    const audioBuffer = audioSource.buffer;
    const bitRate = (audioBuffer.length * 8) / audioBuffer.duration / 1000; // Calculate the bit rate in kilobits per second
    return bitRate.toFixed(2) + " kbps";
  };

  // function to calculate the file size
  const calculateFileSize = () => {
    const audioBuffer = audioSource.buffer;
    const fileSize = audioBuffer.length * audioBuffer.numberOfChannels * 2; // Calculate the file size in bytes
    return formatFileSize(fileSize);
  };

  // Helper function to format file size in human-readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + " B";
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1073741824) {
      return (bytes / 1048576).toFixed(2) + " MB";
    } else {
      return (bytes / 1073741824).toFixed(2) + " GB";
    }
  };

  // -------------------------------- Media Control ----------------------------------

  // Stop the currently playing audio
  const stopAudio = () => {
    if (audioSource) {
      audioSource.stop();
      audioSource.disconnect();
    }
  };

  // Event listeners for play, pause, and stop buttons
  playButton.addEventListener("click", () => {
    const file = audioFileInput.files[0];
    if (file) {
      const audioPath = URL.createObjectURL(file);
      loadAudioFile(audioPath);
      updatePlaybackSpeed(); // Update the playback speed when starting playback
    }
  });

  pauseButton.addEventListener("click", () => {
    if (!isPaused) {
      // Pause the audio
      audioContext.suspend();
      isPaused = true;
      if (currentMode === "3d-visualization") {
        stop3DVisualization(); // Stop the 3D visualization when pausing
      }
    } else {
      // Resume the audio
      audioContext.resume().then(() => {
        isPaused = false;
        if (currentMode === "3d-visualization") {
          visualizeAudio(analyzerNode, visualizationCanvas, currentMode); // Resume the 3D visualization when resuming audio
        }
      });
    }
  });

  stopButton.addEventListener("click", () => {
    stopAudio();
    updatePlaybackSpeed(); // Update the playback speed when stopping playback
    if (currentMode === "3d-visualization") {
      clear3DVisualizationCanvas(); // Stop the 3D visualization when stopping
    }
  });

  // Update the volume
  const updateVolume = () => {
    if (audioSource) {
      const volume = parseFloat(volumeSlider.value);
      audioSource.gainNode.gain.value = volume;
    }
  };

  // Event listener for volume slider
  volumeSlider.addEventListener("input", updateVolume);

  // Update Playback Speed
  const updatePlaybackSpeed = () => {
    if (audioSource) {
      const speed = parseFloat(speedSlider.value);
      audioSource.playbackRate.setValueAtTime(speed, audioContext.currentTime);
    }
  };

  // Event listeners to playback speed slider
  speedSlider.addEventListener("input", updatePlaybackSpeed);

  // -------------------------------- Audio Libraries ----------------------------------

  // Event listeners for category tab items
  tabItems.forEach((tabItem) => {
    tabItem.addEventListener("click", () => {
      // Remove "active" class from all tab items
      tabItems.forEach((item) => {
        item.classList.remove("active");
      });

      // Add "active" class to the clicked tab item
      tabItem.classList.add("active");

      // Get the category associated with the clicked tab item
      const category = tabItem.getAttribute("data-category");

      // Show the corresponding audio list based on the category
      showAudioList(category);
    });
  });

  // Function to show the audio list based on the category
  const showAudioList = (category) => {
    // Hide all audio lists
    audioLists.forEach((audioList) => {
      audioList.style.display = "none";
    });

    // Show the audio list associated with the category
    const audioList = document.getElementById(`${category}Audios`);
    if (audioList) {
      audioList.style.display = "block";
    }
  };

  // Show the initial audio list (default category: songs)
  showAudioList("songs");

  // Event listener for audio list buttons
  for (let i = 0; i < audioListButtons.length; i++) {
    audioListButtons[i].addEventListener("click", function () {
      const audioPath = this.getAttribute("data-audio-path");
      loadAudioFile(audioPath);
    });
  }

  // -------------------------------- End ----------------------------------

  // Initialize the audio context
  initAudioContext();
});

},{"./audioVisualizer":1}]},{},[2]);
