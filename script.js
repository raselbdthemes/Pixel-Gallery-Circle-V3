document.addEventListener('DOMContentLoaded', function() {
    // Get all image boxes
    const imgBoxes = document.querySelectorAll('.imgBx');
    const infoDisplay = document.querySelector('.info-display');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    const infoButton = document.getElementById('info-button');
    
    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Get the icon container for rotation
    const iconContainer = document.querySelector('.icon');
    
    // Track current active index and rotation
    let currentIndex = 0;
    let currentRotation = 0;
    let isAutoRotating = false;
    let autoRotateInterval;
    let autoRotateSpeed = 0.08; // degrees per second (extremely slow and smooth rotation)

    // Function to truncate text to 10 words on mobile
    function truncateDescription(text) {
        if (window.innerWidth <= 768) {
            const words = text.split(' ');
            if (words.length > 3) {
                return words.slice(0, 3).join(' ') + '...';
            }
        }
        return text;
    }

    // Function to set info and handle active state
    function setInfoFromBox(imgBox) {
        // Remove active class from all boxes
        imgBoxes.forEach(box => box.classList.remove('active'));
        
        // Add active class to clicked box
        imgBox.classList.add('active');
        
        const title = imgBox.getAttribute('data-title');
        const description = imgBox.getAttribute('data-description');
        const buttonText = imgBox.getAttribute('data-button');
        
        // Add fade-out effect first
        infoTitle.style.opacity = '0';
        infoTitle.style.transform = 'translateY(20px)';
        infoDescription.style.opacity = '0';
        infoDescription.style.transform = 'translateY(20px)';
        infoButton.style.opacity = '0';
        infoButton.style.transform = 'translateY(20px)';
        
        // Update content
        infoTitle.textContent = title;
        infoDescription.textContent = truncateDescription(description);
        infoButton.textContent = buttonText;
        
        // Add fade-in effect with staggered timing
        setTimeout(() => {
            infoTitle.style.transition = 'all 0.6s ease';
            infoTitle.style.opacity = '1';
            infoTitle.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            infoDescription.style.transition = 'all 0.6s ease';
            infoDescription.style.opacity = '1';
            infoDescription.style.transform = 'translateY(0)';
        }, 300);
        
        setTimeout(() => {
            infoButton.style.transition = 'all 0.6s ease';
            infoButton.style.opacity = '1';
            infoButton.style.transform = 'translateY(0)';
        }, 500);
        
        // Update current index based on the imgBox
        const index = Array.from(imgBoxes).indexOf(imgBox);
        if (index !== -1) {
            currentIndex = index;
        }
    }

    // Function to smoothly slide item to center
    function slideToCenter(targetIndex) {
        // Calculate the angle needed to bring the target item to the center
        // Each item is positioned at 360deg / 22 = 16.36deg intervals
        const itemAngle = 360 / imgBoxes.length;
        
        // Set target position to 270.12° (Item 18 position)
        const targetPosition = 270.12;
        const targetAngle = -(targetIndex * itemAngle) + targetPosition;
        
        // Apply the rotation to the wheel
        currentRotation = targetAngle;
        iconContainer.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
    }

    // Function to check which item is at the active position (270.12°)
    function checkActiveItemAtPosition() {
        const itemAngle = 360 / imgBoxes.length;
        const targetPosition = 270.12;
        
        // Calculate which item should be at the target position
        for (let i = 0; i < imgBoxes.length; i++) {
            const itemAnglePosition = -(i * itemAngle) + targetPosition;
            const normalizedCurrentRotation = ((currentRotation % 360) + 360) % 360;
            const normalizedItemPosition = ((itemAnglePosition % 360) + 360) % 360;
            
            // Check if this item is close to the target position (within 5 degrees)
            if (Math.abs(normalizedCurrentRotation - normalizedItemPosition) < 5) {
                if (currentIndex !== i) {
                    currentIndex = i;
                    animateInfoChange(imgBoxes[i]);
                }
                break;
            }
        }
    }

    // Function to animate info change with smooth fade-in from bottom
    function animateInfoChange(imgBox) {
        // Remove active class from all boxes
        imgBoxes.forEach(box => box.classList.remove('active'));
        
        // Add active class to current box
        imgBox.classList.add('active');
        
        const title = imgBox.getAttribute('data-title');
        const description = imgBox.getAttribute('data-description');
        const buttonText = imgBox.getAttribute('data-button');
        
        // Fade out current content
        infoTitle.style.opacity = '0';
        infoTitle.style.transform = 'translateY(20px)';
        infoDescription.style.opacity = '0';
        infoDescription.style.transform = 'translateY(20px)';
        infoButton.style.opacity = '0';
        infoButton.style.transform = 'translateY(20px)';
        
        // Update content after fade out
        setTimeout(() => {
            infoTitle.textContent = title;
            infoDescription.textContent = truncateDescription(description);
            infoButton.textContent = buttonText;
            
            // Fade in new content with staggered timing
            setTimeout(() => {
                infoTitle.style.opacity = '1';
                infoTitle.style.transform = 'translateY(0)';
            }, 50);
            
            setTimeout(() => {
                infoDescription.style.opacity = '1';
                infoDescription.style.transform = 'translateY(0)';
            }, 200);
            
            setTimeout(() => {
                infoButton.style.opacity = '1';
                infoButton.style.transform = 'translateY(0)';
            }, 350);
        }, 300);
    }

    // Function to start auto rotation
    function startAutoRotation() {
        if (isAutoRotating) return;
        
        isAutoRotating = true;
        autoRotateInterval = setInterval(() => {
            currentRotation += autoRotateSpeed;
            iconContainer.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
            checkActiveItemAtPosition();
        }, 20); // Update every 20ms for ultra smooth animation
    }

    // Function to stop auto rotation
    function stopAutoRotation() {
        if (!isAutoRotating) return;
        
        isAutoRotating = false;
        clearInterval(autoRotateInterval);
    }

    // Function to navigate to next item
    function goToNext() {
        currentIndex = (currentIndex + 1) % imgBoxes.length;
        const nextImgBox = imgBoxes[currentIndex];
        animateInfoChange(nextImgBox);
        
        // Calculate the target rotation for this item
        const itemAngle = 360 / imgBoxes.length;
        const targetPosition = 270.12;
        const targetAngle = -(currentIndex * itemAngle) + targetPosition;
        
        // Smoothly animate to the target position
        currentRotation = targetAngle;
        iconContainer.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        
        updateNavigationButtons();
    }

    // Function to navigate to previous item
    function goToPrevious() {
        currentIndex = (currentIndex - 1 + imgBoxes.length) % imgBoxes.length;
        const prevImgBox = imgBoxes[currentIndex];
        animateInfoChange(prevImgBox);
        
        // Calculate the target rotation for this item
        const itemAngle = 360 / imgBoxes.length;
        const targetPosition = 270.12;
        const targetAngle = -(currentIndex * itemAngle) + targetPosition;
        
        // Smoothly animate to the target position
        currentRotation = targetAngle;
        iconContainer.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        
        updateNavigationButtons();
    }

    // Function to update navigation button states
    function updateNavigationButtons() {
        // For circular navigation, buttons are always enabled
        // But you can add specific logic here if needed
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }

    // Set first image as active by default
    const firstImgBox = document.querySelector('.imgBx[style*="--i:1"]');
    if (firstImgBox) {
        animateInfoChange(firstImgBox);
        currentIndex = 0;
        // Don't call slideToCenter here, let auto rotation handle it
        updateNavigationButtons();
    }

    // Start auto rotation immediately when page loads
    startAutoRotation();

    // Trigger initial animations after a short delay
    setTimeout(() => {
        const infoTitle = document.getElementById('info-title');
        const infoDescription = document.getElementById('info-description');
        const infoButton = document.getElementById('info-button');
        
        if (infoTitle && infoDescription && infoButton) {
            infoTitle.style.opacity = '1';
            infoTitle.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                infoDescription.style.opacity = '1';
                infoDescription.style.transform = 'translateY(0)';
            }, 200);
            
            setTimeout(() => {
                infoButton.style.opacity = '1';
                infoButton.style.transform = 'translateY(0)';
            }, 400);
        }
    }, 100);

    // Add click event to each image box
    imgBoxes.forEach((imgBox, index) => {
        imgBox.addEventListener('click', function(e) {
            stopAutoRotation(); // Stop auto rotation when user clicks
            animateInfoChange(this);
            currentIndex = index;
            
            // Calculate the target rotation for this item
            const itemAngle = 360 / imgBoxes.length;
            const targetPosition = 270.12;
            const targetAngle = -(index * itemAngle) + targetPosition;
            
            // Smoothly animate to the target position
            currentRotation = targetAngle;
            iconContainer.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
            
            updateNavigationButtons();
            e.stopPropagation();
            
            // Resume auto rotation after 5 seconds
            setTimeout(() => {
                startAutoRotation();
            }, 5000);
        });
    });

    // Add event listeners for navigation buttons
    nextBtn.addEventListener('click', () => {
        stopAutoRotation(); // Stop auto rotation when user navigates
        goToNext();
        // Resume auto rotation after 3 seconds
        setTimeout(() => {
            startAutoRotation();
        }, 3000);
    });
    
    prevBtn.addEventListener('click', () => {
        stopAutoRotation(); // Stop auto rotation when user navigates
        goToPrevious();
        // Resume auto rotation after 3 seconds
        setTimeout(() => {
            startAutoRotation();
        }, 3000);
    });



    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            stopAutoRotation(); // Stop auto rotation when user uses keyboard
            goToNext();
            // Resume auto rotation after 3 seconds
            setTimeout(() => {
                startAutoRotation();
            }, 3000);
        } else if (e.key === 'ArrowLeft') {
            stopAutoRotation(); // Stop auto rotation when user uses keyboard
            goToPrevious();
            // Resume auto rotation after 3 seconds
            setTimeout(() => {
                startAutoRotation();
            }, 3000);
        }
    });

    // Handle window resize to update descriptions
    window.addEventListener('resize', function() {
        // Update current description when screen size changes
        if (imgBoxes[currentIndex]) {
            const currentImgBox = imgBoxes[currentIndex];
            const description = currentImgBox.getAttribute('data-description');
            infoDescription.textContent = truncateDescription(description);
        }
    });
});