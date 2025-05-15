const fs = require('fs-extra');
const path = require('path');

const buildPath = path.join(__dirname, 'build');
const publicPath = path.join(__dirname, 'public');

// Remove old public content (except assets you want to keep)
fs.removeSync(publicPath);

// Copy entire build to public
fs.copySync(buildPath, publicPath);

console.log('✅ Build copied to public');
