const fs = require('fs-extra');
const path = require('path');

//const buildPath = path.join(__dirname, 'build');
//const publicPath = path.join(__dirname, 'public');


const source = path.join(__dirname, '..', 'build');   // ../build (not ../src/build)
const destination = path.join(__dirname, '..', 'public');
// Remove old public content (except assets you want to keep)
fs.removeSync(destination);

// Copy entire build to public
fs.copySync(source, destination);

console.log('✅ Build copied to public');
