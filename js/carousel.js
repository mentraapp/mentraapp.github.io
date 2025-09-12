class Carousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentSlide = 0;
        this.totalSlides = 4;
        
        // Swipe detection properties
        this.startX = 0;
        this.startY = 0;
        this.distX = 0;
        this.distY = 0;
        this.threshold = 50; // minimum distance for swipe
        this.restraint = 100; // maximum distance perpendicular to swipe direction
        this.allowedTime = 300; // maximum time allowed to travel that distance
        this.elapsedTime = 0;
        this.startTime = 0;
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Add indicator click events
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Add swipe/touch event listeners
        this.addSwipeListeners();
        
        this.updateCarousel();
    }
    
    addSwipeListeners() {
        const carousel = this.track.parentElement;
        
        // Touch events for mobile
        carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        carousel.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Mouse events for desktop
        carousel.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        carousel.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        carousel.addEventListener('mouseup', (e) => this.handleMouseEnd(e));
        carousel.addEventListener('mouseleave', (e) => this.handleMouseEnd(e));
        
        // Prevent context menu on long press
        carousel.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Disable text selection during swipe
        carousel.style.userSelect = 'none';
        carousel.style.webkitUserSelect = 'none';
        carousel.style.mozUserSelect = 'none';
        carousel.style.msUserSelect = 'none';
    }
    
    handleTouchStart(e) {
        const touch = e.changedTouches[0];
        this.startX = touch.pageX;
        this.startY = touch.pageY;
        this.startTime = new Date().getTime();
    }
    
    handleTouchMove(e) {
        // Prevent default scrolling behavior during horizontal swipe
        if (Math.abs(this.distX) > Math.abs(this.distY)) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        const touch = e.changedTouches[0];
        this.distX = touch.pageX - this.startX;
        this.distY = touch.pageY - this.startY;
        this.elapsedTime = new Date().getTime() - this.startTime;
        
        this.handleSwipe();
    }
    
    handleMouseDown(e) {
        this.isMouseDown = true;
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.startTime = new Date().getTime();
        
        // Prevent text selection
        e.preventDefault();
    }
    
    handleMouseMove(e) {
        if (!this.isMouseDown) return;
        
        this.distX = e.pageX - this.startX;
        this.distY = e.pageY - this.startY;
        
        // Visual feedback during drag
        if (Math.abs(this.distX) > 10) {
            this.track.parentElement.style.cursor = 'grabbing';
        }
    }
    
    handleMouseEnd(e) {
        if (!this.isMouseDown) return;
        
        this.isMouseDown = false;
        this.distX = e.pageX - this.startX;
        this.distY = e.pageY - this.startY;
        this.elapsedTime = new Date().getTime() - this.startTime;
        
        this.track.parentElement.style.cursor = 'grab';
        this.handleSwipe();
    }
    
    handleSwipe() {
        if (this.elapsedTime <= this.allowedTime) {
            if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint) {
                if (this.distX > 0) {
                    // Swipe right - go to previous slide
                    this.prevSlide();
                    // Track swipe interaction
                    if (window.MenGaugeAnalytics) {
                        window.MenGaugeAnalytics.trackCarouselInteraction('swipe_right', this.currentSlide + 1);
                    }
                } else {
                    // Swipe left - go to next slide
                    this.nextSlide();
                    // Track swipe interaction
                    if (window.MenGaugeAnalytics) {
                        window.MenGaugeAnalytics.trackCarouselInteraction('swipe_left', this.currentSlide + 1);
                    }
                }
            }
        }
        
        // Reset values
        this.distX = 0;
        this.distY = 0;
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
        
        // Track carousel interaction
        if (window.MenGaugeAnalytics) {
            window.MenGaugeAnalytics.trackCarouselInteraction('next_slide', this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
        
        // Track carousel interaction
        if (window.MenGaugeAnalytics) {
            window.MenGaugeAnalytics.trackCarouselInteraction('previous_slide', this.currentSlide + 1);
        }
    }
    
    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateCarousel();
        
        // Track carousel interaction
        if (window.MenGaugeAnalytics) {
            window.MenGaugeAnalytics.trackCarouselInteraction('goto_slide', slideIndex + 1);
        }
    }
    
    updateCarousel() {
        // Move the track
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update button states
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});