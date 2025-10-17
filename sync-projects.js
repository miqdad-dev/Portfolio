#!/usr/bin/env node

/**
 * GitHub Project Sync Script (fixed)
 * Automatically fetches repository data and updates projects.json
 *
 * Changes made:
 * - Added optional GITHUB_TOKEN support via environment variable for higher rate limits and API access
 * - Improved error handling for non-2xx responses
 * - Implemented getRepositoryDetails to fetch repo info (topics, homepage, has_pages)
 * - Updated detection functions to use repo details
 * - Respect CONFIG.excludeForks toggle and minStars correctly
 * - Added dry-run support
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    username: 'miqdad-dev',
    outputFile: 'projects.json',
    githubApiUrl: 'https://api.github.com',
    excludeForks: true, // honor this flag now
    minStars: 0, // Minimum stars to include project
    excludeRepos: ['Portfolio'], // Repos to exclude
};

const TOKEN = process.env.GITHUB_TOKEN || null;

// GitHub API request helper
function githubRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: endpoint,
            method: 'GET',
            headers: {
                'User-Agent': 'Portfolio-Sync-Script',
                // include the topics preview so repo detail requests include topics
                'Accept': 'application/vnd.github.mercy-preview+json, application/vnd.github.v3+json'
            }
        };

        if (TOKEN) {
            options.headers['Authorization'] = `token ${TOKEN}`;
        }

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Handle non-2xx responses with helpful error
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    let message = data;
                    try {
                        const parsed = JSON.parse(data || '{}');
                        message = parsed.message || JSON.stringify(parsed);
                    } catch (e) {
                        // keep raw data
                    }
                    return reject(new Error(`GitHub API error ${res.statusCode} ${res.statusMessage}: ${message}`));
                }

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

    // Add topics as technologies (prefer repoDetails.topics if available)
    const topics = (repoDetails && Array.isArray(repoDetails.topics)) ? repoDetails.topics : (repo.topics || []);
    if (topics && topics.length > 0) {
        topics.forEach(topic => {
            const formatted = topic.charAt(0).toUpperCase() + topic.slice(1);
            techStack.add(formatted);
        });
    }

    return Array.from(techStack).slice(0, 5); // Limit to 5 technologies
}

// Detect demo URL from repository
async function detectDemoUrl(repo, repoDetails = null) {
    // Check homepage field first (repoDetails preferred)
    if (repoDetails && repoDetails.homepage) {
        return repoDetails.homepage;
    }
    if (repo.homepage) {
        return repo.homepage;
    }

    // If repository has GitHub Pages enabled, return the expected pages URL
    if (repoDetails && repoDetails.has_pages) {
        return `https://${CONFIG.username}.github.io/${repo.name}/`;
    }

    // Otherwise return null
    return null;
}

// Get repository details including README for better tech detection
async function getRepositoryDetails(repoName) {
    try {
        // Fetch full repo details which include topics, homepage, has_pages, etc.
        const details = await githubRequest(`/repos/${CONFIG.username}/${repoName}`);
        return details;
    } catch (error) {
        console.warn(`Could not fetch details for ${repoName}:`, error.message);
        return null;
    }
}

// Transform repository data to project format
async function transformToProject(repo) {
    const repoDetails = await getRepositoryDetails(repo.name);
    const techStack = detectTechStack(repo, repoDetails);
    const demoUrl = await detectDemoUrl(repo, repoDetails);

    return {
        id: repo.id,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || `${repo.language || 'Software'} project with ${techStack.slice(0, 2).join(' and ')}`,
        tech: techStack,
        github: repo.html_url,
        demo: demoUrl,
        language: repo.language,
        stars: repo.stargazers_count,
        topics: (repoDetails && repoDetails.topics) ? repoDetails.topics : (repo.topics || []),
        created: repo.created_at,
        updated: repo.updated_at,
        featured: (repo.stargazers_count >= 1) || ((repoDetails && Array.isArray(repoDetails.topics) && repoDetails.topics.includes('featured')) || (Array.isArray(repo.topics) && repo.topics.includes('featured')))
    };
}

// Main sync function
async function syncProjects(options = {}) {
    const { dryRun = false, verbose = false } = options;
    if (verbose) console.log('🔍 Running in verbose mode');

    console.log('🔄 Syncing projects from GitHub...');
    
    try {
        // Fetch repositories
        console.log(`📡 Fetching repositories for ${CONFIG.username}...`);
        const repos = await githubRequest(`/users/${CONFIG.username}/repos?per_page=100&sort=updated`);
        
        if (!Array.isArray(repos)) {
            throw new Error('Invalid response from GitHub API');
        }

        console.log(`📦 Found ${repos.length} repositories`);

        // Filter repositories (respect CONFIG flags)
        const filteredRepos = repos.filter(repo => {
            if (CONFIG.excludeForks && repo.fork) return false;
            if (CONFIG.excludeRepos.includes(repo.name)) return false;
            if (repo.stargazers_count < CONFIG.minStars) return false;
            return true;
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

        const outputPath = path.join(process.cwd(), CONFIG.outputFile);

        if (dryRun) {
            console.log('🧪 Dry run mode - no files will be written. Here is the preview:');
            console.log(JSON.stringify(projectsData, null, 2));
        } else {
            // Write to file
            fs.writeFileSync(outputPath, JSON.stringify(projectsData, null, 2));
            console.log(`✨ Successfully updated ${CONFIG.outputFile}`);
            console.log(`📊 Total projects: ${projects.length}`);
            console.log(`⭐ Featured projects: ${projects.filter(p => p.featured).length}`);
            
            // Log project summary
            console.log('\n📋 Projects Summary:');
            projects.forEach(project => {
                console.log(`  • ${project.title} (${project.tech.slice(0, 3).join(', ')}) ${project.featured ? '⭐' : ''}`);
            });
        }

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

    const options = {
        dryRun: args.includes('--dry-run'),
        verbose: args.includes('--verbose') || args.includes('-v')
    };

    syncProjects(options);
}

module.exports = { syncProjects, detectTechStack, transformToProject };
