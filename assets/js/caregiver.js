// Caregiver Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.caregiver-page')) {
        initializeCaregiverDashboard();
    }
});

function initializeCaregiverDashboard() {
    // Initialize tabs
    initializeTabs();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize chart
    initializeChart();
    
    // Initialize quick actions
    initializeQuickActions();
    
    // Animate stats on load
    animateStats();
    
    // Auto-refresh data every 30 seconds
    setInterval(loadDashboardData, 30000);
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
            
            // Animate content change
            animateTabContent(targetTab);
        });
    });
}

function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    
    if (mobileToggle && headerNav) {
        mobileToggle.addEventListener('click', function() {
            headerNav.classList.toggle('mobile-active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileToggle.contains(event.target) && !headerNav.contains(event.target)) {
                headerNav.classList.remove('mobile-active');
            }
        });
    }
}

function loadDashboardData() {
    // Simulate loading data from storage or API
    const mockData = generateMockData();
    
    // Update stats
    updateStats(mockData.stats);
    
    // Update emotion breakdown
    updateEmotionBreakdown(mockData.emotions);
    
    // Update milestones
    updateMilestones(mockData.milestones);
    
    // Update activity feed
    updateActivityFeed(mockData.activities);
}

function generateMockData() {
    // In real implementation, this would fetch from your backend
    return {
        stats: {
            totalSessions: 24 + Math.floor(Math.random() * 5),
            totalTime: '2.5h',
            accuracyRate: 87 + Math.floor(Math.random() * 8),
            streakDays: 7
        },
        emotions: [
            { name: 'Happy', emoji: '😊', accuracy: 92, attempts: 24 },
            { name: 'Sad', emoji: '😢', accuracy: 78, attempts: 18 },
            { name: 'Angry', emoji: '😠', accuracy: 85, attempts: 16 },
            { name: 'Surprised', emoji: '😲', accuracy: 65, attempts: 12 }
        ],
        milestones: [
            { name: '7-Day Streak Goal', completed: true, date: 'Today' },
            { name: '90% Accuracy Goal', completed: false, date: 'In progress' }
        ],
        activities: [
            {
                type: 'success',
                title: 'Practice Session Completed',
                description: 'Identified 5 emotions with 90% accuracy',
                time: '2 hours ago'
            },
            {
                type: 'milestone',
                title: 'Milestone Achieved',
                description: 'Reached 7-day practice streak!',
                time: 'Today'
            }
        ]
    };
}

function updateStats(stats) {
    const elements = {
        totalSessions: document.getElementById('total-sessions'),
        totalTime: document.getElementById('total-time'),
        accuracyRate: document.getElementById('accuracy-rate'),
        streakDays: document.getElementById('streak-days')
    };
    
    // Animate number changes
    if (elements.totalSessions) {
        animateNumber(elements.totalSessions, stats.totalSessions);
    }
    if (elements.accuracyRate) {
        animateNumber(elements.accuracyRate, stats.accuracyRate, '%');
    }
    if (elements.streakDays) {
        animateNumber(elements.streakDays, stats.streakDays);
    }
}

function animateNumber(element, targetValue, suffix = '') {
    const currentValue = parseInt(element.textContent) || 0;
    const increment = (targetValue - currentValue) / 20;
    let currentNum = currentValue;
    
    const animation = setInterval(() => {
        currentNum += increment;
        if ((increment > 0 && currentNum >= targetValue) || 
            (increment < 0 && currentNum <= targetValue)) {
            currentNum = targetValue;
            clearInterval(animation);
        }
        element.textContent = Math.round(currentNum) + suffix;
    }, 50);
}

