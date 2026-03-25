document.addEventListener('DOMContentLoaded', () => {
    // 1. 導覽列滾動效果
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '1rem 0';
            header.style.background = 'rgba(5, 7, 10, 0.95)';
        } else {
            header.style.padding = '1.5rem 0';
            header.style.background = 'rgba(5, 7, 10, 0.8)';
        }
    });

    // 2. 導覽列活動狀態更新
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. 簡單的進入動畫 (Reveal on scroll)
    const revealElements = document.querySelectorAll('.skill-card, .portfolio-item, .discovery-grid');
    
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            if (el.closest('.swiper-initialized')) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                return;
            }
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // 初始化動畫狀態
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // 初始執行一次

    // 4. 992px 以下改用 Swiper.js, 992px 以上回復 Grid
    const portfolioGrid = document.querySelector('.portfolio-grid');
    let portfolioSwiper = null;

    const createSwiperStructure = () => {
        if (!portfolioGrid || portfolioGrid.classList.contains('swiper-initialized')) return;

        const items = Array.from(portfolioGrid.querySelectorAll('.portfolio-item'));
        items.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.transition = 'none'; // 暫時關閉 transition 避免 Swiper 計算位移出錯
        });

        const wrapper = document.createElement('div');
        wrapper.className = 'swiper-wrapper';

        items.forEach(item => {
            item.classList.add('swiper-slide');
            wrapper.appendChild(item);
        });

        portfolioGrid.innerHTML = '';
        portfolioGrid.classList.add('swiper', 'swiper-initialized');
        portfolioGrid.appendChild(wrapper);

        const prev = document.createElement('div');
        prev.className = 'swiper-button-prev';
        const next = document.createElement('div');
        next.className = 'swiper-button-next';
        const pagination = document.createElement('div');
        pagination.className = 'swiper-pagination';

        portfolioGrid.appendChild(prev);
        portfolioGrid.appendChild(next);
        portfolioGrid.appendChild(pagination);

        portfolioSwiper = new Swiper(portfolioGrid, {
            slidesPerView: 1,
            spaceBetween: 16,
            loop: true,
            observer: true,
            observeParents: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    };

    const itemsInSwiper = portfolioGrid.querySelectorAll('.portfolio-item');
    itemsInSwiper.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    const destroySwiperStructure = () => {
        if (!portfolioGrid || !portfolioGrid.classList.contains('swiper-initialized')) return;

        if (portfolioSwiper) {
            portfolioSwiper.destroy(true, true);
            portfolioSwiper = null;
        }

        const wrapper = portfolioGrid.querySelector('.swiper-wrapper');
        if (!wrapper) return;

        const slides = Array.from(wrapper.children);
        portfolioGrid.innerHTML = '';
        portfolioGrid.classList.remove('swiper', 'swiper-initialized');

        slides.forEach(slide => {
            slide.classList.remove('swiper-slide');
            portfolioGrid.appendChild(slide);
        });

        const prev = portfolioGrid.querySelector('.swiper-button-prev');
        const next = portfolioGrid.querySelector('.swiper-button-next');
        const pagination = portfolioGrid.querySelector('.swiper-pagination');
        [prev, next, pagination].forEach(el => {
            if (el && el.parentNode) el.parentNode.removeChild(el);
        });

        const items = portfolioGrid.querySelectorAll('.portfolio-item');
        items.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
        });

        revealOnScroll();
    };

    const resizeHandler = () => {
        if (window.matchMedia('(max-width: 991.98px)').matches) {
            createSwiperStructure();
        } else {
            destroySwiperStructure();
        }
    };

    window.addEventListener('resize', resizeHandler);
    resizeHandler();
});
