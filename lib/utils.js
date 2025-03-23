const fs = require('fs');
const path = require('path');
const profiles = require('./profiles');
const EXT = '.mobileprovision';

exports.removeExpired = function () {
  const NOW = new Date();
  profiles
    .get()
    .filter((a) => a.expiry < NOW)
    .forEach((profile) => {
      let file_name = profile.uuid + EXT;
      let file = path.join(profile.file);
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(file_name + ' removed');
      }
    });
};

exports.removeSingle = function (uuid) {
  let file_name = uuid + EXT;
  profiles.PATHS.forEach((_path) => {
    let file = path.join(_path, file_name);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(file_name + ' removed');
    }
  });
};
