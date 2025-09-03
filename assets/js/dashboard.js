// Dashboard functionality for Emotion Helper App
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dashboard-page')) {
        initializeDashboardFeatures();
    }
});

function initializeDashboardFeatures() {
    // Initialize pet companion
    initializePetCompanion();
    
    // Initialize practice section
    initializePracticeSection();
    
    // Initialize emotion history
    initializeEmotionHistory();
    
    // Initialize progress tracking
    initializeProgressTracking();
    
    // Update pet status periodically
    setInterval(updatePetStatus, 30000); // Every 30 seconds
}

function initializePetCompanion() {
    const petContainer = document.querySelector('.pet-container');
    const statusBars = document.querySelectorAll('.bar-fill');
    
    if (petContainer) {
        // Add pet interaction
        petContainer.addEventListener('click', function() {
            interactWithPet();
        });
        
        // Initialize pet emotions based on user activity
        updatePetEmotion('happy');
    }
    
    // Animate status bars on load
    statusBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = bar.style.width || '75%';
        }, 500 + index * 200);
    });
}

function interactWithPet() {
    const petCharacter = document.querySelector('.pet-container .cute-character');
    const mouth = petCharacter.querySelector('.mouth');
    
    // Animate pet interaction
    petCharacter.style.transform = 'scale(1.1)';
    mouth.classList.add('excited');
    
    setTimeout(() => {
        petCharacter.style.transform = 'scale(1)';
        mouth.classList.remove('excited');
    }, 300);
    
    // Show interaction message
    showPetMessage('Good job practicing! I\'m getting happier! 😊');
    
    // Update happiness bar
    updateStatusBar('happiness', 5);
}

function updatePetEmotion(emotion) {
    const mouth = document.querySelector('.pet-container .mouth');
    const eyes = document.querySelectorAll('.pet-container .eye');
    
    if (mouth && eyes) {
        // Remove existing emotion classes
        mouth.classList.remove('happy', 'sad', 'excited', 'neutral');
        
        // Add new emotion class
        mouth.classList.add(emotion);
        
        // Animate eyes based on emotion
        if (emotion === 'happy') {
            eyes.forEach(eye => {
                eye.style.borderRadius = '50% 50% 50% 50%';
            });
        } else if (emotion === 'sad') {
            eyes.forEach(eye => {
                eye.style.borderRadius = '50% 50% 20% 20%';
            });
        }
    }
}

function updateStatusBar(type, increment) {
    const bar = document.querySelector(`.bar.${type} .bar-fill`);
    if (bar) {
        const currentWidth = parseInt(bar.style.width) || 75;
        const newWidth = Math.min(100, currentWidth + increment);
        
        bar.style.width = newWidth + '%';
        
        // Update pet emotion based on happiness level
        if (type === 'happiness') {
            if (newWidth >= 80) {
                updatePetEmotion('excited');
            } else if (newWidth >= 50) {
                updatePetEmotion('happy');
            } else {
                updatePetEmotion('neutral');
            }
        }
    }
}

function showPetMessage(message) {
    const existingMessage = document.querySelector('.pet-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = 'pet-message';
    messageElement.textContent = message;
    
    // Style the message
    Object.assign(messageElement.style, {
        position: 'absolute',
        top: '-40px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#333',
        padding: '8px 12px',
        borderRadius: '15px',
        fontSize: '0.9rem',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        zIndex: '100',
        whiteSpace: 'nowrap',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });
    
    const petContainer = document.querySelector('.pet-container');
    petContainer.style.position = 'relative';
    petContainer.appendChild(messageElement);
    
    // Animate message in
    setTimeout(() => {
        messageElement.style.opacity = '1';
    }, 100);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 3000);
}

function initializePracticeSection() {
    const practiceBtn = document.getElementById('practice-btn');
    
    if (practiceBtn) {
        practiceBtn.addEventListener('click', function() {
            startPracticeSession();
        });
    }
}

function startPracticeSession() {
    // This will later connect to the practice module
    // For now, show a preview of what's coming
    showPracticeModal();
}

