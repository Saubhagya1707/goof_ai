const isDocker = window.location.hostname === 'frontend' || window.location.hostname.includes('docker');
export const environment = {
    production: false,
    apiUrl: isDocker ? 'http://backend:8000/goof-ai/v1' : 'http://localhost:8000/goof-ai/v1',
    version: '1.0.0-dev',
    featureFlags: {
        enableExperimental: true,
        enableNewDashboard: false
    },
    analytics: {
        googleTrackingId: null,
        mixpanelToken: 'dev-token-123'
    }
}