export class UserSettings {
    constructor(token) {
        this.token = token;
        this.settings = null;
        this.lastUpdated = null;
    }

    async initialize() {
        await this.loadSettings();
        this.setupSettingsUI();
    }

    async loadSettings() {
        try {
            const response = await fetch('/api/user/settings', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to load settings');
            
            this.settings = await response.json();
            this.lastUpdated = new Date();
        } catch (error) {
            console.error('Settings load error:', error);
            throw error;
        }
    }

    setupSettingsUI() {
        const settingsModal = `
            <div id="settingsModal" class="fixed inset-0 hidden z-50">
                <div class="fixed inset-0 bg-black bg-opacity-50"></div>
                <div class="fixed inset-10 glass rounded-xl p-8 overflow-y-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold">User Settings</h2>
                        <button onclick="closeSettings()" class="text-gray-400 hover:text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Profile Settings -->
                        <div class="glass rounded-lg p-6">
                            <h3 class="text-xl font-semibold mb-4">Profile</h3>
                            <form id="profileForm" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-400 mb-1">Username</label>
                                    <input type="text" 
                                           id="username" 
                                           value="${this.settings?.profile?.username || 'biblicalandr0id'}"
                                           class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                    <input type="email" 
                                           id="email" 
                                           value="${this.settings?.profile?.email || ''}"
                                           class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                                    <textarea id="bio" 
                                              class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg h-24"
                                    >${this.settings?.profile?.bio || ''}</textarea>
                                </div>
                            </form>
                        </div>

                        <!-- Preferences -->
                        <div class="glass rounded-lg p-6">
                            <h3 class="text-xl font-semibold mb-4">Preferences</h3>
                            <form id="preferencesForm" class="space-y-4">
                                <div>
                                    <label class="flex items-center space-x-2">
                                        <input type="checkbox" 
                                               id="emailNotifications"
                                               ${this.settings?.preferences?.emailNotifications ? 'checked' : ''}
                                               class="form-checkbox bg-gray-800">
                                        <span class="text-sm text-gray-300">Email notifications</span>
                                    </label>
                                </div>
                                <div>
                                    <label class="flex items-center space-x-2">
                                        <input type="checkbox" 
                                               id="updateAlerts"
                                               ${this.settings?.preferences?.updateAlerts ? 'checked' : ''}
                                               class="form-checkbox bg-gray-800">
                                        <span class="text-sm text-gray-300">Model update alerts</span>
                                    </label>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-400 mb-1">Default download format</label>
                                    <select id="downloadFormat" 
                                            class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg">
                                        <option value="zip" ${this.settings?.preferences?.downloadFormat === 'zip' ? 'selected' : ''}>ZIP</option>
                                        <option value="tar.gz" ${this.settings?.preferences?.downloadFormat === 'tar.gz' ? 'selected' : ''}>TAR.GZ</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                        <!-- API Access -->
                        <div class="glass rounded-lg p-6">
                            <h3 class="text-xl font-semibold mb-4">API Access</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-400 mb-1">API Key</label>
                                    <div class="flex items-center space-x-2">
                                        <input type="password" 
                                               id="apiKey" 
                                               value="${this.settings?.apiKey || ''}"
                                               readonly
                                               class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg">
                                        <button onclick="regenerateApiKey()"
                                                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                            Regenerate
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-400 mb-1">Webhook URL</label>
                                    <input type="url" 
                                           id="webhookUrl" 
                                           value="${this.settings?.webhookUrl || ''}"
                                           class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg">
                                </div>
                            </div>
                        </div>

                        <!-- Security -->
                        <div class="glass rounded-lg p-6">
                            <h3 class="text-xl font-semibold mb-4">Security</h3>
                            <div class="space-y-4">
                                <div>
                                    <button onclick="changePassword()"
                                            class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                                        Change Password
                                    </button>
                                </div>
                                <div>
                                    <button onclick="enable2FA()"
                                            class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                        ${this.settings?.security?.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                                    </button>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-400 mb-1">Active Sessions</label>
                                    <div class="bg-gray-800 rounded-lg p-4 max-h-40 overflow-y-auto">
                                        ${this.renderActiveSessions()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="mt-8 flex justify-end">
                        <button onclick="saveSettings()"
                                class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', settingsModal);
        this.attachEventListeners();
    }

    renderActiveSessions() {
        if (!this.settings?.security?.activeSessions) return '';
        
        return this.settings.security.activeSessions.map(session => `
            <div class="flex justify-between items-center py-2">
                <div class="text-sm">
                    <div class="text-gray-300">${session.device}</div>
                    <div class="text-gray-500">${session.location} • ${session.lastActive}</div>
                </div>
                <button onclick="terminateSession('${session.id}')"
                        class="text-red-400 hover:text-red-300">
                    Terminate
                </button>
            </div>
        `).join('');
    }

    async saveSettings() {
        const updatedSettings = {
            profile: {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                bio: document.getElementById('bio').value
            },
            preferences: {
                emailNotifications: document.getElementById('emailNotifications').checked,
                updateAlerts: document.getElementById('updateAlerts').checked,
                downloadFormat: document.getElementById('downloadFormat').value
            },
            webhookUrl: document.getElementById('webhookUrl').value
        };

        try {
            const response = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedSettings)
            });

            if (!response.ok) throw new Error('Failed to save settings');

            this.settings = await response.json();
            this.lastUpdated = new Date();
            
            // Show success notification
            window.app.notifications.show('Settings saved successfully', 'success');
        } catch (error) {
            console.error('Settings save error:', error);
            window.app.notifications.show('Failed to save settings', 'error');
        }
    }

    attachEventListeners() {
        window.saveSettings = () => this.saveSettings();
        window.closeSettings = () => document.getElementById('settingsModal').classList.add('hidden');
        window.regenerateApiKey = () => this.regenerateApiKey();
        window.changePassword = () => this.showChangePasswordModal();
        window.enable2FA = () => this.toggle2FA();
        window.terminateSession = (sessionId) => this.terminateSession(sessionId);
    }

    // Additional methods for security features
    async regenerateApiKey() {
        // Implementation for API key regeneration
    }

    async showChangePasswordModal() {
        // Implementation for password change
    }

    async toggle2FA() {
        // Implementation for 2FA toggle
    }

    async terminateSession(sessionId) {
        // Implementation for session termination
    }
}