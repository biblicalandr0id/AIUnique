export class DownloadManager {
    constructor(token) {
        this.token = token;
    }

    async downloadModel(modelId) {
        try {
            const response = await fetch(`/api/models/${modelId}/download`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `model-${modelId}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

            return true;
        } catch (error) {
            console.error('Download error:', error);
            throw error;
        }
    }

    async getModelDocumentation(modelId) {
        try {
            const response = await fetch(`/api/models/${modelId}/docs`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch documentation');
            }

            return await response.json();
        } catch (error) {
            console.error('Documentation fetch error:', error);
            throw error;
        }
    }
}