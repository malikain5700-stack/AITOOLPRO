// Multi-Tools Website JavaScript

// Global variables
let currentSearchTerm = '';
let currentCategory = 'all';

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    initializeSearch();
    initializeToolCards();
    initializeCategoryFilter();
});

// Load header dynamically
async function loadHeader() {
    try {
        const response = await fetch('header.html');
        const headerHTML = await response.text();
        document.getElementById('header-container').innerHTML = headerHTML;
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// Load footer dynamically
async function loadFooter() {
    try {
        const response = await fetch('footer.html');
        const footerHTML = await response.text();
        document.getElementById('footer-container').innerHTML = footerHTML;
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('toolSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearchTerm = this.value.toLowerCase();
            filterTools();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTools();
            }
        });
    }
}

// Search tools function
function searchTools() {
    const searchInput = document.getElementById('toolSearch');
    if (searchInput) {
        currentSearchTerm = searchInput.value.toLowerCase();
        filterTools();
        
        // Scroll to tools section
        const toolsSection = document.getElementById('tools');
        if (toolsSection) {
            toolsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Search from header
function searchFromHeader() {
    const headerSearch = document.getElementById('headerSearch');
    if (headerSearch) {
        currentSearchTerm = headerSearch.value.toLowerCase();
        filterTools();
        
        // Navigate to main page if not already there
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = 'index.html#tools';
        } else {
            const toolsSection = document.getElementById('tools');
            if (toolsSection) {
                toolsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}

// Filter tools based on search term and category
function filterTools() {
    const toolCards = document.querySelectorAll('.tool-card');
    let visibleCount = 0;
    
    toolCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        const keywords = card.getAttribute('data-keywords') || '';
        const category = card.getAttribute('data-category');
        
        const matchesSearch = currentSearchTerm === '' || 
            title.includes(currentSearchTerm) || 
            description.includes(currentSearchTerm) || 
            keywords.includes(currentSearchTerm);
        
        const matchesCategory = currentCategory === 'all' || category === currentCategory;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show no results message if needed
    showNoResultsMessage(visibleCount === 0);
}

// Show no results message
function showNoResultsMessage(show) {
    let noResultsDiv = document.getElementById('no-results');
    
    if (show && !noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.id = 'no-results';
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = `
            <i class="fas fa-search"></i>
            <h4>No tools found</h4>
            <p>Try adjusting your search terms or browse by category.</p>
        `;
        
        const toolsSection = document.getElementById('tools');
        if (toolsSection) {
            toolsSection.appendChild(noResultsDiv);
        }
    } else if (!show && noResultsDiv) {
        noResultsDiv.remove();
    }
}

// Initialize tool cards with hover effects
function initializeToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize category filter
function initializeCategoryFilter() {
    // Add category filter buttons if they don't exist
    const toolsSection = document.getElementById('tools');
    if (toolsSection && !document.getElementById('category-filter')) {
        const categoryFilter = document.createElement('div');
        categoryFilter.id = 'category-filter';
        categoryFilter.className = 'category-filter text-center mb-4';
        categoryFilter.innerHTML = `
            <button class="btn btn-outline-primary active" data-category="all">All Tools</button>
            <button class="btn btn-outline-primary" data-category="image">Image Tools</button>
            <button class="btn btn-outline-primary" data-category="seo">SEO Tools</button>
            <button class="btn btn-outline-primary" data-category="text">Text Tools</button>
        `;
        
        toolsSection.insertBefore(categoryFilter, toolsSection.firstChild);
        
        // Add event listeners to category buttons
        const categoryButtons = categoryFilter.querySelectorAll('button');
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update current category and filter
                currentCategory = this.getAttribute('data-category');
                filterTools();
            });
        });
    }
}

// Utility function to show loading spinner
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="loading-spinner"></div> Processing...';
    }
}

// Utility function to hide loading spinner
function hideLoading(element, content) {
    if (element) {
        element.innerHTML = content;
    }
}

// Utility function to show alert
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the page
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
    }
}

// Utility function to download file
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Utility function to copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showAlert('Copied to clipboard!', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showAlert('Failed to copy to clipboard', 'danger');
    }
}

// Utility function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility function to validate URL
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Utility function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to generate random string
function generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Utility function to debounce
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

// Initialize tool-specific functionality
function initializeToolPage() {
    // Add back to home button
    const backButton = document.createElement('div');
    backButton.className = 'mb-3';
    backButton.innerHTML = `
        <a href="index.html" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Back to All Tools
        </a>
    `;
    
    const toolContent = document.querySelector('.tool-content');
    if (toolContent) {
        toolContent.insertBefore(backButton, toolContent.firstChild);
    }
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Initialize tool page if on a tool page
if (window.location.pathname.includes('tools/')) {
    initializeToolPage();
}