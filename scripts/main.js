// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize dark mode based on user preference or system preference
    const initDarkMode = () => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Initialize dark mode on load
    initDarkMode();

    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            
            // Save preference to localStorage
            if (document.documentElement.classList.contains('dark')) {
                localStorage.theme = 'dark';
            } else {
                localStorage.theme = 'light';
            }
        });
    }

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Sticky Navigation with Scroll Effect
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background opacity based on scroll position
        if (currentScroll > 50) {
            navbar.classList.add('bg-white/95', 'dark:bg-gray-900/95', 'shadow-lg');
            navbar.classList.remove('bg-white/80', 'dark:bg-gray-900/80');
        } else {
            navbar.classList.add('bg-white/80', 'dark:bg-gray-900/80');
            navbar.classList.remove('bg-white/95', 'dark:bg-gray-900/95', 'shadow-lg');
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Navigation Link Highlighting
    const updateActiveNavLink = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-primary', 'dark:text-primary');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-primary', 'dark:text-primary');
            }
        });
    };

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call

    // Fade-in Animation on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements with fade-in animation
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));

    // Typing Effect for Hero Text (Optional Enhancement)
    const typeWriter = (element, text, speed = 100) => {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    };

    // Add hover effects for buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Parallax Effect for Hero Section (Subtle)
    const hero = document.getElementById('home');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        const animatedElements = document.querySelectorAll('.animate-fade-in');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });

    // Smooth page loading
    const pageTransition = () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    };

    // Add custom cursor effect (optional)
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    const throttleScroll = (fn) => {
        return function() {
            if (!ticking) {
                requestAnimationFrame(fn);
                ticking = true;
            }
        };
    };

    // Apply throttling to scroll handlers
    window.addEventListener('scroll', throttleScroll(() => {
        ticking = false;
        // Scroll handlers go here
    }));

    // Load and display project preview
    loadProjectsPreview();

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Skill bar animations
    animateSkillBars();

    console.log('🚀 Orione.uk website loaded successfully!');
});

// Load projects preview for homepage (top 3 projects)
async function loadProjectsPreview() {
    try {
        const response = await fetch('./projects.json');
        const data = await response.json();
        const topProjects = data.projects.slice(0, 3);
        displayProjectsPreview(topProjects);
        
        // Update project count
        const projectCountElement = document.getElementById('projectCount');
        if (projectCountElement) {
            projectCountElement.textContent = `${data.totalProjects}+`;
        }
    } catch (error) {
        console.error('Error loading projects preview:', error);
        // Fallback to hardcoded projects if JSON fails
        displayFallbackProjectsPreview();
    }
}

