#!/usr/bin/env node

/**
 * GitHub Project Sync Script
 * Automatically fetches repository data and updates projects.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    username: 'miqdad-dev',
    outputFile: 'projects.json',
    githubApiUrl: 'https://api.github.com',
    excludeForks: true,
    minStars: 0, // Minimum stars to include project
    excludeRepos: ['Portfolio'], // Repos to exclude
};

// GitHub API request helper
function githubRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: endpoint,
            method: 'GET',
            headers: {
                'User-Agent': 'Portfolio-Sync-Script',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error(`JSON parse error: ${error.message}`));
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        req.end();
    });
}

// Detect technology stack from repository data
function detectTechStack(repo, repoDetails = null) {
    const techStack = new Set();
    
    // Primary language
    if (repo.language) {
        techStack.add(repo.language);
    }

    // Add additional technologies based on repository name and description
    const repoText = `${repo.name} ${repo.description || ''}`.toLowerCase();
    
    // Framework detection
    const frameworkMap = {
        'react': 'React',
        'vue': 'Vue.js',
        'angular': 'Angular',
        'express': 'Express.js',
        'fastapi': 'FastAPI',
        'flask': 'Flask',
        'django': 'Django',
        'spring': 'Spring Boot',
        'nextjs': 'Next.js',
        'nuxt': 'Nuxt.js',
        'gatsby': 'Gatsby',
        'svelte': 'Svelte',
        'tailwind': 'TailwindCSS',
        'bootstrap': 'Bootstrap',
        'jquery': 'jQuery',
        'tensorflow': 'TensorFlow',
        'pytorch': 'PyTorch',
        'scikit': 'Scikit-learn',
        'pandas': 'Pandas',
        'numpy': 'NumPy',
        'mysql': 'MySQL',
        'postgresql': 'PostgreSQL',
        'mongodb': 'MongoDB',
        'redis': 'Redis',
        'docker': 'Docker',
        'kubernetes': 'Kubernetes',
        'aws': 'AWS',
        'azure': 'Azure',
        'gcp': 'Google Cloud',
        'firebase': 'Firebase',
        'api': 'REST API',
        'graphql': 'GraphQL',
        'websocket': 'WebSocket',
        'etl': 'ETL',
        'ml': 'Machine Learning',
        'ai': 'Artificial Intelligence',
        'data': 'Data Science',
        'analytics': 'Analytics',
        'dashboard': 'Dashboard',
        'scraper': 'Web Scraping',
        'bot': 'Bot/Automation',
        'blockchain': 'Blockchain',
        'crypto': 'Cryptocurrency'
    };

    Object.entries(frameworkMap).forEach(([key, value]) => {
        if (repoText.includes(key)) {
            techStack.add(value);
        }
    });

    // Add topics as technologies
    if (repo.topics && repo.topics.length > 0) {
        repo.topics.forEach(topic => {
            const formatted = topic.charAt(0).toUpperCase() + topic.slice(1);
            techStack.add(formatted);
        });
    }

    return Array.from(techStack).slice(0, 5); // Limit to 5 technologies
}

// Detect demo URL from repository
async function detectDemoUrl(repo) {
    // Check homepage field first
    if (repo.homepage) {
        return repo.homepage;
    }

    // Check GitHub Pages URL pattern
    const githubPagesUrl = `https://${CONFIG.username}.github.io/${repo.name}/`;
    
    // For now, return null - in a full implementation, we could make HTTP requests to check if URLs are valid
    return null;
}

// Get repository details including README for better tech detection
async function getRepositoryDetails(repoName) {
    try {
        // Could fetch README.md content for more detailed tech stack detection
        // For now, return null to keep it simple
        return null;
    } catch (error) {
        console.warn(`Could not fetch details for ${repoName}:`, error.message);
        return null;
    }
}

// Transform repository data to project format
async function transformToProject(repo) {
    const repoDetails = await getRepositoryDetails(repo.name);
    const techStack = detectTechStack(repo, repoDetails);
    const demoUrl = await detectDemoUrl(repo);

    return {
        id: repo.id,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || `${repo.language || 'Software'} project with ${techStack.slice(0, 2).join(' and ')}`,
        tech: techStack,
        github: repo.html_url,
        demo: demoUrl,
        language: repo.language,
        stars: repo.stargazers_count,
        topics: repo.topics || [],
        created: repo.created_at,
        updated: repo.updated_at,
        featured: repo.stargazers_count >= 1 || repo.topics.includes('featured') // Mark as featured if has stars or 'featured' topic
    };
}

// Main sync function
async function syncProjects() {
    console.log('🔄 Syncing projects from GitHub...');
    
    try {
        // Fetch repositories
        console.log(`📡 Fetching repositories for ${CONFIG.username}...`);
        const repos = await githubRequest(`/users/${CONFIG.username}/repos?per_page=100&sort=updated`);
        
        if (!Array.isArray(repos)) {
            throw new Error('Invalid response from GitHub API');
        }

        console.log(`📦 Found ${repos.length} repositories`);

        // Filter repositories
        const filteredRepos = repos.filter(repo => {
            return !repo.fork && // Exclude forks
                   !CONFIG.excludeRepos.includes(repo.name) && // Exclude specific repos
                   repo.stargazers_count >= CONFIG.minStars; // Minimum stars filter
        });

        console.log(`✅ Filtered to ${filteredRepos.length} repositories`);

        // Transform repositories to project format
        const projects = [];
        for (const repo of filteredRepos) {
            console.log(`🔍 Processing: ${repo.name}`);
            try {
                const project = await transformToProject(repo);
                projects.push(project);
            } catch (error) {
                console.warn(`⚠️  Error processing ${repo.name}:`, error.message);
            }
        }

        // Sort projects by stars (desc) and update date
        projects.sort((a, b) => {
            if (a.stars !== b.stars) return b.stars - a.stars;
            return new Date(b.updated) - new Date(a.updated);
        });

        // Create projects.json structure
        const projectsData = {
            lastUpdated: new Date().toISOString(),
            totalProjects: projects.length,
            projects: projects
        };

        // Write to file
        const outputPath = path.join(process.cwd(), CONFIG.outputFile);
        fs.writeFileSync(outputPath, JSON.stringify(projectsData, null, 2));
        
        console.log(`✨ Successfully updated ${CONFIG.outputFile}`);
        console.log(`📊 Total projects: ${projects.length}`);
        console.log(`⭐ Featured projects: ${projects.filter(p => p.featured).length}`);
        
        // Log project summary
        console.log('\n📋 Projects Summary:');
        projects.forEach(project => {
            console.log(`  • ${project.title} (${project.tech.slice(0, 3).join(', ')}) ${project.featured ? '⭐' : ''}`);
        });

    } catch (error) {
        console.error('❌ Error syncing projects:', error.message);
        process.exit(1);
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
GitHub Project Sync Tool

Usage:
  node sync-projects.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Show what would be synced without writing files
  --verbose, -v  Show detailed output

Examples:
  node sync-projects.js              # Sync projects
  node sync-projects.js --dry-run    # Preview changes
        `);
        process.exit(0);
    }

    if (args.includes('--dry-run')) {
        console.log('🧪 Dry run mode - no files will be written');
        // Add dry run logic here
    }

    syncProjects();
}

module.exports = { syncProjects, detectTechStack, transformToProject };