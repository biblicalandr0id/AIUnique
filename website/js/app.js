import { CatalogUI } from './catalog-ui.js';
import { UserManager } from './user-manager.js';
import { PaymentProcessor } from './payment-processor.js';
import { DownloadManager } from './download-manager.js';
import { NotificationManager } from './notification-manager.js';
import { ModelPreview } from './model-preview.js';
import { DocumentationViewer } from './doc-viewer.js';

class App {
    constructor() {
        this.catalog = new CatalogUI();
        this.userManager = new UserManager();
        this.paymentProcessor = new PaymentProcessor(window.config.STRIPE_PUBLISHABLE_KEY);
        this.downloadManager = new DownloadManager(this.userManager.token);
        this.notifications = new NotificationManager();
        this.modelPreview = new ModelPreview('preview-container');
        this.docViewer = new DocumentationViewer('doc-container');

        this.initialize();
    }

    async initialize() {
        try {
            await this.userManager.checkAuthStatus();
            await this.catalog.initialize();
            
            this.setupEventListeners();
            
            this.notifications.show('Welcome to ModelMarket!', 'info');
        } catch (error) {
            console.error('Initialization error:', error);
            this.notifications.show('Failed to initialize application', 'error');
        }
    }

    setupEventListeners() {
        // Add event listeners for various user interactions
        document.addEventListener('model-selected', this.handleModelSelection.bind(this));
        document.addEventListener('purchase-requested', this.handlePurchaseRequest.bind(this));
        document.addEventListener('download-requested', this.handleDownloadRequest.bind(this));
    }

    async handleModelSelection(event) {
        const { modelId } = event.detail;
        await this.modelPreview.loadPreview(modelId);
    }

    async handlePurchaseRequest(event) {
        const { modelId, amount } = event.detail;
        try {
            const paymentElement = this.paymentProcessor.createPaymentForm('payment-container');
            const result = await this.paymentProcessor.processPayment(paymentElement, modelId, amount);
            
            if (result.status === 'succeeded') {
                this.notifications.show('Purchase successful!', 'success');
                await this.downloadManager.downloadModel(modelId);
            }
        } catch (error) {
            this.notifications.show('Purchase failed: ' + error.message, 'error');
        }
    }

    async handleDownloadRequest(event) {
        const { modelId } = event.detail;
        try {
            await this.downloadManager.downloadModel(modelId);
            this.notifications.show('Download started!', 'success');
        } catch (error) {
            this.notifications.show('Download failed: ' + error.message, 'error');
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});