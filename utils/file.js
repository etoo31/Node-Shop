const fs = require("fs");

exports.deleteFile = (path) => {
  return fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
