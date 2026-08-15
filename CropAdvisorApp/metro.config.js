// Metro bundler configuration.
//
// The trained crop-recommendation model is exported as a large (~10MB) data
// file (assets/model/model_data.dat). We register the ".dat" extension as an
// ASSET extension (like images/fonts) rather than a SOURCE extension so that
// Metro copies it as a static binary asset instead of trying to parse it as
// a JavaScript/JSON module. The app then reads it at runtime with
// expo-file-system (see src/ml/modelData.js). This keeps the JS bundle small
// and app startup fast, and avoids Metro choking on parsing a huge JSON
// module during bundling.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('dat');

module.exports = config;
