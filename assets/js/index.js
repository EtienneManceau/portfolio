
// CV
document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const url = this.href;
        const win = window.open(url, '_blank');
        if (win) {
            const a = win.document.createElement('a');
            a.href = url;
            a.download = '';
            win.document.body.appendChild(a);
            a.click();
            win.close();
        }
    });
});

document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').replace('#', '');
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

function setupMarquee(selector, direction = 'left', speed = 3) {
    const marquee = document.querySelector(selector);
    if (!marquee) return;
    const spans = marquee.querySelectorAll('span');
    if (spans.length < 2) return;

    let marqueeWidth = marquee.offsetWidth;
    let span1 = spans[0];
    let span2 = spans[1];

    span1.style.position = 'absolute';
    span2.style.position = 'absolute';

    function resetPositions() {
        if (direction === 'left') {
            span1.style.left = marqueeWidth + 'px';
            span2.style.left = (marqueeWidth + span1.offsetWidth) + 'px';
        } else {
            span1.style.left = '0px';
            span2.style.left = span1.offsetWidth + 'px';
        }
    }

    function animate() {
        let left1 = parseFloat(span1.style.left || (direction === 'left' ? marqueeWidth : 0));
        let left2 = parseFloat(span2.style.left || (direction === 'left' ? (marqueeWidth + span1.offsetWidth) : span1.offsetWidth));

        if (direction === 'left') {
            left1 -= speed;
            left2 -= speed;

            if (left1 <= -span1.offsetWidth) left1 = left2 + span2.offsetWidth;
            if (left2 <= -span2.offsetWidth) left2 = left1 + span1.offsetWidth;
        } else {
            left1 += speed;
            left2 += speed;

            if (left1 >= marqueeWidth) left1 = left2 - span1.offsetWidth;
            if (left2 >= marqueeWidth) left2 = left1 - span2.offsetWidth;
        }

        span1.style.left = left1 + 'px';
        span2.style.left = left2 + 'px';

        requestAnimationFrame(animate);
    }

    function onResize() {
        marqueeWidth = marquee.offsetWidth;
        resetPositions();
    }

    window.addEventListener('load', function () {
        resetPositions();
        animate();
    });
    window.addEventListener('resize', onResize);
}

// Setup marquees
setupMarquee('.quote-marquee', 'right', 3);
setupMarquee('.quote-marquee2', 'left', 3);

// Infinite scroll effect for each .infinite-scroll
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.infinite-scroll').forEach(function (category) {
        const scrollList = category.querySelector('.scroll-list ul');
        const direction = category.getAttribute('data-direction');
        const listItems = Array.from(scrollList.children);
        const itemCount = listItems.length;

        // Duplicate list for seamless scroll
        const clone = scrollList.cloneNode(true);
        scrollList.parentNode.appendChild(clone);

        let pos = 0;
        let animationFrame;
        const itemHeight = listItems[0].offsetHeight + parseFloat(getComputedStyle(listItems[0]).marginBottom || 0);

        function animate() {
            if (direction === 'down') {
                pos += 0.5;
                if (pos >= itemHeight * itemCount) pos = 0;
                scrollList.parentNode.scrollTop = pos;
            } else {
                pos -= 0.5;
                if (pos <= 0) pos = itemHeight * itemCount;
                scrollList.parentNode.scrollTop = pos;
            }
            animationFrame = requestAnimationFrame(animate);
        }

        // Set scroll-list height for smoothness
        scrollList.parentNode.scrollTop = direction === 'down' ? 0 : itemHeight * itemCount;
        scrollList.parentNode.addEventListener('mouseenter', () => cancelAnimationFrame(animationFrame));
        scrollList.parentNode.addEventListener('mouseleave', () => animate());
        animate();
    });

    // Blur other categories and shine icons on hover
    const categories = document.querySelectorAll('.tech-category');
    categories.forEach(cat => {
        const scrollList = cat.querySelector('.scroll-list');
        scrollList.addEventListener('mouseenter', function () {
            categories.forEach(other => {
                if (other !== cat) {
                    other.classList.add('blurred');
                }
            });
            scrollList.classList.add('shine-icons');
        });
        scrollList.addEventListener('mouseleave', function () {
            categories.forEach(other => {
                other.classList.remove('blurred');
            });
            scrollList.classList.remove('shine-icons');
        });
    });
});

const demoBtn = document.getElementById('show-demo-btn');
const demoNav = document.getElementById('demo');
const videos = demoNav.querySelectorAll('video');
let loaded = false;

demoBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const isHidden = !demoNav.classList.contains('showing');
    // Animate button
    demoBtn.classList.remove('animated');
    void demoBtn.offsetWidth; // force reflow
    demoBtn.classList.add('animated');

    if (isHidden) {
        demoNav.style.display = 'block';
        setTimeout(() => {
            demoNav.classList.add('showing');
        }, 10);
        // Lazy load videos only when shown
        if (!loaded) {
            videos.forEach(video => {
                if (video.getAttribute('src')) {
                    video.load();
                }
            });
            loaded = true;
        }
        videos.forEach(video => {
            video.currentTime = 0;
            video.play();
        });
    } else {
        demoNav.classList.remove('showing');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
        // Wait for transition to finish before hiding
        setTimeout(() => {
            if (!demoNav.classList.contains('showing')) {
                demoNav.style.display = 'none';
            }
        }, 700);
    }
});

// Carousel scrolling and arrows
function initCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('.carousel-images img');
    const leftArrow = carousel.querySelector('.carousel-arrow.left');
    const rightArrow = carousel.querySelector('.carousel-arrow.right');
    const leftArea = carousel.querySelector('.carousel-click-area.left');
    const rightArea = carousel.querySelector('.carousel-click-area.right');
    let current = 0;
    let intervalId = null;

    const showSlide = (index) => images.forEach((img, i) => img.classList.toggle('active', i === index));
    const nextSlide = () => { current = (current + 1) % images.length; showSlide(current); };
    const prevSlide = () => { current = (current - 1 + images.length) % images.length; showSlide(current); };
    const startAutoScroll = () => { if (!intervalId) intervalId = setInterval(nextSlide, 2500); };
    const stopAutoScroll = () => { clearInterval(intervalId); intervalId = null; };

    carousel.addEventListener('mouseenter', () => { stopAutoScroll(); carousel.classList.add('hovering'); });
    carousel.addEventListener('mouseleave', () => { startAutoScroll(); carousel.classList.remove('hovering'); });

    const handleArrowClick = (callback, arrow) => (e) => {
        e.stopPropagation();
        arrow.classList.add('active');
        setTimeout(() => arrow.classList.remove('active'), 180);
        callback();
    };

    leftArrow.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });
    rightArrow.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
    leftArea.addEventListener('click', handleArrowClick(prevSlide, leftArrow));
    rightArea.addEventListener('click', handleArrowClick(nextSlide, rightArrow));

    startAutoScroll();
}

['sopra-carousel', 'serverless-carousel', 'k-elektronik-carousel'].forEach(initCarousel);
