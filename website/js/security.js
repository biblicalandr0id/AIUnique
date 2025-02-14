export class SecurityManager {
    constructor() {
        this.csrfToken = null;
    }

    async initialize() {
        // Get CSRF token from server
        const response = await fetch('/api/security/csrf-token');
        const data = await response.json();
        this.csrfToken = data.token;
        
        // Add CSRF token to all requests
        this.setupCSRFProtection();
    }

    setupCSRFProtection() {
        const originalFetch = window.fetch;
        window.fetch = async (url, options = {}) => {
            if (!options.headers) {
                options.headers = {};
            }
            
            options.headers['X-CSRF-Token'] = this.csrfToken;
            return originalFetch(url, options);
        };
    }

    sanitizeInput(input) {
        // Basic XSS prevention
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    validateInput(input, type) {
        const patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            username: /^[a-zA-Z0-9_-]{3,16}$/,
            password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        };

        return patterns[type]?.test(input) || false;
    }
}