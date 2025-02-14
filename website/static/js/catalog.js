class ModelCatalog {
    constructor() {
        this.models = [];
        this.filters = {
            search: '',
            tag: '',
            sortBy: 'newest'
        };
    }

    async loadModels() {
        try {
            const response = await fetch('/api/models');
            this.models = await response.json();
            this.renderModels();
        } catch (error) {
            console.error('Error loading models:', error);
        }
    }

    filterModels() {
        return this.models.filter(model => {
            // Search filter
            if (this.filters.search) {
                const searchLower = this.filters.search.toLowerCase();
                if (!model.name.toLowerCase().includes(searchLower) &&
                    !model.description.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            // Tag filter
            if (this.filters.tag && !model.tags.includes(this.filters.tag)) {
                return false;
            }

            return true;
        }).sort((a, b) => {
            // Sort models
            switch (this.filters.sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'newest':
                default:
                    return new Date(b.date_added) - new Date(a.date_added);
            }
        });
    }

    renderModels() {
        const grid = document.getElementById('models-grid');
        const filteredModels = this.filterModels();
        
        grid.innerHTML = filteredModels.map(model => `
            <div class="glass rounded-lg p-6 card-hover transform transition-all duration-300 hover:-translate-y-2">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-semibold gradient-text">${model.name}</h3>
                    <span class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        $${model.price}
                    </span>
                </div>
                
                <p class="text-gray-300 mb-4">${model.description}</p>
                
                <div class="flex flex-wrap gap-2 mb-4">
                    ${model.tags.map(tag => `
                        <span class="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-sm">
                            ${tag}
                        </span>
                    `).join('')}
                </div>

                <div class="flex justify-between items-center mt-4">
                    <button onclick="showModelDetail('${model.id}')" 
                            class="text-blue-400 hover:text-blue-300">
                        View Details
                    </button>
                    <button onclick="purchaseModel('${model.id}')"
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Purchase
                    </button>
                </div>
            </div>
        `).join('');
    }

    async purchaseModel(modelId) {
        try {
            const response = await fetch('/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model_id: modelId })
            });
            
            const { session_id } = await response.json();
            const stripe = Stripe(STRIPE_PUBLIC_KEY);
            
            // Redirect to Stripe checkout
            await stripe.redirectTo