# jorben-amich

This monorepo is for all jorben-amich related applications.

## Projects

Acting as a monorepo, please make every effort to create shared code within the libs folder (services/database/models/shared/cache). The apps themselves should be limited to mostly just starting the app while all logic is contained in shared libraries.

### Discord Bots

The basic folder structuring for discord bots can be (but is limited to) this:
├── readme.md
└── apps
    └── BotApp
        └── main.ts
└── libs
    └── discord
        └── libs
            └── bots
                └── BotApp
                    ├── client
                    ├── commands
                    ├── context
                    ├── events
                    ├── slash-command-config
                    ├── tools
                    ├── views
                    ├── index.ts


Bot apps are welcome to use anything from the other libs like service, models, and database. Following a similar structure of grouping by app name. Even though the folder structure is following app specific naming, it gives visibility to the usage of the different libs when used by other applications.

#### Aquinas Bot

This was the starter app for setting up a discord bot. The Aquinas bot acts as a template in many ways for generating other discord bots.

#### Summary Bot

This bot is currently in process

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Bugs

Bugs can be reported on the github page for this repository.