function updateEmotionBreakdown(emotions) {
    emotions.forEach((emotion, index) => {
        const accuracyBar = document.querySelectorAll('.accuracy-fill')[index];
        const accuracyText = document.querySelectorAll('.accuracy-text')[index];
        const attemptsText = document.querySelectorAll('.attempts')[index];
        
        if (accuracyBar) {
            // Animate bar width
            setTimeout(() => {
                accuracyBar.style.width = emotion.accuracy + '%';
            }, index * 200);
        }
        
        if (accuracyText) {
            accuracyText.textContent = emotion.accuracy + '%';
        }
        
        if (attemptsText) {
            attemptsText.textContent = emotion.attempts + ' attempts';
        }
    });
}

function updateMilestones(milestones) {
    // Update milestone progress
    // This would be more dynamic in a real implementation
    console.log('Updating milestones:', milestones);
}

function updateActivityFeed(activities) {
    // Update recent activities
    // This would refresh the activity list in a real implementation
    console.log('Updating activities:', activities);
}

function initializeChart() {
    // Simple chart implementation using canvas or fallback to CSS bars
    const chartContainer = document.querySelector('.chart-container');
    const chartControls = document.querySelectorAll('.chart-controls select');
    
    // Add change listeners to chart controls
    chartControls.forEach(control => {
        control.addEventListener('change', function() {
            updateChart();
        });
    });
    
    // Initial chart render
    updateChart();
}

function updateChart() {
    const chartType = document.getElementById('chart-type')?.value || 'sessions';
    const timePeriod = document.getElementById('time-period')?.value || 'week';
    
    // For demo purposes, just animate the existing bars
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        // Generate random heights for demo
        const height = Math.random() * 80 + 20; // 20% to 100%
        bar.style.height = '0%';
        
        setTimeout(() => {
            bar.style.height = height + '%';
        }, index * 100);
    });
    
    console.log(`Updating chart: ${chartType} for ${timePeriod}`);
}

function animateTabContent(tabName) {
    const content = document.getElementById(tabName + '-tab');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
            content.style.transition = 'all 0.3s ease';
        }, 50);
    }
}

function animateStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'all 0.5s ease';
        }, index * 150);
    });
}

function initializeQuickActions() {
    // Add event listeners for quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Quick Action Functions
function exportProgress() {
    showNotification('Generating progress report...', 'info');
    
    // Simulate export process
    setTimeout(() => {
        const reportData = {
            studentName: 'Student',
            dateRange: 'Last 30 days',
            totalSessions: 24,
            accuracyRate: 87,
            improvementAreas: ['Surprised emotions', 'Sad emotions'],
            strengths: ['Happy emotions', 'Consistent practice']
        };
        
        downloadReport(reportData);
        showNotification('Progress report downloaded successfully! 📄', 'success');
    }, 2000);
}

function downloadReport(data) {
    const reportContent = `
EMOTION HELPER - PROGRESS REPORT
================================

Student: ${data.studentName}
Date Range: ${data.dateRange}
Generated: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
------------------
Total Practice Sessions: ${data.totalSessions}
Overall Accuracy Rate: ${data.accuracyRate}%

STRENGTHS
---------
${data.strengths.map(strength => '• ' + strength).join('\n')}

AREAS FOR IMPROVEMENT
--------------------
${data.improvementAreas.map(area => '• ' + area).join('\n')}

RECOMMENDATIONS
---------------
• Continue daily practice routine
• Focus on weaker emotion categories
• Celebrate achievements and milestones

Generated by Emotion Helper App
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotion-helper-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function scheduleReminder() {
    // Open reminder modal or show notification
    showReminderModal();
}

function showReminderModal() {
    const modal = createModal('reminder-modal', 'Set Practice Reminder');
    
    const content = `
        <div class="reminder-form">
            <div class="form-group">
                <label for="reminder-frequency">Frequency</label>
                <select id="reminder-frequency" class="form-control">
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays only</option>
                    <option value="custom">Custom schedule</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="reminder-time-input">Time</label>
                <input type="time" id="reminder-time-input" class="form-control" value="18:00">
            </div>

            <button id="save-reminder-btn" class="btn btn-primary">Save Reminder</button>
        </div>
    `;     