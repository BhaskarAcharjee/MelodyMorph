document.addEventListener("DOMContentLoaded", () => {
  const audioFileInput = document.getElementById("audioFile");
  const playButton = document.getElementById("playButton");
  const pauseButton = document.getElementById("pauseButton");
  const stopButton = document.getElementById("stopButton");
  const visualizationCanvas = document.getElementById("visualization");
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
            visualizeAudio();

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

    const draw3DVisualization = () => {
      // // Set up the scene, camera, and renderer
      // const scene = new THREE.Scene();
      // const camera = new THREE.PerspectiveCamera(
      //   75,
      //   visualizationCanvas.clientWidth / visualizationCanvas.clientHeight,
      //   0.1,
      //   1000
      // );
      // const renderer = new THREE.WebGLRenderer({ antialias: true });
      // renderer.setSize(
      //   visualizationCanvas.clientWidth,
      //   visualizationCanvas.clientHeight
      // );
      // renderer.setClearColor(0x000000, 1);
      // visualizationCanvas.appendChild(renderer.domElement);
      // // Create geometry and material for visualization
      // const geometry = new THREE.BoxGeometry(2, 2, 2);
      // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      // const cube = new THREE.Mesh(geometry, material);
      // scene.add(cube);
      // // Position the camera
      // camera.position.z = 5;
      // // Render the scene
      // const animate = () => {
      //   requestAnimationFrame(animate);
      //   cube.rotation.x += 0.01;
      //   cube.rotation.y += 0.01;
      //   renderer.render(scene, camera);
      // };
      // animate();
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

  // Switch the visualization mode
  const switchVisualizationMode = (mode) => {
    currentMode = mode;
    visualizeAudio();
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
      rock: [4, 3, 1, 0, -1, -1, -2, -2, -3, -4],
      jazz: [3, 4, 4, 3, 1, 0, -1, -2, -3, -3],
      classic: [-3, -2, -1, 0, 0, 0, 0, -1, -2, -3],
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
    const sampleRate = audioSource.buffer.sampleRate + "kbps";
    const duration = audioSource.buffer.duration.toFixed(2) + "seconds";
    const bitRate = calculateBitRate();
    const fileSize = calculateFileSize();

    sampleRateElement.textContent = sampleRate;
    durationElement.textContent = duration;
    bitRateElement.textContent = bitRate;
    fileSizeElement.textContent = fileSize;
  };

  // function to calculate the bit rate
  const calculateBitRate = () => {
    return "256 kbps"; // Example value
  };

  // function to calculate the file size
  const calculateFileSize = () => {
    return "5.2 MB"; // Example value
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
    } else {
      // Resume the audio
      audioContext.resume().then(() => {
        isPaused = false;
      });
    }
  });

  stopButton.addEventListener("click", () => {
    stopAudio();
    updatePlaybackSpeed(); // Update the playback speed when stopping playback
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
