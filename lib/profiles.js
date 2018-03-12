const fs = require('fs');
const path = require('path');
const home = require('user-home');
const chalk = require('chalk');
const moment = require('moment');

const PATH = path.join(
  home,
  'Library',
  'MobileDevice',
  'Provisioning Profiles'
);
exports.PATH = PATH;

const listFiles = () =>
  fs.readdirSync(PATH).filter(name => /mobileprovision$/.test(name));

const readFiles = () =>
  listFiles().map(file => fs.readFileSync(path.join(PATH, file)).toString());

const niceDate = date => moment(date).format('DD/MM/YYYY');

exports.get = function() {
  return readFiles()
    .map(content => {
      let devices = content.match(
        /<key>ProvisionedDevices<\/key>\n[\t\s]*<array>([\s\S.]*?)<\/array>/
      );
      if (devices) {
        devices = devices[1]
          .split('\n')
          .map(a => a.trim().substring(8, 46))
          .filter(a => a);
      }
      return {
        team: content.match(
          /<key>TeamName<\/key>\n[\t\s]*<string>([^>]*)<\/string>/
        )[1],
        name: content.match(
          /<key>Name<\/key>\n[\t\s]*<string>([^>]*)<\/string>/
        )[1],
        app_id: content.match(
          /<key>application-identifier<\/key>\n[\t\s]*<string>([^>]*)<\/string>/
        )[1],
        app_id_name: content.match(
          /<key>AppIDName<\/key>\n[\t\s]*<string>([^>]*)<\/string>/
        )[1],
        uuid: content.match(
          /<key>UUID<\/key>\n[\t\s]*<string>([^>]*)<\/string>/
        )[1],
        created: new Date(
          content.match(
            /<key>CreationDate<\/key>\n[\t\s]*<date>([^>]*)<\/date>/
          )[1]
        ),
        devices: devices,
        expiry: new Date(
          content.match(
            /<key>ExpirationDate<\/key>\n[\t\s]*<date>([^>]*)<\/date>/
          )[1]
        )
      };
    })
    .sort((a, b) => {
      if (a.team !== b.team) {
        return a.team < b.team ? -1 : 1;
      }
      if (a.app_id_name !== b.app_id_name) {
        return a.app_id_name < b.app_id_name ? -1 : 1;
      }
      if (a.name !== b.name) {
        return a.name < b.name ? -1 : 1;
      }
      return a.expiry < b.expiry ? -1 : 1;
    });
};

exports.prettyPrint = function(data, showDevices) {
  console.log(showDevices);
  let last_team;
  let last_app_id;
  let last_app;
  data.forEach(profile => {
    let isExpired = profile.expiry < new Date();

    if (last_team !== profile.team) {
      console.log(chalk`\n{blue ${profile.team}}`);
      last_team = profile.team;
    }
    if (last_app_id !== profile.app_id_name) {
      console.log(
        chalk`  {yellow ${profile.app_id_name}} {grey ${profile.app_id}}`
      );
      last_app_id = profile.app_id_name;
    }
    if (last_app !== profile.name) {
      console.log(chalk`    {magenta ${profile.name}}`);
      last_app = profile.name;
    }

    let line = '      ';
    line += isExpired
      ? chalk.bgRed.black(' EXPIRED ')
      : chalk.bgGreen.black('   OK    ');
    line += ` ${chalk.grey(profile.uuid)} `;
    let time_span = `${niceDate(profile.created)}-${niceDate(profile.expiry)}`;
    line += isExpired ? chalk.red(time_span) : chalk.green(time_span);
    console.log(line);
    if (showDevices && profile.devices) {
      const PAD = '        ';
      console.log(PAD + 'Devices: ');
      profile.devices.forEach(device =>
        console.log(PAD + '  ' + chalk.grey(device))
      );
    }
  });
};
exports.find = function(options) {
  let data = exports.get();
  if (options) {
    data = data.filter(profile => {
      let found = false;
      if (options.search) {
        ['team', 'name', 'app_id', 'app_id_name'].forEach(field => {
          let search = options.search.toLowerCase();
          found = found || profile[field].toLowerCase().indexOf(search) !== -1;
        });
      } else {
        found = true;
      }
      ['team', 'name', 'app_id', 'app_id_name'].forEach(field => {
        if (options[field]) {
          let search = options[field].toLowerCase();
          found = found && profile[field].toLowerCase().indexOf(search) !== -1;
        }
      });
      if (options.expired) {
        found = found && profile.expiry < new Date();
      }
      return found;
    });
  }
  return data;
};
