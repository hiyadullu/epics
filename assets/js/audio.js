// Audio recording and processing functionality
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let recordingTimer = null;
let recordingStartTime = null;

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dashboard-page')) {
        initializeAudioFeatures();
    }
});

function initializeAudioFeatures() {
    const recordBtn = document.getElementById('record-btn');
    const recordingModal = document.getElementById('recording-modal');
    const stopRecordingBtn = document.getElementById('stop-recording');
    const closeModalBtn = document.getElementById('close-modal');
    
    if (recordBtn) {
        recordBtn.addEventListener('click', startRecording);
    }
    
    if (stopRecordingBtn) {
        stopRecordingBtn.addEventListener('click', stopRecording);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeRecordingModal);
    }
    
    // Check if browser supports audio recording
    checkAudioSupport();
}

function checkAudioSupport() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Audio recording not supported in this browser');
        showNotification('Audio recording is not supported in this browser', 'error');
        return false;
    }
    return true;
}

async function startRecording() {
    if (!checkAudioSupport()) return;
    
    try {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        });
        
        // Initialize MediaRecorder
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus'
        });
        
        audioChunks = [];
        
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = function() {
            processRecording();
        };
        
        mediaRecorder.onerror = function(event) {
            console.error('MediaRecorder error:', event);
            showNotification('Recording error occurred', 'error');
        };
        
        // Start recording
        mediaRecorder.start();
        isRecording = true;
        recordingStartTime = Date.now();
        
        // Show recording modal
        showRecordingModal();
        
        // Update UI
        updateRecordingUI(true);
        
        // Start recording timer
        startRecordingTimer();
        
        showNotification('Recording started! Speak now...', 'success');
        
    } catch (error) {
        console.error('Error starting recording:', error);
        handleRecordingError(error);
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // Stop all audio tracks
        if (mediaRecorder.stream) {
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        
        // Stop timer
        if (recordingTimer) {
            clearInterval(recordingTimer);
            recordingTimer = null;
        }
        
        // Update UI
        updateRecordingUI(false);
        
        showNotification('Recording stopped. Processing...', 'info');
    }
}

function processRecording() {
    if (audioChunks.length === 0) {
        showNotification('No audio data recorded', 'error');
        closeRecordingModal();
        return;
    }
    
    // Create audio blob
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const recordingDuration = recordingStartTime ? (Date.now() - recordingStartTime) / 1000 : 0;
    
    // For demo purposes, simulate emotion detection
    simulateEmotionDetection(audioBlob, recordingDuration);
    
    // Reset recording data
    audioChunks = [];
    recordingStartTime = null;
}

function simulateEmotionDetection(audioBlob, duration) {
    // Show processing state
    const modal = document.getElementById('recording-modal');
    if (modal) {
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="processing-animation">
                <div class="spinner">🧠</div>
                <h3>Analyzing Emotion...</h3>
                <p>AI is processing your voice...</p>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        `;
        
        // Animate progress bar
        const progressFill = modalBody.querySelector('.progress-fill');
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => showEmotionResult(), 500);
            }
        }, 200);
    }
    
    // Update practice time in daily progress
    if (window.DashboardHelper) {
        window.DashboardHelper.updateDailyProgress('practiceTime', Math.round(duration / 60));
    }
}

function showEmotionResult() {
    // Simulate emotion detection result
    const emotions = [
        { name: 'Happy', emoji: '😊', confidence: 92 },
        { name: 'Excited', emoji: '🤩', confidence: 88 },
        { name: 'Calm', emoji: '😌', confidence: 85 },
        { name: 'Sad', emoji: '😢', confidence: 78 },
        { name: 'Angry', emoji: '😠', confidence: 82 },
        { name: 'Surprised', emoji: '😲', confidence: 90 }
    ];
    
    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    const modal = document.getElementById('recording-modal');
    if (modal) {
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="emotion-result">
                <div class="result-emotion">
                    <div class="result-emoji">${detectedEmotion.emoji}</div>
                    <h3>${detectedEmotion.name}</h3>
                    <div class="confidence-badge">${detectedEmotion.confidence}% confident</div>
                </div>
                
                <div class="result-actions">
                    <button class="btn-success" onclick="saveEmotionResult('${detectedEmotion.name}', '${detectedEmotion.emoji}', ${detectedEmotion.confidence})">
                        Save Result
                    </button>
                    <button class="btn-secondary" onclick="recordAgain()">
                        Record Again
                    </button>
                </div>
                
                <div class="emotion-description">
                    <p>${getEmotionDescription(detectedEmotion.name)}</p>
                </div>
            </div>
        `;
    }
}

function saveEmotionResult(emotion, emoji, confidence) {
    // Add to emotion history
    addToEmotionHistory(emotion, emoji, confidence);
    
    // Update pet happiness
    if (window.DashboardHelper) {
        window.DashboardHelper.updateStatusBar('happiness', 2);
        window.DashboardHelper.updateDailyProgress('emotions', 1);
        
        // Update pet emotion
        const petEmotion = emotion.toLowerCase() === 'happy' ? 'happy' : 
                          emotion.toLowerCase() === 'excited' ? 'excited' : 'happy';
        window.DashboardHelper.updatePetEmotion(petEmotion);
        
        // Show pet encouragement
        const encouragements = [
            "Great job! I'm learning with you! 🌟",
            "You're getting better at this! 💪",
            "Keep practicing! We make a good team! 🤝",
            "Wonderful! I can feel the emotions too! ❤️"
        ];
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        window.DashboardHelper.showPetMessage(randomEncouragement);
    }
    
    closeRecordingModal();
    showNotification(`Emotion "${emotion}" saved successfully! 🎉`, 'success');
}

