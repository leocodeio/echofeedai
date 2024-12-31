import React, { useState, useRef } from 'react';
import './App.css';
import { LiveAudioVisualizer } from 'react-audio-visualize';

function App() {
  const [recordedText, setRecordedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [missingPoints, setMissingPoints] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const keyPoints = [
    'Work environment',
    'Management',
    'Team dynamics',
    'Tools and resources',
    'Suggestions for improvement'
  ];

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setMediaBlobUrl(url);
      audioChunks.current = [];
      analyzeFeedback(blob);
    };

    recorder.start();
    setIsRecording(true);
    setIsPaused(false);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const analyzeFeedback = (blob) => {
    const feedbackText = recordedText.toLowerCase();
    const missing = keyPoints.filter(point => !feedbackText.includes(point.toLowerCase()));
    setMissingPoints(missing);
  };

  const handleSubmit = async () => {
    if (!mediaBlobUrl) return;
  
    const blob = await fetch(mediaBlobUrl).then(r => r.blob());
    const formData = new FormData();
    formData.append('audio', blob, 'feedback.wav'); // Adjust filename as needed
  
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        setShowPopup(true); // Show the pop-up when feedback is submitted
      } else {
        console.error('Failed to upload audio');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };
  
  return (
    <div className="container">
      <header className="header">
        <div className="logo">Company Name</div>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#blog">Blog</a>
          <a href="#profile">Profile</a>
          <div className="icon">
            <span className="bell">&#128276;</span>
          </div>
          <button className="logout">Log out</button>
        </nav>
      </header>

      <main className="main">
        <p className="greeting">Hello!</p>
        <h3>Instructions</h3>
        <p className="greeting2">
          To provide voice feedback, click on the 'Record' button to start recording.
          You can pause or stop the recording at any time. Once recorded,
          use the playback controls to listen to your feedback. Adjust the volume as needed. Finally,
          click "Submit Feedback" to send your feedback.
        </p>
        <div className="divider"></div>
        <div className="content">
          <div className="record-section">
            <img src="bot.png" alt="Logo" className="record-logo" />

            <p className="record-statement">
              {isRecording ? (isPaused ? "Recording paused..." : "Go ahead, I'm listening...") : "Record your audio below"}
            </p>

            <div className="audio-meter">
              {isRecording && !isPaused && mediaRecorder && (
                <LiveAudioVisualizer
                  mediaRecorder={mediaRecorder}
                  width={510}
                  height={100}
                />
              )}
            </div>

            <textarea
              className="recorded-text"
              value={isRecording ? (isPaused ? "Paused" : "Recording...") : recordedText}
              readOnly
            />

            <div className="button-group">
              {!isRecording && (
                <a
                  className="record-btn"
                  onClick={startRecording}
                >
                  <img src="record.png" alt="Record" className="icon1" />
                </a>
              )}

              {isRecording && !isPaused && (
                <a
                  className="pause-btn"
                  onClick={pauseRecording}
                >
                  <img src="pause.png" alt="Pause" className="icon2" />
                </a>
              )}

              {isRecording && isPaused && (
                <a
                  className="resume-btn"
                  onClick={resumeRecording}
                >
                  <img src="resume.png" alt="Resume" className="icon2" />
                </a>
              )}

              {isRecording && (
                <a
                  className="stop-btn"
                  onClick={stopRecording}
                >
                  <img src="stop.png" alt="Stop" className="icon3" />
                </a>
              )}
            </div>

            <button
              className="submit-btn"
              onClick={handleSubmit}
              alt="Submit"
            >
              Submit
            </button>
            {mediaBlobUrl && (
              <div className="recorded-audio-interactive">
                <audio src={mediaBlobUrl} controls />
                <p>{recordedText}</p>
              </div>
            )}
          </div>

          <div className="feedback-section">
            <h3>Feedback - Key Points:</h3>
            <ul>
              {keyPoints.map((point, index) => (
                <li key={index} className={`feedback-point ${missingPoints.includes(point) ? 'missing' : ''}`}>
                  {point}
                </li>
              ))}
            </ul>
            {missingPoints.length > 0 && (
              <div className="missing-points">
                <h3>Missing Key Points:</h3>
                <ul>
                  {missingPoints.map((point, index) => (
                    <li key={index} className="missing-point">{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© Copyright @2024</p>
      </footer>

      {/* Pop-Up Window */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Your feedback has been submitted!</p>
            <a href="#home" className="done-link">Done</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
