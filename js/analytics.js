// Google Analytics 4 Configuration
// Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID
const GA_MEASUREMENT_ID = 'G-NTHF4B9JY3'; // TODO: Replace with your actual GA4 ID

// Initialize Google Analytics
function initializeGA() {
    // Check if we should wait for cookie consent
    if (typeof _iub !== 'undefined' && _iub.csConfiguration) {
        // Wait for Iubenda consent before initializing GA
        _iub.csConfiguration.callback = _iub.csConfiguration.callback || {};
        _iub.csConfiguration.callback.onConsentGiven = function() {
            loadGoogleAnalytics();
        };
        
        // Check if consent already given - with safe property access
        try {
            if (_iub.cs && _iub.cs.api && typeof _iub.cs.api.isConsentGiven === 'function' && _iub.cs.api.isConsentGiven()) {
                loadGoogleAnalytics();
            }
        } catch (e) {
            // Iubenda not fully loaded yet, callback will handle initialization
        }
    } else {
        // No cookie consent system detected, load GA directly
        loadGoogleAnalytics();
    }
}

function loadGoogleAnalytics() {
    // Load gtag script dynamically
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.className = '_iub_cs_activate'; // Iubenda class for auto-blocking
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        // Enhanced measurement for automatic tracking
        enhanced_measurement: true,
        // Anonymize IP addresses for privacy
        anonymize_ip: true,
        // Track user language
        custom_parameter: {
            user_language: navigator.language || navigator.userLanguage || 'unknown'
        }
    });
    
}

// Track install button clicks
function trackInstallClick(platform, url) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'app_install_click', {
            event_category: 'App Downloads',
            event_label: platform,
            app_platform: platform,
            destination_url: url,
            user_language: navigator.language || navigator.userLanguage || 'unknown'
        });
        
    }
}

// Track custom events
function trackCustomEvent(eventName, eventParameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            ...eventParameters,
            user_language: navigator.language || navigator.userLanguage || 'unknown'
        });
        
    }
}

// Track page views with additional data
function trackPageView(pageTitle, pagePath) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: pageTitle,
            page_location: window.location.href,
            page_path: pagePath,
            user_language: navigator.language || navigator.userLanguage || 'unknown',
            referrer: document.referrer || 'direct'
        });
    }
}

// Track carousel interactions
function trackCarouselInteraction(action, slideNumber) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'carousel_interaction', {
            event_category: 'User Engagement',
            event_label: action,
            slide_number: slideNumber,
            user_language: navigator.language || navigator.userLanguage || 'unknown'
        });
    }
}

// Track social media clicks
function trackSocialClick(platform, url) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'social_click', {
            event_category: 'Social Media',
            event_label: platform,
            destination_url: url,
            user_language: navigator.language || navigator.userLanguage || 'unknown'
        });
        
    }
}

// Track user engagement time
function trackEngagementTime() {
    let startTime = Date.now();
    let lastActivity = Date.now();
    
    // Update last activity on user interactions
    ['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
        document.addEventListener(event, () => {
            lastActivity = Date.now();
        });
    });
    
    // Send engagement time before user leaves
    window.addEventListener('beforeunload', () => {
        const totalTime = Math.round((lastActivity - startTime) / 1000); // in seconds
        
        if (totalTime > 5 && typeof gtag !== 'undefined') { // Only track if user was engaged for more than 5 seconds
            gtag('event', 'user_engagement', {
                event_category: 'Engagement',
                engagement_time: totalTime,
                user_language: navigator.language || navigator.userLanguage || 'unknown'
            });
        }
    });
}

// Set up event listeners for install buttons
function setupInstallButtonTracking() {
    // Android install button
    const androidButton = document.querySelector('a[href*="play.google.com"]');
    if (androidButton) {
        androidButton.addEventListener('click', () => {
            trackInstallClick('Android', androidButton.href);
        });
    }
    
    // iOS install button (when available) - find by text content
    const ctaButtons = document.querySelectorAll('.cta-button');
    let iosButton = null;
    
    ctaButtons.forEach(button => {
        if (button.href && button.href.includes('apps.apple.com')) {
            iosButton = button;
        } else if (button.textContent.includes('iOS') || button.textContent.includes('Coming Soon')) {
            iosButton = button;
        }
    });
    
    if (iosButton) {
        iosButton.addEventListener('click', () => {
            if (iosButton.href && iosButton.href.includes('apps.apple.com')) {
                trackInstallClick('iOS', iosButton.href);
            } else {
                // Track "Coming Soon" clicks
                trackCustomEvent('ios_coming_soon_click', {
                    event_category: 'App Downloads',
                    event_label: 'iOS Coming Soon'
                });
            }
        });
    }
}

// Set up tracking for social media links
function setupSocialMediaTracking() {
    const twitterButton = document.querySelector('a[href*="x.com"]') || 
                         document.querySelector('a[href*="twitter.com"]');
    
    if (twitterButton) {
        twitterButton.addEventListener('click', () => {
            trackSocialClick('Twitter/X', twitterButton.href);
        });
    }
}

// Set up tracking for navigation links
function setupNavigationTracking() {
    const navLinks = document.querySelectorAll('a[href^="terms"], a[href^="policy"], a[href^="supports"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const page = link.href.split('/').pop() || link.textContent;
            trackCustomEvent('navigation_click', {
                event_category: 'Navigation',
                event_label: page
            });
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GA4
    initializeGA();
    
    // Set up all tracking
    setTimeout(() => {
        setupInstallButtonTracking();
        setupSocialMediaTracking();
        setupNavigationTracking();
        trackEngagementTime();
        
        // Track initial page view
        trackPageView(document.title, window.location.pathname);
    }, 1000); // Small delay to ensure gtag is loaded
});

// Export functions for use in other scripts
window.MenGaugeAnalytics = {
    trackInstallClick,
    trackCustomEvent,
    trackPageView,
    trackCarouselInteraction,
    trackSocialClick
};