// Display premium project preview on homepage
function displayProjectsPreview(projects) {
    const projectsContainer = document.getElementById('projectsPreview');
    if (!projectsContainer) return;

    projectsContainer.innerHTML = projects.map((project, index) => `
        <div class="group relative animate-on-scroll" style="animation-delay: ${index * 0.2}s;">
            <!-- Premium Card Container -->
            <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-gray-200/50 dark:border-gray-700/50">
                
                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
                
                <!-- Project Header -->
                <div class="relative h-32 bg-gradient-to-br ${getProjectGradient(project)} flex items-center justify-center text-white overflow-hidden">
                    <!-- Animated Pattern -->
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M15 15m-4 0a4 4 0 1 1 8 0a4 4 0 1 1 -8 0"/%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
                    </div>
                    
                    <!-- Content -->
                    <div class="relative z-10 text-center group-hover:scale-110 transition-transform duration-300">
                        <div class="text-lg font-bold mb-1">${project.title}</div>
                        <div class="text-sm opacity-90">${project.language || 'Multi-tech'}</div>
                    </div>
                    
                    <!-- Corner Decoration -->
                    <div class="absolute top-3 right-3 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                </div>
                
                <!-- Premium Content -->
                <div class="relative p-6 space-y-4">
                    <!-- Project Title -->
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                        ${project.title}
                    </h3>
                    
                    <!-- Description -->
                    <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                        ${project.description}
                    </p>
                    
                    <!-- Tech Stack -->
                    <div class="flex flex-wrap gap-1.5">
                        ${(project.tech || project.technologies || []).slice(0, 3).map(tech => `
                            <span class="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg border border-blue-200/50 dark:border-blue-500/20">
                                ${tech}
                            </span>
                        `).join('')}
                        ${((project.tech || project.technologies || []).length > 3) ? `
                            <span class="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-lg">
                                +${(project.tech || project.technologies).length - 3}
                            </span>
                        ` : ''}
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex space-x-2 pt-2">
                        <a href="${project.github || project.githubUrl}" target="_blank" rel="noopener noreferrer" 
                           class="flex-1 group/btn bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            <svg class="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span>Code</span>
                        </a>
                        ${(project.demo || project.liveUrl) ? `
                            <a href="${project.demo || project.liveUrl}" target="_blank" rel="noopener noreferrer" 
                               class="flex-1 group/btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                <svg class="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                                <span>Demo</span>
                            </a>
                        ` : `
                            <div class="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-3 py-2.5 rounded-xl text-xs font-semibold text-center opacity-50">
                                Soon
                            </div>
                        `}
                    </div>
                </div>
                
                <!-- Hover Glow Effect -->
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
        </div>
    `).join('');

    // Trigger animations for project cards
    setTimeout(() => {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-slide-up');
            }, index * 200);
        });
    }, 500);
}

// Fallback projects preview if JSON loading fails
function displayFallbackProjectsPreview() {
    const fallbackProjects = [
        {
            title: "Spark ML Projects",
            description: "Apache Spark ML projects – from feature extraction to model pipelines using structured streaming",
            tech: ["Jupyter Notebook", "Machine Learning"],
            github: "https://github.com/miqdad-dev/spark-ml-projects",
            demo: null
        },
        {
            title: "ETL Dashboard For Tech Jobs",
            description: "Python project with Python and ETL",
            tech: ["Python", "ETL", "Dashboard"],
            github: "https://github.com/miqdad-dev/ETL-dashboard-for-tech-jobs",
            demo: null
        },
        {
            title: "Bank MarketCap ETL",
            description: "Bank Market Capitalization ETL Project",
            tech: ["Python", "REST API", "ETL"],
            github: "https://github.com/miqdad-dev/Bank-MarketCap-ETL",
            demo: null
        }
    ];
    
    displayProjectsPreview(fallbackProjects);
}

// Get project gradient based on primary tech (for homepage)
function getProjectGradient(project) {
    const primaryTech = project.language || (project.tech && project.tech[0]) || '';
    
    const gradients = {
        'Python': 'from-blue-500 to-blue-700',
        'JavaScript': 'from-yellow-500 to-orange-600', 
        'TypeScript': 'from-blue-600 to-indigo-700',
        'Jupyter Notebook': 'from-orange-400 to-yellow-500',
        'Java': 'from-red-500 to-orange-600',
        'C++': 'from-purple-500 to-purple-700',
        'Go': 'from-cyan-500 to-teal-600',
        'Ruby': 'from-red-500 to-pink-600',
        'PHP': 'from-purple-600 to-indigo-700',
        'Swift': 'from-orange-400 to-orange-600',
        default: 'from-blue-500 to-purple-600'
    };
    
    return gradients[primaryTech] || gradients.default;
}

// Contact form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <span>Sending...</span>
    `;
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Reset form
        e.target.reset();
        
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const animateBar = (bar) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-out';
            bar.style.width = targetWidth;
        }, 500);
    };

    // Use Intersection Observer to animate when skills section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-bar');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => animateBar(bar), index * 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skillsSection = document.querySelector('#about .space-y-4');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// Enhanced scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                
                // Add stagger effect for timeline items
                if (entry.target.classList.contains('animate-on-scroll')) {
                    const siblings = entry.target.parentNode.querySelectorAll('.animate-on-scroll');
                    const index = Array.from(siblings).indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);