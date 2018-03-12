# PROV PROF
This is a collection of cli-tools to view and manage iOS Provisioning Profiles

## CLI USAGE

~~~
> provprof --help

provprof <command>

Commands:
  provprof list [options]  List all install profiles
  provprof remove <uuid>   Remove a specific profile
  provprof remove-expired  Remove all expired profiles

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
~~~

~~~
❯ provprof list --help
provprof list [options]

List all install profiles

Options:
  --help         Show help                                             [boolean]
  --version      Show version number                                   [boolean]
  --expired      show only expired provisioning profiles
                                                  [boolean] [default: false]
  --team         search by team name
  --name         search by profile name
  --app_id       search by app id
  --app_id_name  search by app name
  --search       search by team name, profile name, app id or app name
  --devices      display the devices in the provisioning profile
                                                  [boolean] [default: false]
~~~

### Sample usage

![list](https://github.com/dbankier/provprof/raw/master/screens/list.png)

## Library usage

The follow commands are part of the public api:

~~~
const provprof = require("provprof");

let profiles = provprof.get()

/*
returns an array of profiles
[{
        team: String,
        name: String,
        app_id: String,
        app_id_name: String,
        uuid: String,
        created: Date,
        expiry: Date,
        devices: [String]
}]

let limitedProfiles = provprof.list(options);

/*
returns the same array as above

options include:
{
        team: String,       // search by team name
        name: String,       // search by profile name
        app_id: String,     // search by app id
        app_id_name: String,// search by app name
        expired: Boolean,   // filter on expired profiles
        search: String      // search on team, profile, app id or app name
}
*/
~~~






### Licence: MIT
