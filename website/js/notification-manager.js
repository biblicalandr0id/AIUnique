export class NotificationManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'fixed top-4 right-4 z-50 space-y-4';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `
            glass p-4 rounded-lg shadow-lg 
            transform translate-x-0 transition-transform duration-300
            ${this.getTypeClass(type)}
        `;

        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                ${this.getIcon(type)}
                <p class="text-white">${message}</p>
            </div>
        `;

        this.container.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    getTypeClass(type) {
        const classes = {
            success: 'bg-green-500/20 border-green-500/50',
            error: 'bg-red-500/20 border-red-500/50',
            info: 'bg-blue-500/20 border-blue-500/50',
            warning: 'bg-yellow-500/20 border-yellow-500/50'
        };
        return classes[type] || classes.info;
    }

    getIcon(type) {
        // Add appropriate icons for each notification type
        const icons = {
            success: `<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                     </svg>`,
            error: `<svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>`,
            // Add other icons...
        };
        return icons[type] || icons.info;
    }
}