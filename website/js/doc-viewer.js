export class DocumentationViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDoc = null;
    }

    async loadDocumentation(modelId) {
        try {
            const response = await fetch(`/api/models/${modelId}/documentation`);
            this.currentDoc = await response.json();
            this.render();
        } catch (error) {
            console.error('Documentation load error:', error);
            this.showError();
        }
    }

    render() {
        if (!this.currentDoc) return;

        this.container.innerHTML = `
            <div class="glass p-6 rounded-lg">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">${this.currentDoc.title}</h2>
                    <button onclick="window.print()" class="text-blue-400 hover:text-blue-300">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                        </svg>
                    </button>
                </div>

                <div class="prose prose-invert max-w-none">
                    ${this.renderContent()}
                </div>
            </div>
        `;
    }

    renderContent() {
        return marked(this.currentDoc.content);
    }

    showError() {
        this.container.innerHTML = `
            <div class="glass p-6 rounded-lg">
                <div class="text-red-400 text-center">
                    <p>Failed to load documentation.</p>
                    <button onclick="location.reload()" 
                            class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                        Retry
                    </button>
                </div>
            </div>
        `;
    }
}