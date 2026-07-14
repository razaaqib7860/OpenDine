document.addEventListener('DOMContentLoaded', () => {
    
    // --- BACKGROUND IMAGES SLIDESHOW ---
    const slides = document.querySelectorAll('.slideshow-container .slide');
    let currentSlide = 0;
    const slideInterval = 5000; // Changes images every 5 seconds

    function nextSlide() {
        // Remove active class from current image
        slides[currentSlide].classList.remove('active');
        
        // Move to the next index loop-around
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to the new image
        slides[currentSlide].classList.add('active');
    }

    // Run interval only if slides exist
    if(slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }


    // --- PROFILE DROPDOWN TOGGLE ---
    const profileBtn = document.getElementById('profileTriggerBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops event from bubbling to document
        profileDropdown.classList.toggle('show');
    });

    // Close dropdown dynamically when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
            profileDropdown.classList.remove('show');
        }
    });
});