// Smooth scrolling for navigation links
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

// Navbar scroll effect
/*
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});
*/

// Add animation to research cards
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.research-card, .propaganda-item, .impact-text, .team-member').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

document.addEventListener('DOMContentLoaded', function() {
    const propagandaSection = document.getElementById('propaganda');
    const propagandaItems = document.querySelectorAll('.propaganda-item');
    let currentIndex = 0;
    let isScrolling = false;
    let lastScrollTop = 0;
    let scrollThreshold = 50; // Minimum scroll amount to trigger animation

    // Set initial positions
    propagandaItems.forEach((item, index) => {
        if (index === 0) {
            item.classList.add('active');
        } else if (index === 1) {
            item.classList.add('next');
        } else {
            item.classList.add('previous');
        }
    });

    // Handle scroll events
    window.addEventListener('scroll', function() {
        if (isScrolling) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const propagandaRect = propagandaSection.getBoundingClientRect();
        
        // Only trigger animation when propaganda section is in view
        if (propagandaRect.top <= 0 && propagandaRect.bottom >= window.innerHeight) {
            const scrollDiff = Math.abs(scrollTop - lastScrollTop);
            
            if (scrollDiff > scrollThreshold) {
                isScrolling = true;

                // Determine scroll direction
                if (scrollTop > lastScrollTop && currentIndex < propagandaItems.length - 1) {
                    // Scrolling down
                    propagandaItems[currentIndex].classList.remove('active');
                    propagandaItems[currentIndex].classList.add('previous');
                    currentIndex++;
                    propagandaItems[currentIndex].classList.remove('next');
                    propagandaItems[currentIndex].classList.add('active');
                    if (currentIndex + 1 < propagandaItems.length) {
                        propagandaItems[currentIndex + 1].classList.add('next');
                    }
                } else if (scrollTop < lastScrollTop && currentIndex > 0) {
                    // Scrolling up
                    propagandaItems[currentIndex].classList.remove('active');
                    propagandaItems[currentIndex].classList.add('next');
                    currentIndex--;
                    propagandaItems[currentIndex].classList.remove('previous');
                    propagandaItems[currentIndex].classList.add('active');
                    if (currentIndex > 0) {
                        propagandaItems[currentIndex - 1].classList.add('previous');
                    }
                }

                lastScrollTop = scrollTop;
                setTimeout(() => {
                    isScrolling = false;
                }, 500); // Match this with the CSS transition duration
            }
        }
    });

    const propagandaGallery = document.querySelector('.propaganda-gallery');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    // Function to update arrow visibility
    function updateArrows() {
        // Enable/disable left arrow
        if (propagandaGallery.scrollLeft === 0) {
            leftArrow.classList.add('disabled');
        } else {
            leftArrow.classList.remove('disabled');
        }

        // Enable/disable right arrow
        if (propagandaGallery.scrollLeft + propagandaGallery.clientWidth >= propagandaGallery.scrollWidth) {
            rightArrow.classList.add('disabled');
        } else {
            rightArrow.classList.remove('disabled');
        }
    }

    // Scroll to the next card on right arrow click
    rightArrow.addEventListener('click', function() {
        if (rightArrow.classList.contains('disabled')) return;
        const cardWidth = propagandaItems[0].offsetWidth + parseFloat(getComputedStyle(propagandaItems[0]).marginRight);
        propagandaGallery.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    });

    // Scroll to the previous card on left arrow click
    leftArrow.addEventListener('click', function() {
        if (leftArrow.classList.contains('disabled')) return;
        const cardWidth = propagandaItems[0].offsetWidth + parseFloat(getComputedStyle(propagandaItems[0]).marginRight);
        propagandaGallery.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    });

    // Update arrows on scroll
    propagandaGallery.addEventListener('scroll', updateArrows);

    // Initial arrow state
    updateArrows();

    // Also update arrows on window resize (in case layout changes)
    window.addEventListener('resize', updateArrows);
}); 