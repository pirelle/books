const fs = require('fs');
const path = require('path');

function handleFileUpload(ctx) {
  const {file} = ctx.request.files;
  const ext = path.extname(file.name);
  const basename = path.basename(file.path);
  const url = `/media/${basename}${ext}`;
  const fullpath = path.join(__dirname, './public', url);
  fs.createReadStream(file.path).pipe(fs.createWriteStream(fullpath));
  return url;
}

module.exports = handleFileUpload;