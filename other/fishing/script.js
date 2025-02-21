document.addEventListener('DOMContentLoaded', function () {
    const fishImages = document.querySelectorAll('.gallery img');

    fishImages.forEach(img => {
        img.addEventListener('mouseover', function () {
            this.style.transform = 'rotate(' + (Math.random() * 20 - 10) + 'deg)';
        });

        img.addEventListener('mouseout', function () {
            this.style.transform = 'rotate(0deg)';
        });
    });
});