function showPracticeModal() {
    const modal = createModal('practice-modal', 'Practice Session');
    
    const content = `
        <div class="practice-preview">
            <h3>🎯 Emotion Practice</h3>
            <p>Interactive lessons coming soon!</p>
            
            <div class="practice-types">
                <div class="practice-type">
                    <div class="type-icon">😊</div>
                    <h4>Happy Sounds</h4>
                    <p>Learn to recognize joy and excitement</p>
                </div>
                <div class="practice-type">
                    <div class="type-icon">😢</div>
                    <h4>Sad Sounds</h4>
                    <p>Identify sadness and disappointment</p>
                </div>
                <div class="practice-type">
                    <div class="type-icon">😠</div>
                    <h4>Angry Sounds</h4>
                    <p>Recognize frustration and anger</p>
                </div>
            </div>
            
            <button class="start-practice-btn" onclick="startQuickPractice()">
                Start Quick Practice
            </button>
        </div>
    `;
    
    modal.querySelector('.modal-body').innerHTML = content;
    document.body.appendChild(modal);
    modal.classList.add('active');
}

function startQuickPractice() {
    // Close practice modal
    const modal = document.querySelector('#practice-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    
    // Show quick practice
    showQuickPracticeSession();
    
    // Update pet status
    updateStatusBar('practice', 10);
    interactWithPet();
}

function showQuickPracticeSession() {
    const practiceModal = createModal('quick-practice-modal', 'Quick Practice');
    
    const emotions = ['😊 Happy', '😢 Sad', '😠 Angry', '😐 Neutral'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    const content = `
        <div class="quick-practice">
            <h3>Listen and Identify!</h3>
            <div class="emotion-display">
                <div class="current-emotion">${randomEmotion}</div>
            </div>
            
            <div class="practice-audio">
                <button class="play-sample-btn" onclick="playEmotionSample('${randomEmotion}')">
                    🔊 Play Sample
                </button>
            </div>
            
            <div class="emotion-choices">
                <h4>What emotion did you hear?</h4>
                <div class="choice-buttons">
                    ${emotions.map(emotion => `
                        <button class="choice-btn" onclick="selectEmotion('${emotion}', '${randomEmotion}')">
                            ${emotion}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    practiceModal.querySelector('.modal-body').innerHTML = content;
    document.body.appendChild(practiceModal);
    practiceModal.classList.add('active');
}

function playEmotionSample(emotion) {
    // Placeholder for audio playback
    // In real implementation, this would play an audio sample
    console.log('Playing sample for:', emotion);
    
    const playBtn = document.querySelector('.play-sample-btn');
    playBtn.textContent = '🔊 Playing...';
    playBtn.disabled = true;
    
    setTimeout(() => {
        playBtn.textContent = '🔊 Play Again';
        playBtn.disabled = false;
    }, 2000);
    
    // Simulate audio feedback
    showNotification('Playing emotion sample...', 'info');
}

function selectEmotion(selected, correct) {
    const isCorrect = selected === correct;
    const choiceButtons = document.querySelectorAll('.choice-btn');
    
    choiceButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent.trim() === selected) {
            btn.style.background = isCorrect ? '#4CAF50' : '#f44336';
        } else if (btn.textContent.trim() === correct && !isCorrect) {
            btn.style.background = '#4CAF50';
        }
    });
    
    // Show result
    setTimeout(() => {
        if (isCorrect) {
            showNotification('Correct! Great job! 🎉', 'success');
            updateDailyProgress('emotions', 1);
            updateStatusBar('happiness', 3);
        } else {
            showNotification('Not quite right. Try again next time! 💪', 'info');
        }
        
        // Close modal after showing result
        setTimeout(() => {
            const modal = document.querySelector('#quick-practice-modal');
            if (modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        }, 2000);
    }, 1000);
}

function initializeEmotionHistory() {
    // Add click handlers to emotion history items
    const emotionItems = document.querySelectorAll('.emotion-item');
    
    emotionItems.forEach(item => {
        item.addEventListener('click', function() {
            showEmotionDetails(this);
        });
    });
}

