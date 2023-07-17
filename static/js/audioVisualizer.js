// -------------------------------- audioVisualizer.js ----------------------------------
const visualizationCanvas = document.getElementById("visualization");
const visualization3DCanvas = document.getElementById("visualization3D");

// Define variables for 3D visualization
let renderer;
let scene;
let camera;
let mesh;
let geometry;
let material;
let rotationSpeed = 0.001;
let is3DVisualizationActive = false; // Variable to track if 3D visualization is active

// Get the visualization canvas size
visualizationWidth = visualizationCanvas.clientWidth;
visualizationHeight = visualizationCanvas.clientHeight;

// Set the visualization canvas size
visualizationCanvas.width = visualizationWidth;
visualizationCanvas.height = visualizationHeight;

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

  // Render the 3D visualization
  const render3DVisualization = () => {
    if (!is3DVisualizationActive) return; // Stop rendering if 3D visualization is not active
    requestAnimationFrame(render3DVisualization);
    mesh.rotation.x += rotationSpeed;
    mesh.rotation.y += rotationSpeed;
    renderer.render(scene, camera);
  };

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

// ------------------ 3D Visualization ---------------------

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

// -------------------------------- End ----------------------------------

module.exports = {
  visualizeAudio,
  stop3DVisualization,
  clear3DVisualizationCanvas,
};
