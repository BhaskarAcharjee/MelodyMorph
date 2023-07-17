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

  // ------------------------------ Kaleidoscope ------------------------------

  const drawKaleidoscope = () => {
    requestAnimationFrame(drawKaleidoscope);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
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
      const amplitude = (dataArray[i] / 255) * maxShapeSize;

      for (let j = 0; j < 6; j++) {
        const angle = (j / 6) * 2 * Math.PI;
        const x =
          centerX + Math.cos(angle + (i / numShapes) * 2 * Math.PI) * amplitude;
        const y =
          centerY + Math.sin(angle + (i / numShapes) * 2 * Math.PI) * amplitude;
        const shapeSize = amplitude / 4;

        visualizationContext.beginPath();
        visualizationContext.arc(x, y, shapeSize, 0, 2 * Math.PI);
        visualizationContext.fillStyle = `hsl(${
          (i / numShapes) * 360
        }, 100%, 50%)`;
        visualizationContext.fill();
        visualizationContext.closePath();
      }
    }
  };

  // ------------------------------ Glitch Art ------------------------------

  const drawGlitchArt = () => {
    requestAnimationFrame(drawGlitchArt);
    analyzerNode.getByteFrequencyData(dataArray);

    const imageData = visualizationContext.getImageData(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = r ^ dataArray[i % bufferLength];
      data[i + 1] = g ^ dataArray[i % bufferLength];
      data[i + 2] = b ^ dataArray[i % bufferLength];
    }

    visualizationContext.putImageData(imageData, 0, 0);
  };

  // ------------------------------ Motion Trails ------------------------------

  const drawMotionTrails = () => {
    requestAnimationFrame(drawMotionTrails);
    analyzerNode.getByteTimeDomainData(dataArray);

    visualizationContext.fillStyle = "rgba(0, 0, 0, 0.1)";
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

  // ------------------------------ VUMeter ------------------------------

  const drawVUMeter = () => {
    requestAnimationFrame(drawVUMeter);
    analyzerNode.getByteTimeDomainData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const barWidth = visualizationWidth / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * visualizationHeight) / 2;

      visualizationContext.fillStyle = `rgba(255, 255, 255, ${v})`;
      visualizationContext.fillRect(x, visualizationHeight - y, barWidth, y);

      x += barWidth;
    }
  };

  // ------------------------------ Neon Glow ------------------------------

  const drawNeonGlow = () => {
    requestAnimationFrame(drawNeonGlow);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const numCircles = bufferLength;
    const maxCircleSize = Math.min(centerX, centerY);

    for (let i = 0; i < numCircles; i++) {
      const amplitude = (dataArray[i] / 255) * maxCircleSize;

      const x = centerX + Math.cos((i / numCircles) * 2 * Math.PI) * amplitude;
      const y = centerY + Math.sin((i / numCircles) * 2 * Math.PI) * amplitude;

      const circleSize = amplitude / 2;

      visualizationContext.beginPath();
      visualizationContext.arc(x, y, circleSize, 0, 2 * Math.PI);

      const gradient = visualizationContext.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        circleSize
      );
      gradient.addColorStop(0, "#fff");
      gradient.addColorStop(1, `hsl(${(i / numCircles) * 360}, 100%, 50%)`);
      visualizationContext.fillStyle = gradient;
      visualizationContext.fill();
      visualizationContext.closePath();
    }
  };

  // ------------------------------ Geometric Patterns ------------------------------

  const drawGeometricPatterns = () => {
    requestAnimationFrame(drawGeometricPatterns);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const numShapes = bufferLength;
    const maxShapeSize = Math.min(visualizationWidth, visualizationHeight);

    for (let i = 0; i < numShapes; i++) {
      const amplitude = (dataArray[i] / 255) * maxShapeSize;

      const x =
        visualizationWidth / 2 +
        Math.cos((i / numShapes) * 2 * Math.PI) * amplitude;
      const y =
        visualizationHeight / 2 +
        Math.sin((i / numShapes) * 2 * Math.PI) * amplitude;

      const shapeSize = amplitude / 2;
      const sides = Math.floor((dataArray[i] / 255) * 10) + 3; // Number of sides for the shape

      visualizationContext.beginPath();
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * 2 * Math.PI;
        const xVertex = x + Math.cos(angle) * shapeSize;
        const yVertex = y + Math.sin(angle) * shapeSize;
        if (j === 0) {
          visualizationContext.moveTo(xVertex, yVertex);
        } else {
          visualizationContext.lineTo(xVertex, yVertex);
        }
      }

      visualizationContext.closePath();
      visualizationContext.fillStyle = `hsl(${
        (i / numShapes) * 360
      }, 100%, 50%)`;
      visualizationContext.fill();
    }
  };

  // ------------------------------ Audio Fireworks ------------------------------

  const drawAudioFireworks = () => {
    requestAnimationFrame(drawAudioFireworks);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const numParticles = bufferLength;

    for (let i = 0; i < numParticles; i++) {
      const amplitude = (dataArray[i] / 255) * 100;
      const particleSize = amplitude / 2;
      const x = centerX + (Math.random() - 0.5) * 2 * amplitude;
      const y = centerY + (Math.random() - 0.5) * 2 * amplitude;

      visualizationContext.beginPath();
      visualizationContext.arc(x, y, particleSize, 0, 2 * Math.PI);

      visualizationContext.fillStyle = `hsl(${
        (i / numParticles) * 360
      }, 100%, 50%)`;
      visualizationContext.fill();
      visualizationContext.closePath();
    }
  };

  // ------------------------------ Spectrum Flowers ------------------------------

  const drawSpectrumFlowers = () => {
    requestAnimationFrame(drawSpectrumFlowers);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const numPetals = bufferLength;
    const maxPetalSize = Math.min(centerX, centerY);

    for (let i = 0; i < numPetals; i++) {
      const amplitude = (dataArray[i] / 255) * maxPetalSize;
      const petalSize = amplitude / 2;
      const x = centerX + Math.cos((i / numPetals) * 2 * Math.PI) * amplitude;
      const y = centerY + Math.sin((i / numPetals) * 2 * Math.PI) * amplitude;

      visualizationContext.beginPath();
      for (let j = 0; j < 5; j++) {
        const angle = ((i * j) / numPetals) * 2 * Math.PI;
        const xPetal = x + Math.cos(angle) * petalSize;
        const yPetal = y + Math.sin(angle) * petalSize;
        if (j === 0) {
          visualizationContext.moveTo(xPetal, yPetal);
        } else {
          visualizationContext.lineTo(xPetal, yPetal);
        }
      }
      visualizationContext.closePath();

      visualizationContext.fillStyle = `hsl(${
        (i / numPetals) * 360
      }, 100%, 50%)`;
      visualizationContext.fill();
    }
  };

  // ------------------------------ Pixelation ------------------------------

  const drawPixelation = () => {
    requestAnimationFrame(drawPixelation);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const pixelSize = 5; // Adjust pixel size here

    for (let y = 0; y < visualizationHeight; y += pixelSize) {
      for (let x = 0; x < visualizationWidth; x += pixelSize) {
        const amplitude =
          dataArray[Math.floor((x / visualizationWidth) * bufferLength)];
        const pixelColor = `hsl(${(y / visualizationHeight) * 360}, 100%, ${
          amplitude / 2
        }%)`;

        visualizationContext.fillStyle = pixelColor;
        visualizationContext.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  };

  // ------------------------------ Audio Tornado ------------------------------

  // const drawAudioTornado = () => {
  //   requestAnimationFrame(drawAudioTornado);
  //   analyzerNode.getByteFrequencyData(dataArray);

  //   visualizationContext.clearRect(
  //     0,
  //     0,
  //     visualizationWidth,
  //     visualizationHeight
  //   );

  //   const centerX = visualizationWidth / 2;
  //   const centerY = visualizationHeight / 2;
  //   const numPoints = bufferLength;

  //   for (let i = 0; i < numPoints; i++) {
  //     const amplitude = (dataArray[i] / 255) * 100; // Scale the amplitude to adjust the point size

  //     const x = centerX + Math.cos((i / numPoints) * 6 * Math.PI) * amplitude;
  //     const y = centerY + Math.sin((i / numPoints) * 6 * Math.PI) * amplitude;

  //     const pointSize = amplitude / 2;

  //     visualizationContext.beginPath();
  //     visualizationContext.arc(x, y, pointSize, 0, 2 * Math.PI);
  //     visualizationContext.fillStyle = `hsl(${
  //       (i / numPoints) * 360
  //     }, 100%, 50%)`;
  //     visualizationContext.fill();
  //     visualizationContext.closePath();
  //   }
  // };

  const drawAudioTornado = () => {
    requestAnimationFrame(drawAudioTornado);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const numSpirals = bufferLength;
    const maxSpiralSize = Math.min(centerX, centerY);

    for (let i = 0; i < numSpirals; i++) {
      const amplitude = (dataArray[i] / 255) * maxSpiralSize;
      const numPoints = 100;
      const spiralStep = (2 * Math.PI) / numPoints;
      const startAngle = (i / numSpirals) * 2 * Math.PI;
      const rotationSpeed = 0.001;
      const lineWidth = (dataArray[i] / 255) * 5; // Vary the line width based on audio intensity

      visualizationContext.beginPath();
      for (let j = 0; j < numPoints; j++) {
        const angle = startAngle + j * spiralStep;
        const x = centerX + Math.cos(angle) * amplitude * (j / numPoints);
        const y = centerY + Math.sin(angle) * amplitude * (j / numPoints);

        if (j === 0) {
          visualizationContext.moveTo(x, y);
        } else {
          visualizationContext.lineTo(x, y);
        }
      }

      visualizationContext.strokeStyle = `hsl(${
        (i / numSpirals) * 360
      }, 100%, 50%)`;
      visualizationContext.lineWidth = lineWidth;
      visualizationContext.stroke();
      visualizationContext.closePath();
    }
  };

  // ------------------------------ Audio Rain ------------------------------

  const drawAudioRain = () => {
    requestAnimationFrame(drawAudioRain);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "rgba(0, 0, 0, 0.1)";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const numRaindrops = bufferLength / 4; // Adjust the number of raindrops here

    for (let i = 0; i < numRaindrops; i++) {
      const amplitude = (dataArray[i] / 255) * visualizationHeight;

      const x = Math.random() * visualizationWidth;
      const y = Math.random() * amplitude;

      visualizationContext.beginPath();
      visualizationContext.moveTo(x, y);
      visualizationContext.lineTo(x, y + 5);
      visualizationContext.strokeStyle = `hsl(${
        (i / numRaindrops) * 360
      }, 100%, 50%)`;
      visualizationContext.lineWidth = 2;
      visualizationContext.stroke();
    }
  };

  // ------------------------------ Audio Metronome ------------------------------

  const drawAudioMetronome = () => {
    requestAnimationFrame(drawAudioMetronome);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.clearRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const numTicks = bufferLength / 8; // Adjust the number of ticks here
    const maxTickSize = Math.min(centerX, centerY);

    for (let i = 0; i < numTicks; i++) {
      const amplitude = (dataArray[i] / 255) * maxTickSize;
      const tickSize = amplitude / 2;

      const x =
        centerX +
        Math.cos((i / numTicks) * 2 * Math.PI) * (maxTickSize - tickSize);
      const y =
        centerY +
        Math.sin((i / numTicks) * 2 * Math.PI) * (maxTickSize - tickSize);

      visualizationContext.beginPath();
      visualizationContext.arc(x, y, tickSize, 0, 2 * Math.PI);
      visualizationContext.fillStyle = `hsl(${
        (i / numTicks) * 360
      }, 100%, 50%)`;
      visualizationContext.fill();
      visualizationContext.closePath();
    }
  };

  // ------------------------------ Audio Jellyfish ------------------------------

  // const drawAudioJellyfish = () => {
  //   requestAnimationFrame(drawAudioJellyfish);
  //   analyzerNode.getByteFrequencyData(dataArray);

  //   visualizationContext.fillStyle = "rgba(0, 0, 0, 0.1)";
  //   visualizationContext.fillRect(
  //     0,
  //     0,
  //     visualizationWidth,
  //     visualizationHeight
  //   );

  //   const centerX = visualizationWidth / 2;
  //   const centerY = visualizationHeight / 2;
  //   const numJellyfish = bufferLength / 16; // Adjust the number of jellyfish here

  //   for (let i = 0; i < numJellyfish; i++) {
  //     const amplitude = (dataArray[i] / 255) * visualizationHeight;
  //     const jellyfishSize = amplitude / 2;

  //     const x = centerX + (Math.random() - 0.5) * 2 * jellyfishSize;
  //     const y = centerY + (Math.random() - 0.5) * 2 * jellyfishSize;

  //     visualizationContext.beginPath();
  //     visualizationContext.arc(x, y, jellyfishSize, 0, 2 * Math.PI);
  //     visualizationContext.strokeStyle = `hsl(${
  //       (i / numJellyfish) * 360
  //     }, 100%, 50%)`;
  //     visualizationContext.lineWidth = 2;
  //     visualizationContext.stroke();
  //     visualizationContext.closePath();
  //   }
  // };

  const drawAudioJellyfish = () => {
    requestAnimationFrame(drawAudioJellyfish);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const numJellyfish = bufferLength;
    const maxJellyfishSize = Math.min(centerX, centerY);

    for (let i = 0; i < numJellyfish; i++) {
      const amplitude = (dataArray[i] / 255) * maxJellyfishSize;
      const numTentacles = 8; // Number of tentacles for the jellyfish
      const tentacleLength = amplitude * 2;
      const tentacleWidth = 5;

      for (let j = 0; j < numTentacles; j++) {
        const angle = (j / numTentacles) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * amplitude * 1.5;
        const y = centerY + Math.sin(angle) * amplitude * 1.5;

        visualizationContext.beginPath();
        visualizationContext.moveTo(x, y);

        // Draw tentacles as curves
        visualizationContext.bezierCurveTo(
          centerX + Math.cos(angle) * amplitude * 0.5,
          centerY + Math.sin(angle) * amplitude * 0.5,
          centerX + Math.cos(angle + Math.PI / 8) * tentacleLength,
          centerY + Math.sin(angle + Math.PI / 8) * tentacleLength,
          centerX + Math.cos(angle + Math.PI / 4) * tentacleLength,
          centerY + Math.sin(angle + Math.PI / 4) * tentacleLength
        );

        visualizationContext.strokeStyle = `hsl(${
          (i / numJellyfish) * 360
        }, 100%, 50%)`;
        visualizationContext.lineWidth = tentacleWidth;
        visualizationContext.lineCap = "round";
        visualizationContext.stroke();
        visualizationContext.closePath();
      }

      // Draw jellyfish body
      visualizationContext.beginPath();
      visualizationContext.arc(centerX, centerY, amplitude, 0, 2 * Math.PI);
      visualizationContext.fillStyle = `hsl(${
        (i / numJellyfish) * 360
      }, 100%, 50%)`;
      visualizationContext.fill();
      visualizationContext.closePath();
    }
  };

  // ------------------------------ Fractal Tree ------------------------------

  const drawFractalTree = () => {
    requestAnimationFrame(drawFractalTree);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const startX = visualizationWidth / 2;
    const startY = visualizationHeight;
    const trunkLength = 150;
    const trunkWidth = 20; // Increase trunk width for better visibility
    const angle = -Math.PI / 2;
    const branchShrinkage = 0.7;
    const maxBranchDepth = 6;
    const maxAudioValue = 255;
    const audioMultiplier = 0.5; // Adjust this to control the audio reactivity

    const drawBranch = (x, y, length, branchAngle, depth) => {
      const endX = x + Math.cos(branchAngle) * length;
      const endY = y + Math.sin(branchAngle) * length;
      const branchWidth = trunkWidth * Math.pow(0.7, depth);

      visualizationContext.beginPath();
      visualizationContext.moveTo(x, y);
      visualizationContext.lineTo(endX, endY);
      visualizationContext.strokeStyle = `rgba(139, 69, 19, ${
        depth / maxBranchDepth
      })`; // Brown color for the trunk
      visualizationContext.lineWidth = branchWidth;
      visualizationContext.stroke();
      visualizationContext.closePath();

      if (depth === maxBranchDepth) {
        // Draw leaves at the end of the branches
        const leafSize = 15; // Increase leaf size for better visibility
        visualizationContext.beginPath();
        visualizationContext.arc(endX, endY, leafSize, 0, Math.PI * 2);
        visualizationContext.fillStyle = "green";
        visualizationContext.fill();
        visualizationContext.closePath();
      }

      if (depth < maxBranchDepth) {
        // Adjust branch length based on audio intensity
        const audioValue =
          dataArray[Math.floor((dataArray.length / maxBranchDepth) * depth)];
        const audioLength =
          length * (audioValue / maxAudioValue) * audioMultiplier;

        drawBranch(
          endX,
          endY,
          audioLength * branchShrinkage,
          branchAngle + 0.4,
          depth + 1
        );
        drawBranch(
          endX,
          endY,
          audioLength * branchShrinkage,
          branchAngle - 0.4,
          depth + 1
        );
      }
    };

    drawBranch(startX, startY, trunkLength, angle, 1);
  };

  // const drawFractalTree = () => {
  //   requestAnimationFrame(drawFractalTree);
  //   analyzerNode.getByteFrequencyData(dataArray);

  //   visualizationContext.fillStyle = "#1d3320"; // Dark green background
  //   visualizationContext.fillRect(0, 0, visualizationWidth, visualizationHeight);

  //   const startX = visualizationWidth / 2;
  //   const startY = visualizationHeight;
  //   const trunkLength = 150;
  //   const trunkWidth = 15;
  //   const angle = -Math.PI / 2;
  //   const branchShrinkage = 0.7;
  //   const maxBranchDepth = 8;
  //   const maxAudioValue = 255;
  //   const audioMultiplier = 0.5; // Adjust this to control the audio reactivity
  //   const maxBranchAngleVariation = Math.PI / 4;
  //   const maxBranchLengthVariation = 20;

  //   const drawBranch = (x, y, length, branchAngle, depth) => {
  //     const endX = x + Math.cos(branchAngle) * length;
  //     const endY = y + Math.sin(branchAngle) * length;
  //     const branchWidth = trunkWidth * Math.pow(0.7, depth);

  //     visualizationContext.beginPath();
  //     visualizationContext.moveTo(x, y);
  //     visualizationContext.lineTo(endX, endY);
  //     visualizationContext.strokeStyle = `rgba(139, 69, 19, ${
  //       depth / maxBranchDepth
  //     })`; // Brown color for the trunk
  //     visualizationContext.lineWidth = branchWidth;
  //     visualizationContext.stroke();
  //     visualizationContext.closePath();

  //     if (depth === maxBranchDepth) {
  //       // Draw leaves at the end of the branches
  //       const leafSize = 8;
  //       const leafAngle = -Math.PI / 4;
  //       visualizationContext.beginPath();
  //       visualizationContext.moveTo(endX, endY);
  //       visualizationContext.lineTo(
  //         endX + Math.cos(leafAngle) * leafSize,
  //         endY + Math.sin(leafAngle) * leafSize
  //       );
  //       visualizationContext.lineTo(
  //         endX + Math.cos(leafAngle + Math.PI / 2) * leafSize,
  //         endY + Math.sin(leafAngle + Math.PI / 2) * leafSize
  //       );
  //       visualizationContext.fillStyle = "#2ca52c"; // Green color for leaves
  //       visualizationContext.fill();
  //       visualizationContext.closePath();
  //     }

  //     if (depth < maxBranchDepth) {
  //       // Adjust branch length based on audio intensity
  //       const audioValue = dataArray[Math.floor((dataArray.length / maxBranchDepth) * depth)];
  //       let audioLength = length * (audioValue / maxAudioValue) * audioMultiplier;

  //       // Add random variation to branch length and angle
  //       audioLength += Math.random() * maxBranchLengthVariation;
  //       let leftBranchAngle = branchAngle + Math.random() * maxBranchAngleVariation;
  //       let rightBranchAngle = branchAngle - Math.random() * maxBranchAngleVariation;

  //       drawBranch(
  //         endX,
  //         endY,
  //         audioLength * branchShrinkage,
  //         leftBranchAngle,
  //         depth + 1
  //       );
  //       drawBranch(
  //         endX,
  //         endY,
  //         audioLength * branchShrinkage,
  //         rightBranchAngle,
  //         depth + 1
  //       );
  //     }
  //   };

  //   drawBranch(startX, startY, trunkLength, angle, 1);
  // };

  // ------------------------------ Audio Galaxy ------------------------------

  const drawAudioGalaxy = () => {
    requestAnimationFrame(drawAudioGalaxy);
    analyzerNode.getByteFrequencyData(dataArray);

    visualizationContext.fillStyle = "#000";
    visualizationContext.fillRect(
      0,
      0,
      visualizationWidth,
      visualizationHeight
    );

    const centerX = visualizationWidth / 2;
    const centerY = visualizationHeight / 2;
    const numStars = bufferLength;
    const maxStarSize = Math.min(centerX, centerY) / 2;

    for (let i = 0; i < numStars; i++) {
      const amplitude = (dataArray[i] / 255) * maxStarSize;
      const angle = (i / numStars) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * amplitude * 2;
      const y = centerY + Math.sin(angle) * amplitude * 2;
      const starSize = (dataArray[i] / 255) * 3; // Vary the star size based on audio intensity

      visualizationContext.beginPath();
      visualizationContext.arc(x, y, starSize, 0, 2 * Math.PI);
      visualizationContext.fillStyle = `hsl(${
        (i / numStars) * 360
      }, 100%, 50%)`;
      visualizationContext.fill();
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

  // Define an object that maps each visualization mode to its respective drawing function
  const visualizationModesMap = {
    waveform: drawWaveform,
    spectrogram: drawSpectrogram,
    "frequency-bars": drawFrequencyBars,
    "circular-visualization": drawCircularVisualization,
    "time-frequency-heatmap": drawTimeFrequencyHeatmap,
    "audio-reactive-shapes": drawAudioReactiveShapes,
    fractals: drawFractals,
    "spectrum-waterfall": drawSpectrumWaterfall,
    "particle-system": drawParticleSystem,
    "frequency-rings": drawFrequencyRings,
    kaleidoscope: drawKaleidoscope,
    "glitch-art": drawGlitchArt,
    "motion-trails": drawMotionTrails,
    "vu-meter": drawVUMeter,
    "neon-glow": drawNeonGlow,
    "geometric-patterns": drawGeometricPatterns,
    "audio-fireworks": drawAudioFireworks,
    "spectrum-flowers": drawSpectrumFlowers,
    pixelation: drawPixelation,
    "audio-tornado": drawAudioTornado,
    "audio-rain": drawAudioRain,
    "audio-metronome": drawAudioMetronome,
    "audio-jellyfish": drawAudioJellyfish,
    "fractal-tree": drawFractalTree,
    "audio-galaxy": drawAudioGalaxy,
    "3d-visualization": () => {
      is3DVisualizationActive = true;
      render3DVisualization();
    },
  };

  const drawFrame = () => {
    // Get the drawing function based on the currentMode
    const drawingFunction = visualizationModesMap[currentMode] || drawWaveform; // if an unsupported mode is provided or the currentMode is not found in the visualizationModesMap, the visualization will default to the waveform.

    // Call the drawing function
    drawingFunction();

    // Set is3DVisualizationActive to false if the mode is not 3D visualization
    if (currentMode != "3d-visualization") {
      is3DVisualizationActive = false;
    } else {
      is3DVisualizationActive = true;
    }
  };

  // Call the drawFrame fuction inside visualizeAudio function
  drawFrame();
};

// -------------------------------- End ----------------------------------

module.exports = {
  visualizeAudio,
  stop3DVisualization,
  clear3DVisualizationCanvas,
};
