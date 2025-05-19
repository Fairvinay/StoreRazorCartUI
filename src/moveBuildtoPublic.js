const fs = require('fs-extra');
const path = require('path');

//const buildPath = path.join(__dirname, 'build');
//const publicPath = path.join(__dirname, 'public');


const source = path.join(__dirname, '..', 'build/static');   // ../build (not ../src/build)
const destination = path.join(__dirname, '..', 'public/static');
const buildDir = path.join(__dirname, '..', 'build');
const publicDir = path.join(__dirname, '..', 'public');
const headerDir = path.join(__dirname, '.');
const fileHeaders =  path.resolve(headerDir,'_headers' );
const fileRedirects = path.resolve(headerDir,'_redirects' );//path.join(headerDir, '_redirects');
const fileApiConfig=  path.resolve(headerDir,'config.json' );


if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
    console.log('✅ created public/static');
  }
/*if (fs.existsSync(indexHtml)) {
    fs.removeSync(indexHtml);
    console.log('✅ Deleted old public/index.html');
  } else {
    console.log('ℹ️ No public/index.html to delete');
  }
// Remove old public content (except assets you want to keep)
*/
/*// Optional: delete only the "static" folder inside build
const staticPathInBuild = path.join(source, 'static');
console.log('🚮 Deleting old static files in /build/static...');
fs.rmSync(staticPathInBuild, { recursive: true, force: true });

// Optional: delete only the "static" folder inside public
const staticPathInPublic = path.join(destination, 'static');
console.log('🚮 Deleting old static files in /public/static...');
 fs.rmSync(staticPathInPublic, { recursive: true, force: true }); // delete public/static
*/
// Copy _headers and _redirects to build directory
copyFileIfExists(fileHeaders, path.join(buildDir, '_headers'));
copyFileIfExists(fileRedirects, path.join(buildDir, '_redirects'));
copyFileIfExists(fileApiConfig, path.join(buildDir, 'config.json'));
//fs.removeSync(destination);
copyFileIfExists(fileHeaders, path.join(publicDir, '_headers'));
copyFileIfExists(fileRedirects, path.join(publicDir, '_redirects'));
copyFileIfExists(fileApiConfig, path.join(publicDir, 'config.json'));
 
console.log('📂 Copying new build to /public...');
fs.copySync(source, destination,{ overwrite: true });
console.log('✅ Build moved successfully!');

console.log('✅ Build copied to public');

// Utility to copy a file if it exists
function copyFileIfExists(source, destination) {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, destination);
      console.log(`✔ Copied ${path.basename(source)} to ${destination}`);
    } else {
      console.warn(`⚠ File not found: ${source}`);
    }
  }