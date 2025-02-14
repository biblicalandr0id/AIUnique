export class ModelPreview {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async loadPreview(modelId) {
        try {
            const response = await fetch(`/api/models/${modelId}/preview`);
            const previewData = await response.json();

            this.container.innerHTML = `
                <div class="glass p-6 rounded-lg">
                    <h3 class="text-xl font-semibold mb-4">Model Preview</h3>
                    
                    <!-- Architecture Visualization -->
                    <div class="mb-6">
                        <h4 class="text-lg font-medium mb-2">Architecture</h4>
                        <div class="bg-gray-900 p-4 rounded-lg">
                            <pre class="text-sm text-gray-300">${previewData.architecture}</pre>
                        </div>
                    </div>

                    <!-- Sample Code -->
                    <div class="mb-6">
                        <h4 class="text-lg font-medium mb-2">Sample Usage</h4>
                        <div class="bg-gray-900 p-4 rounded-lg">
                            <pre class="text-sm text-gray-300">${previewData.sampleCode}</pre>
                        </div>
                    </div>

                    <!-- Performance Metrics -->
                    <div class="mb-6">
                        <h4 class="text-lg font-medium mb-2">Performance Metrics</h4>
                        <div class="grid grid-cols-2 gap-4">
                            ${this.renderMetrics(previewData.metrics)}
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Preview load error:', error);
            this.container.innerHTML = `
                <div class="text-red-400 p-4">
                    Failed to load preview. Please try again later.
                </div>
            `;
        }
    }

    renderMetrics(metrics) {
        return Object.entries(metrics)
            .map(([key, value]) => `
                <div class="glass p-4 rounded-lg">
                    <div class="text-sm text-gray-400">${key}</div>
                    <div class="text-lg font-semibold">${value}</div>
                </div>
            `)
            .join('');
    }
}