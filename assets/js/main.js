// Main JavaScript file for Emotion Helper App
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initializeApp();
});

function initializeApp() {
    // Landing page functionality
    if (document.querySelector('.landing-page')) {
        initializeLandingPage();
    }
    
    // Dashboard functionality
    if (document.querySelector('.dashboard-page')) {
        initializeDashboard();
    }
    
    // Common functionality
    initializeCommon();
}

function initializeLandingPage() {
    const startNowBtn = document.getElementById('start-now-btn');
    const caregiverBtn = document.getElementById('caregiver-btn');
    
    if (startNowBtn) {
        startNowBtn.addEventListener('click', function() {
            // Add loading animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 200);
        });
    }
    
    if (caregiverBtn) {
        caregiverBtn.addEventListener('click', function() {
            // Add loading animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                window.location.href = 'pages/caregiver.html';
            }, 200);
        });
    }
    
    // Animate cute character on load
    animateCharacter();
}

function initializeDashboard() {
    // Sidebar functionality
    initializeSidebar();
    
    // Navigation
    initializeNavigation();
    
    // Recording functionality will be handled in audio.js
    // Dashboard interactions will be handled in dashboard.js
}

function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            
            // Close sidebar when clicking outside on mobile
            if (sidebar.classList.contains('active')) {
                document.addEventListener('click', handleOutsideClick);
            }
        });
    }
    
    function handleOutsideClick(event) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
            sidebar.classList.remove('active');
            document.removeEventListener('click', handleOutsideClick);
        }
    }
    
    // Handle sidebar navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.dataset.section) {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Handle section switching
                switchSection(this.dataset.section);
                
                // Close sidebar on mobile after selection
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });
}

function initializeNavigation() {
    const topNavItems = document.querySelectorAll('.top-nav-item');
    
    topNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            topNavItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

function switchSection(section) {
    console.log('Switching to section:', section);
    
    // This function will be expanded to handle different dashboard sections
    switch(section) {
        case 'home':
            // Show main dashboard content
            break;
        case 'progress':
            // Show progress tracking
            showProgressSection();
            break;
        case 'caregiver':
            // Show caregiver dashboard
            break;
        case 'settings':
            // Show settings
            showSettingsSection();
            break;
    }
}

function showProgressSection() {
    // This would show detailed progress analytics
    // For now, we'll just update the daily progress section
    updateProgressDisplay();
}

function showSettingsSection() {
    // This would show app settings
    console.log('Settings section - coming soon!');
}

function updateProgressDisplay() {
    // Simulate updating progress data
    const progressCards = document.querySelectorAll('.progress-card');
    
    progressCards.forEach((card, index) => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 100 + index * 50);
    });
}

function animateCharacter() {
    const character = document.querySelector('.cute-character');
    if (character) {
        // Add random eye blinks
        setInterval(() => {
            const eyes = character.querySelectorAll('.eye');
            eyes.forEach(eye => {
                eye.style.transform = 'scaleY(0.1)';
                setTimeout(() => {
                    eye.style.transform = 'scaleY(1)';
                }, 150);
            });
        }, 3000 + Math.random() * 2000);
    }
}

function initializeCommon() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
    
    // Handle responsive behavior
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
}

function handleResponsive() {
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth > 1024) {
        // Desktop - ensure sidebar is visible
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Export functions for use in other files
window.EmotionHelper = {
    showNotification,
    updateProgressDisplay,
    animateCharacter
};