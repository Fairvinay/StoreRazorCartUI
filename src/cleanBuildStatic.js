const fs = require('fs-extra');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const staticDir = path.join(publicDir, 'static');
const indexHtml = path.join(publicDir, 'index.html');

const headerDir = path.join(__dirname, '.');
//const _headers = path.join(headerDir, '_headers');
const fileHeaders =  path.resolve(headerDir,'_headers' );
const fileRedirects = path.resolve(headerDir,'_redirects' );//path.join(headerDir, '_redirects');

const buildDir = path.join(__dirname, '..', 'build');
const buildStaticDir = path.join(buildDir, 'static');
const buildIndexHtml = path.join(buildStaticDir, 'index.html');



try {
  if (fs.existsSync(staticDir)) {
    //fs.removeSync(staticDir);
    fs.rmSync(staticDir, { recursive: true, force: true });
    console.log('✅ Deleted old public/static');
  } else {
    console.log('ℹ️ No public/static to delete');
  }

  /*if (fs.existsSync(indexHtml)) {
    fs.removeSync(indexHtml);
    console.log('✅ Deleted old public/index.html');
  } else {
    console.log('ℹ️ No public/index.html to delete');
  }*/

  if (fs.existsSync(buildStaticDir)) {
    fs.removeSync(buildStaticDir);
    console.log('✅ Deleted old build/static');
  } else {
    console.log('ℹ️ No build/static to delete');
  }

  if (fs.existsSync(buildIndexHtml)) {
    fs.removeSync(buildIndexHtml);
    console.log('✅ Deleted old build/index.html');
  } else {
    console.log('ℹ️ No build/index.html to delete');
  }
// Copy _headers and _redirects to build directory
copyFileIfExists(fileHeaders, path.join(buildDir, '_headers'));
copyFileIfExists(fileRedirects, path.join(buildDir, '_redirects'));

} catch (err) {
  console.error('❌ Error clearing old static files:', err);
  process.exit(1);
}

// Utility to copy a file if it exists
function copyFileIfExists(source, destination) {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, destination);
      console.log(`✔ Copied ${path.basename(source)} to ${destination}`);
    } else {
      console.warn(`⚠ File not found: ${source}`);
    }
  }