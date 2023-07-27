from flask import Flask, render_template, request, jsonify
import librosa
import librosa.display
import matplotlib.pyplot as plt
import io, os
import base64

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    audio_file = request.files['audio']
    # Save the uploaded file to the uploads folder
    audio_file.save('uploads/audios/audio.wav')

    # Process the uploaded audio file
    y, sr = librosa.load('uploads/audios/audio.wav')

    # Extract audio features
    chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr)
    mfcc = librosa.feature.mfcc(y=y, sr=sr)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)

    # Create visualizations
    plt.figure(figsize=(10, 6))

    plt.subplot(3, 1, 1)
    librosa.display.specshow(chroma_stft, y_axis='chroma')
    plt.title('Chromagram')
    plt.colorbar(format='%+2.0f dB')

    plt.subplot(3, 1, 2)
    librosa.display.specshow(mfcc, x_axis='time')
    plt.title('MFCC')
    plt.colorbar()

    plt.subplot(3, 1, 3)
    plt.plot(spectral_centroid[0])
    plt.title('Spectral Centroid')

    # Convert the visualization to base64-encoded image
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    base64_img = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()

    # Return the visualization data as JSON response
    return jsonify({'image': base64_img})

if __name__ == '__main__':
    # Get the port number from the PORT environment variable if available
    port = int(os.environ.get('PORT', 5000))
    # Start the Gunicorn server
    app.run(host='0.0.0.0', port=port, debug=True)
