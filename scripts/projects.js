// Projects Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize dark mode
    initDarkMode();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize navbar scroll effects
    initNavbarEffects();
    
    // Load and display projects
    loadProjects();
    
    // Initialize search and filter functionality
    initSearchAndFilter();
    
    console.log('📁 Projects page loaded successfully!');
});

// Dark Mode Functionality
function initDarkMode() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        });
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Navbar Scroll Effects
function initNavbarEffects() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 50) {
            navbar.classList.add('bg-white/95', 'dark:bg-gray-900/95', 'shadow-lg');
            navbar.classList.remove('bg-white/80', 'dark:bg-gray-900/80');
        } else {
            navbar.classList.add('bg-white/80', 'dark:bg-gray-900/80');
            navbar.classList.remove('bg-white/95', 'dark:bg-gray-900/95', 'shadow-lg');
        }

        if (currentScroll > lastScrollTop && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}

// Global variables for projects data
let allProjects = [];
let filteredProjects = [];
let currentFilter = 'all';
let currentSort = 'updated';

// Load projects from JSON file
async function loadProjects() {
    try {
        showLoadingState();
        
        const response = await fetch('./projects.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        allProjects = data.projects || [];
        
        updateProjectStats(data);
        applyFilterAndSort();
        
    } catch (error) {
        console.error('Error loading projects:', error);
        showErrorState();
    }
}

// Update project statistics
function updateProjectStats(data) {
    const totalProjects = data.totalProjects || allProjects.length;
    const technologies = new Set();
    
    allProjects.forEach(project => {
        project.tech.forEach(tech => technologies.add(tech));
    });
    
    const lastUpdatedDate = new Date(data.lastUpdated).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
    
    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('techCount').textContent = technologies.size;
    document.getElementById('lastUpdated').textContent = lastUpdatedDate;
}

// Apply current filter and sort
function applyFilterAndSort() {
    // Filter projects
    if (currentFilter === 'all') {
        filteredProjects = [...allProjects];
    } else {
        filteredProjects = allProjects.filter(project => 
            project.tech.includes(currentFilter) || 
            project.language === currentFilter ||
            project.title.toLowerCase().includes(currentFilter.toLowerCase())
        );
    }
    
    // Sort projects
    filteredProjects.sort((a, b) => {
        switch (currentSort) {
            case 'created':
                return new Date(b.created) - new Date(a.created);
            case 'name':
                return a.title.localeCompare(b.title);
            case 'stars':
                return b.stars - a.stars;
            case 'updated':
            default:
                return new Date(b.updated) - new Date(a.updated);
        }
    });
    
    displayProjects(filteredProjects);
}

// Display projects in the grid
function displayProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    const loadingState = document.getElementById('loadingState');
    const noResults = document.getElementById('noResults');
    
    loadingState.classList.add('hidden');
    
    if (projects.length === 0) {
        projectsGrid.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    projectsGrid.classList.remove('hidden');
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="group relative">
            <!-- Gradient Border -->
            <div class="gradient-border">
                <div class="gradient-border-content p-0 overflow-hidden">
                    <div class="premium-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-fade-in">
                        <!-- Premium Project Header -->
                        <div class="relative h-40 bg-gradient-to-br ${getProjectGradient(project)} flex items-center justify-center text-white overflow-hidden">
                            <!-- Animated Background Pattern -->
                            <div class="absolute inset-0 opacity-20">
                                <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M20 20c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20zm0 0c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z"/%3E%3C/g%3E%3C/svg%3E')]"></div>
                            </div>
                            
                            <!-- Content -->
                            <div class="relative z-10 text-center group-hover:scale-110 transition-transform duration-300">
                                <div class="text-xl font-bold mb-1">${project.title}</div>
                                <div class="text-sm opacity-90 font-medium">${project.language || 'Software'}</div>
                                <div class="mt-2 w-12 h-0.5 bg-white/50 mx-auto rounded-full"></div>
                            </div>
                            
                            <!-- Featured Badge -->
                            ${project.featured ? '<div class="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">✨ Featured</div>' : ''}
                            ${project.stars > 0 ? `<div class="absolute top-4 left-4 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>${project.stars}</div>` : ''}
                        </div>
            
                        
                        <!-- Premium Project Content -->
                        <div class="p-6 space-y-4">
                            <!-- Meta Information -->
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-500 dark:text-gray-400 font-medium">${formatDate(project.updated)}</span>
                            </div>
                            
                            <!-- Project Title -->
                            <h3 class="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                                ${project.title}
                            </h3>
                            
                            <!-- Project Description -->
                            <p class="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                                ${project.description}
                            </p>
                            
                            <!-- Premium Tech Stack -->
                            <div class="flex flex-wrap gap-2">
                                ${project.tech.slice(0, 3).map(tech => `
                                    <span class="tech-badge px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 rounded-lg">
                                        ${tech}
                                    </span>
                                `).join('')}
                                ${project.tech.length > 3 ? `
                                    <span class="tech-badge px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 rounded-lg">
                                        +${project.tech.length - 3} more
                                    </span>
                                ` : ''}
                            </div>
                            
                            <!-- Premium Action Buttons -->
                            <div class="flex space-x-3 pt-2">
                                <a href="${project.github}" target="_blank" rel="noopener noreferrer" 
                                   class="flex-1 group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    <svg class="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    <span>GitHub</span>
                                </a>
                                ${project.demo ? `
                                    <a href="${project.demo}" target="_blank" rel="noopener noreferrer" 
                                       class="flex-1 group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                        </svg>
                                        <span>Live Demo</span>
                                    </a>
                                ` : `
                                    <div class="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-3 rounded-xl text-sm font-semibold text-center cursor-not-allowed opacity-50">
                                        Coming Soon
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add entrance animations with stagger
    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
    });
}

// Get project gradient based on primary tech
function getProjectGradient(project) {
    const primaryTech = project.language || project.tech[0] || '';
    
    const gradients = {
        'Python': 'from-blue-500 to-blue-700',
        'JavaScript': 'from-yellow-500 to-orange-600',
        'TypeScript': 'from-blue-600 to-indigo-700',
        'React': 'from-cyan-400 to-blue-600',
        'Vue': 'from-green-400 to-green-600',
        'Angular': 'from-red-500 to-red-700',
        'Node.js': 'from-green-500 to-green-700',
        'Java': 'from-orange-500 to-red-600',
        'C++': 'from-purple-500 to-purple-700',
        'Go': 'from-cyan-500 to-teal-600',
        'Rust': 'from-orange-600 to-red-700',
        'PHP': 'from-purple-600 to-indigo-700',
        'Ruby': 'from-red-500 to-pink-600',
        'Swift': 'from-orange-400 to-orange-600',
        'Kotlin': 'from-purple-500 to-indigo-600',
        'Jupyter Notebook': 'from-orange-400 to-yellow-500',
        default: 'from-gray-500 to-gray-700'
    };
    
    return gradients[primaryTech] || gradients.default;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 30) return `${diffDays} days ago`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

// Initialize search and filter functionality
function initSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm === '') {
                applyFilterAndSort();
            } else {
                const searchResults = allProjects.filter(project => 
                    project.title.toLowerCase().includes(searchTerm) ||
                    project.description.toLowerCase().includes(searchTerm) ||
                    project.tech.some(tech => tech.toLowerCase().includes(searchTerm)) ||
                    (project.language && project.language.toLowerCase().includes(searchTerm))
                );
                displayProjects(searchResults);
            }
        }, 300));
    }
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFilterAndSort();
        });
    }
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            });
            
            button.classList.add('active', 'bg-blue-600', 'text-white');
            button.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            
            // Apply filter
            currentFilter = button.dataset.filter;
            searchInput.value = ''; // Clear search when filtering
            applyFilterAndSort();
        });
    });
}

// Show loading state
function showLoadingState() {
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('projectsGrid').classList.add('hidden');
    document.getElementById('noResults').classList.add('hidden');
}

// Show error state
function showErrorState() {
    const loadingState = document.getElementById('loadingState');
    loadingState.innerHTML = `
        <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Error loading projects</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Please try refreshing the page.</p>
            <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Retry
            </button>
        </div>
    `;
}

// Utility function: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}