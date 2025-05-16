const fs = require('fs-extra');
const path = require('path');

//const buildPath = path.join(__dirname, 'build');
//const publicPath = path.join(__dirname, 'public');


const source = path.join(__dirname, '..', 'build/static');   // ../build (not ../src/build)
const destination = path.join(__dirname, '..', 'public/static');



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

//fs.removeSync(destination);

console.log('📂 Copying new build to /public...');
fs.copySync(source, destination,{ overwrite: true });
console.log('✅ Build moved successfully!');

console.log('✅ Build copied to public');
