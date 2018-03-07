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
  --expired  show only expired provisioning profiles
                                                  [boolean] [default: "expired"]
~~~

### Sample usage

![list](https://github.com/dbankier/provprof/raw/master/screens/list.gif)

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
        expiry: Date
}]
~~~






### Licence: MIT