function addToEmotionHistory(emotion, emoji, confidence) {
    const historyContainer = document.querySelector('.emotion-timeline');
    if (!historyContainer) return;
    
    // Create new emotion item
    const emotionItem = document.createElement('div');
    emotionItem.className = 'emotion-item';
    emotionItem.innerHTML = `
        <div class="emotion-emoji">${emoji}</div>
        <div class="emotion-info">
            <span class="emotion-name">${emotion}</span>
            <span class="emotion-time">Just now</span>
        </div>
        <div class="confidence-score">${confidence}%</div>
    `;
    
    // Add click handler
    emotionItem.addEventListener('click', function() {
        if (window.DashboardHelper) {
            showEmotionDetails(this);
        }
    });
    
    // Insert at the beginning
    historyContainer.insertBefore(emotionItem, historyContainer.firstChild);
    
    // Animate entry
    emotionItem.style.transform = 'translateX(-100%)';
    emotionItem.style.opacity = '0';
    setTimeout(() => {
        emotionItem.style.transform = 'translateX(0)';
        emotionItem.style.opacity = '1';
        emotionItem.style.transition = 'all 0.3s ease';
    }, 100);
    
    // Keep only last 5 items
    const items = historyContainer.querySelectorAll('.emotion-item');
    if (items.length > 5) {
        items[items.length - 1].remove();
    }
}

function recordAgain() {
    closeRecordingModal();
    setTimeout(() => startRecording(), 500);
}

function showRecordingModal() {
    const modal = document.getElementById('recording-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeRecordingModal() {
    const modal = document.getElementById('recording-modal');
    if (modal) {
        modal.classList.remove('active');
        
        // Reset modal content
        setTimeout(() => {
            const modalBody = modal.querySelector('.modal-body');
            modalBody.innerHTML = `
                <div class="recording-animation">
                    <div class="mic-pulse">🎤</div>
                    <div class="sound-waves">
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                    </div>
                </div>
                <p>Say something and I'll detect the emotion!</p>
                <button class="stop-recording-btn" id="stop-recording">Stop Recording</button>
            `;
            
            // Re-attach event listener
            const stopBtn = modalBody.querySelector('#stop-recording');
            if (stopBtn) {
                stopBtn.addEventListener('click', stopRecording);
            }
        }, 300);
    }
}

function updateRecordingUI(recording) {
    const recordBtn = document.getElementById('record-btn');
    const pulseRing = recordBtn.querySelector('.pulse-ring');
    
    if (recording) {
        recordBtn.style.background = 'linear-gradient(45deg, #ff4757, #ff3838)';
        recordBtn.disabled = true;
        if (pulseRing) {
            pulseRing.style.opacity = '1';
            pulseRing.style.animation = 'pulse 1s infinite';
        }
    } else {
        recordBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #feca57)';
        recordBtn.disabled = false;
        if (pulseRing) {
            pulseRing.style.opacity = '0';
            pulseRing.style.animation = 'none';
        }
    }
}

function startRecordingTimer() {
    let seconds = 0;
    recordingTimer = setInterval(() => {
        seconds++;
        const modal = document.getElementById('recording-modal');
        if (modal) {
            const header = modal.querySelector('.modal-header h3');
            if (header) {
                header.textContent = `Recording... ${seconds}s`;
            }
        }
        
        // Auto-stop after 30 seconds
        if (seconds >= 30) {
            stopRecording();
            showNotification('Recording stopped automatically (30s limit)', 'info');
        }
    }, 1000);
}

function handleRecordingError(error) {
    let errorMessage = 'Could not start recording';
    
    if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied. Please allow microphone access and try again.';
    } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
    } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microphone is being used by another application.';
    }
    
    showNotification(errorMessage, 'error');
    updateRecordingUI(false);
}

function getEmotionDescription(emotion) {
    const descriptions = {
        'Happy': 'Happy emotions in voice often include higher pitch, faster tempo, and bright tones. Great job recognizing positivity!',
        'Excited': 'Excitement shows through energetic speech patterns, variable pitch, and animated delivery. You caught the enthusiasm!',
        'Calm': 'Calm voices are steady and even-paced with controlled breathing. Perfect identification of this peaceful state!',
        'Sad': 'Sadness typically has lower pitch, slower pace, and softer volume. You recognized these subtle cues well!',
        'Angry': 'Anger often presents with louder volume, sharper tones, and faster pace. Good catch on these intensity markers!',
        'Surprised': 'Surprise shows through sudden pitch changes and irregular rhythm. Excellent detection of this quick emotion!'
    };
    
    return descriptions[emotion] || 'Great job identifying this emotion! Each emotion has unique vocal patterns.';
}

// Make functions available globally for onclick handlers
window.saveEmotionResult = saveEmotionResult;
window.recordAgain = recordAgain;

// Export for external use
window.AudioHelper = {
    startRecording,
    stopRecording,
    isRecording: () => isRecording,
    checkAudioSupport
};