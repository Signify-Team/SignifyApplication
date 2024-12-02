// Mock React Native Animated Helper
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}));

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Override the default 'call' behavior to prevent errors
  Reanimated.default.call = () => {};

  return Reanimated;
});
