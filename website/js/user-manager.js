export class UserManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = null;
    }

    async checkAuthStatus() {
        const userSection = document.getElementById('userSection');
        
        if (this.token) {
            try {
                const response = await fetch('/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                
                if (response.ok) {
                    this.user = await response.json();
                    this.renderAuthenticatedUI();
                } else {
                    this.handleLogout();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.handleLogout();
            }
        } else {
            this.renderUnauthenticatedUI();
        }
    }

    renderAuthenticatedUI() {
        const userSection = document.getElementById('userSection');
        userSection.innerHTML = `
            <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-300">Welcome, ${this.user.username}</span>
                <button onclick="handleLogout()" 
                        class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    Logout
                </button>
            </div>
        `;

        // Show dashboard link
        document.getElementById('dashboardLink').classList.remove('hidden');
    }

    renderUnauthenticatedUI() {
        const userSection = document.getElementById('userSection');
        userSection.innerHTML = `
            <div class="flex space-x-4">
                <button onclick="showLoginModal()" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Login
                </button>
                <button onclick="showRegisterModal()" 
                        class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    Register
                </button>
            </div>
        `;

        // Hide dashboard link
        document.getElementById('dashboardLink').classList.add('hidden');
    }

    async loadPurchasedModels() {
        if (!this.token) return;

        try {
            const response = await fetch('/api/user/purchases', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const purchases = await response.json();
                this.renderPurchasedModels(purchases);
            }
        } catch (error) {
            console.error('Failed to load purchases:', error);
        }
    }

    renderPurchasedModels(purchases) {
        const container = document.getElementById('purchasedModels');
        
        if (purchases.length === 0) {
            container.innerHTML = `
                <div class="col-span-2 text-center py-8">
                    <p class="text-gray-400">You haven't purchased any models yet.</p>
                    <a href="#models" class="text-blue-400 hover:text-blue-300">
                        Browse available models
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = purchases.map(purchase => `
            <div class="glass rounded-lg p-6">
                <h3 class="text-xl font-semibold mb-2">${purchase.model_name}</h3>
                <p class="text-gray-400 mb-4">Purchased on: ${new Date(purchase.purchase_date).toLocaleDateString()}</p>
                <div class="space-y-4">
                    <button onclick="downloadModel('${purchase.model_name}')"
                            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Download Model
                    </button>
                    <button onclick="viewDocumentation('${purchase.model_name}')"
                            class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        View Documentation
                    </button>
                </div>
            </div>
        `).join('');
    }

    handleLogout() {
        localStorage.removeItem('token');
        this.token = null;
        this.user = null;
        this.renderUnauthenticatedUI();
        window.location.reload();
    }
}