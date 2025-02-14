export class ModelComparison {
    constructor() {
        this.selectedModels = new Set();
        this.maxComparisons = 3;
    }

    addToComparison(modelId) {
        if (this.selectedModels.size >= this.maxComparisons) {
            window.app.notifications.show(
                `Can only compare up to ${this.maxComparisons} models`, 
                'warning'
            );
            return false;
        }
        
        this.selectedModels.add(modelId);
        this.updateComparisonUI();
        return true;
    }

    removeFromComparison(modelId) {
        this.selectedModels.delete(modelId);
        this.updateComparisonUI();
    }

    async showComparison() {
        if (this.selectedModels.size < 2) {
            window.app.notifications.show(
                'Select at least 2 models to compare', 
                'warning'
            );
            return;
        }

        const models = await this.fetchModelDetails(Array.from(this.selectedModels));
        this.renderComparison(models);
    }

    async fetchModelDetails(modelIds) {
        const promises = modelIds.map(id => 
            fetch(`/api/models/${id}/details`).then(r => r.json())
        );
        return Promise.all(promises);
    }

    renderComparison(models) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50"></div>
            <div class="fixed inset-10 glass rounded-xl p-8 overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Model Comparison</h2>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="text-left">
                                <th class="px-4 py-2">Feature</th>
                                ${models.map(m => `
                                    <th class="px-4 py-2">${m.name}</th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderComparisonRows(models)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    renderComparisonRows(models) {
        const features = [
            'Architecture',
            'Training Time',
            'Memory Usage',
            'Accuracy',
            'File Size',
            'Price',
            'Last Updated'
        ];

        return features.map(feature => `
            <tr class="border-t border-gray-800">
                <td class="px-4 py-2 font-medium">${feature}</td>
                ${models.map(m => `
                    <td class="px-4 py-2">${this.getFeatureValue(m, feature)}</td>
                `).join('')}
            </tr>
        `).join('');
    }

    getFeatureValue(model, feature) {
        const values = {
            'Architecture': model.architecture,
            'Training Time': `${model.trainingTime} hours`,
            'Memory Usage': `${model.memoryUsage} GB`,
            'Accuracy': `${model.accuracy}%`,
            'File Size': `${model.fileSize} MB`,
            'Price': `$${model.price}`,
            'Last Updated': new Date(model.lastUpdated).toLocaleDateString()
        };
        return values[feature] || 'N/A';
    }
}