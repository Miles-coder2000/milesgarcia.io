document.addEventListener('DOMContentLoaded', () => {
    /* --- Mobile Menu Toggle --- */
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    });

    /* --- Sticky Header & Active Nav Links --- */
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');

    window.addEventListener('scroll', () => {
        // Sticky Header
        header.classList.toggle('sticky', window.scrollY > 100);

        // Active Nav Links
        let top = window.scrollY;
        sections.forEach(sec => {
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if(top >= offset && top < offset + height) {
                navLinks.forEach(links => {
                    links.classList.remove('active');
                    document.querySelector(`header nav a[href*='${id}']`).classList.add('active');
                });
            }
        });

        // Close menu on scroll
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });

    /* --- Dark/Light Mode Toggle --- */
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // Check Local Storage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if(theme === 'dark') {
            themeIcon.className = 'bx bx-sun'; // Show sun to toggle to light
        } else {
            themeIcon.className = 'bx bx-moon'; // Show moon to toggle to dark
        }
    }

    /* --- Typewriter Effect --- */
    const textSpan = document.querySelector('.text-animation span');
    const words = ['Full Stack Developer', 'Creative Designer', 'Problem Solver'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(typeWriter, typeSpeed);
    }
    typeWriter();

    /* --- Chart.js Initialization --- */
    const ctx = document.getElementById('skillsChart').getContext('2d');
    const isDarkMode = htmlElement.getAttribute('data-theme') === 'dark';
    const textColor = isDarkMode ? '#ededed' : '#1a1a1a';
    const mainColor = '#00abf0';

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'UI/UX'],
            datasets: [{
                label: 'Skill Proficiency',
                data: [95, 90, 85, 80, 75, 85],
                backgroundColor: 'rgba(0, 171, 240, 0.2)',
                borderColor: mainColor,
                pointBackgroundColor: mainColor,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: mainColor
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(128, 128, 128, 0.2)' },
                    grid: { color: 'rgba(128, 128, 128, 0.2)' },
                    pointLabels: {
                        color: textColor,
                        font: { family: 'Poppins', size: 14 }
                    },
                    ticks: {
                        display: false, // Hide numeric values on rings
                        min: 0,
                        max: 100
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    /* --- Fetch Projects and Modal Logic --- */
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');

    let allProjects = [];

    // Fetch data
    fetch('assets/projects.json')
        .then(response => response.json())
        .then(data => {
            allProjects = data;
            renderProjects(allProjects);
        })
        .catch(err => console.error('Error fetching projects:', err));

    function renderProjects(projects) {
        portfolioGrid.innerHTML = ''; // Clear current
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'portfolio-card';
            card.setAttribute('data-category', project.category);
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="portfolio-layer">
                    <h4>${project.title}</h4>
                    <p>${project.tech.join(' • ')}</p>
                    <i class='bx bx-link-external'></i>
                </div>
            `;
            // Add click listener for modal
            card.addEventListener('click', () => openModal(project));
            portfolioGrid.appendChild(card);
        });
    }

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to current
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            
            if (filterValue === 'all') {
                renderProjects(allProjects);
            } else {
                const filtered = allProjects.filter(p => p.category === filterValue);
                renderProjects(filtered);
            }
        });
    });

    // Modal Logic
    function openModal(project) {
        const techSpans = project.tech.map(t => `<span>${t}</span>`).join('');
        modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <img src="${project.image}" alt="${project.title}" class="modal-body-img">
            <p>${project.description}</p>
            <div class="modal-tech-list">
                ${techSpans}
            </div>
            <div class="modal-buttons">
                <a href="${project.previewLink}" target="_blank" class="btn">Live Preview</a>
                <a href="${project.sourceLink}" target="_blank" class="btn">Source Code</a>
            </div>
        `;
        modal.style.display = 'flex';
        // Simple animation trigger
        setTimeout(() => modal.querySelector('.modal-content').style.opacity = '1', 10);
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    /* --- GSAP Animations --- */
    gsap.registerPlugin(ScrollTrigger);

    // Fade in sections
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out"
        });
    });

});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    });
}
