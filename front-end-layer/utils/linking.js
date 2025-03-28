/**
 * @file linking.js
 * @description Deep linking configuration for the app.
 */

export const linking = {
    prefixes: ['signify://'],
    config: {
        screens: {
            ResetPassword: {
                path: 'reset-password/:token',
                parse: {
                    token: (token) => token,
                },
                stringify: {
                    token: (token) => token,
                }
            },
            Login: 'login',
            ForgotPassword: 'forgot-password'
        }
    },
    // Add debug logging
    subscribe: (listener) => {
        const onReceiveURL = ({ url }) => {
            console.log('Deep link received:', url);
            
            // Simple URL parsing that works in React Native
            const token = url.split('token=')[1] || url.split('reset-password/')[1];
            console.log('Extracted token:', token);
            
            listener(url);
        };

        // Add event listener for deep links
        const subscription = require('react-native').Linking.addEventListener('url', onReceiveURL);

        return () => {
            subscription.remove();
        };
    }
}; 