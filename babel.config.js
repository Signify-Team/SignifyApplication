module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    env: {
        test: {
            plugins: [
                ['@babel/plugin-transform-private-methods'],
                ['module:react-native-dotenv', {
                    moduleName: 'react-native-dotenv',
                    path: '.env',
                  }
                ],
            ]
        },
    },
};