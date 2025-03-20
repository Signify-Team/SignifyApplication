/**
 * @file linking.js
 * @description Deep linking configuration for the app.
 */

export const linking = {
    prefixes: ['signify://'],
    config: {
        screens: {
            ResetPassword: {
                path: 'reset-password',
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
    }
}; 