function showEmotionDetails(emotionItem) {
    const emoji = emotionItem.querySelector('.emotion-emoji').textContent;
    const name = emotionItem.querySelector('.emotion-name').textContent;
    const time = emotionItem.querySelector('.emotion-time').textContent;
    const confidence = emotionItem.querySelector('.confidence-score').textContent;
    
    const modal = createModal('emotion-detail-modal', 'Emotion Details');
    
    const content = `
        <div class="emotion-details">
            <div class="detail-emotion">
                <div class="detail-emoji">${emoji}</div>
                <h3>${name}</h3>
            </div>
            
            <div class="detail-info">
                <div class="info-row">
                    <span class="label">Detected:</span>
                    <span class="value">${time}</span>
                </div>
                <div class="info-row">
                    <span class="label">Confidence:</span>
                    <span class="value">${confidence}</span>
                </div>
            </div>
            
            <div class="emotion-tips">
                <h4>About ${name} Emotions:</h4>
                <p>${getEmotionTips(name)}</p>
            </div>
        </div>
    `;
    
    modal.querySelector('.modal-body').innerHTML = content;
    document.body.appendChild(modal);
    modal.classList.add('active');
}

function getEmotionTips(emotion) {
    const tips = {
        'Happy': 'Happy voices often sound lighter, with higher pitch and faster speech. You might hear laughter or excitement!',
        'Sad': 'Sad voices tend to be slower, with lower pitch and longer pauses. The person might sound tired or quiet.',
        'Angry': 'Angry voices are usually louder, with sharp tones and faster speech. Words might sound harsh or clipped.',
        'Neutral': 'Neutral voices are calm and steady, without strong emotional expression. This is a baseline emotional state.'
    };
    
    return tips[emotion] || 'This emotion has unique vocal characteristics that you can learn to recognize!';
}

function initializeProgressTracking() {
    // Initialize daily progress data
    if (!localStorage.getItem('dailyProgress')) {
        const initialProgress = {
            emotions: 0,
            practiceTime: 0,
            accuracy: 0,
            date: new Date().toDateString()
        };
        localStorage.setItem('dailyProgress', JSON.stringify(initialProgress));
    }
    
    // Load and display current progress
    loadDailyProgress();
}

function loadDailyProgress() {
    const progress = JSON.parse(localStorage.getItem('dailyProgress') || '{}');
    const today = new Date().toDateString();
    
    // Reset progress if it's a new day
    if (progress.date !== today) {
        progress.emotions = 0;
        progress.practiceTime = 0;
        progress.accuracy = 0;
        progress.date = today;
        localStorage.setItem('dailyProgress', JSON.stringify(progress));
    }
    
    // Update display
    updateProgressDisplay(progress);
}

function updateDailyProgress(type, value) {
    const progress = JSON.parse(localStorage.getItem('dailyProgress') || '{}');
    
    switch(type) {
        case 'emotions':
            progress.emotions = (progress.emotions || 0) + value;
            break;
        case 'practiceTime':
            progress.practiceTime = (progress.practiceTime || 0) + value;
            break;
        case 'accuracy':
            progress.accuracy = value;
            break;
    }
    
    localStorage.setItem('dailyProgress', JSON.stringify(progress));
    updateProgressDisplay(progress);
}

function updateProgressDisplay(progress) {
    const cards = document.querySelectorAll('.progress-card');
    
    if (cards.length >= 3) {
        cards[0].querySelector('h4').textContent = progress.emotions || 0;
        cards[1].querySelector('h4').textContent = `${progress.practiceTime || 0} min`;
        cards[2].querySelector('h4').textContent = `${progress.accuracy || 85}%`;
    }
}

function updatePetStatus() {
    // Simulate pet needs over time
    const happinessBar = document.querySelector('.bar.happiness .bar-fill');
    const practiceBar = document.querySelector('.bar.practice .bar-fill');
    
    if (happinessBar) {
        const currentHappiness = parseInt(happinessBar.style.width) || 75;
        const newHappiness = Math.max(20, currentHappiness - 1);
        happinessBar.style.width = newHappiness + '%';
        
        if (newHappiness < 40) {
            updatePetEmotion('sad');
            if (Math.random() < 0.3) { // 30% chance to show message
                showPetMessage('I could use some practice time! 🥺');
            }
        }
    }
}

// Utility function to create modals
function createModal(id, title) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = id;
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="closeModal('${id}')">&times;</button>
            </div>
            <div class="modal-body">
                <!-- Content will be inserted here -->
            </div>
        </div>
    `;
    
    return modal;
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Add global functions for onclick handlers
window.startQuickPractice = startQuickPractice;
window.playEmotionSample = playEmotionSample;
window.selectEmotion = selectEmotion;
window.closeModal = closeModal;

// Export functions for external use
window.DashboardHelper = {
    updatePetEmotion,
    updateStatusBar,
    showPetMessage,
    updateDailyProgress
};