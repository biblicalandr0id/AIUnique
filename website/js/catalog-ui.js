import { DownloadManager } from './download-manager.js';
import { PurchaseHandler } from './purchase-handler.js';

export class CatalogUI {
    constructor() {
        this.downloadManager = new DownloadManager();
        this.purchaseHandler = new PurchaseHandler(window.config.STRIPE_PUBLISHABLE_KEY);
        this.initializeUI();
    }

    async initializeUI() {
        await this.loadModels();
        this.setupEventListeners();
        this.setupFilters();
    }

    async loadModels() {
        try {
            const response = await fetch('/api/models');
            const data = await response.json();
            this.displayModels(data.models);
        } catch (error) {
            console.error('Failed to load models:', error);
            this.showError('Failed to load models. Please try again later.');
        }
    }

    displayModels(models) {
        const grid = document.getElementById('models-grid');
        grid.innerHTML = models.map(model => this.createModelCard(model)).join('');
    }

    createModelCard(model) {
        return `
            <div class="glass rounded-lg p-6 card-hover">
                <h3 class="text-xl font-semibold mb-2">${model.name}</h3>
                <p class="text-gray-300 mb-4">${model.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${model.tags.map(tag => `
                        <span class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-sm">
                            ${tag}
                        </span>
                    `).join('')}
                </div>
                <div class="mt-4">
                    <div class="text-sm text-gray-400 mb-2">Requirements:</div>
                    <ul class="list-disc list-inside text-sm text-gray-300 mb-4">
                        ${model.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-2xl font-bold">$${model.price}</span>
                    <div class="space-x-2">
                        <button onclick="showModelDetail('${model.name}')" 
                                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Details
                        </button>
                        <button onclick="purchaseModel('${model.name}')"
                                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            Purchase
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupFilters() {
        // Implementation for search and filtering
    }

    showError(message) {
        // Implementation for error display
    }
}