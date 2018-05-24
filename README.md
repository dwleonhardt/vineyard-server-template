# Vineyard Backend API Template #

---------

### Running the Template For the First Time ###
1. Run `$yarn initialStartUp`. This will..
    1. install all dependencies
    2. create your config.ts and config-test.ts configuration files.
    3. compile your json-schema to typescript
    4. compile your typescript
2. Modify config/config.ts `realConfig.database` to indicate a database of your choosing. `realConfig.database.devMode` should be `true`. Run `$ yarn tsc`.
3. If the database name added above doesn't yet refer to an existing db, create it. In the command line enter the psql console (`$psql` ) and create the database (`CREATE DATABASE your_db_name;`) and quit (`\q`).
4. Run `$ yarn resetDb`. This will add the vineyard tables (as well as the default user table included in this template) to your database.
5. To start the server `$ yarn dev`.

#### Running Tests ####
The included tests all reference a second config file, config/config-test.ts. Tests may point at any config file, and 
many may be created and used. To get the included tests to run, modify config/config-test.ts `testConfig.database` and `$ yarn tsc` as above (step 2).
Run `$ yarn test` to execute the tests.

### Root Directory Folders ###

 - **/config**: Contains configuration files for environment specific values.
 - **/fixtures**: Contains functions for generating random and stock data for server initialization and tests.
 - **/scripts**: Files to be run from cli with node. Includes start-api.js (starts servers), and possibly daemon startup scripts.
 - **/src**: The app files.
 - **/test**: Tests for various app components.

### Src Organization ###

When the api is run, requests permeate through a number of layers in the app. Each layer has its own directory:

- **/src/endpoints**: This directory contains json-schema defining the endpoints of the application and the code to 
embed those definitions into a working server. The interface `ApiContract` in generated/api-contract.ts indicates the methods
which the coder must provide. The methods will be triggered when a request hits an endpoint, and will typically defer
all heavy lifting to the next layer. See model.ts for three example methods implementing the `ApiContract`.

- **/src/logic**:  Logic files do the heavy lifting of the application. A logic class shouldn't know anything about request specific technology or client-side code, as this is normalized by the request handlers. Their main role is to orchestrate the database and various other backing services and synthesize their results into aggregated results. Logic files should _not_ know anything about what kind of thing calls them -- be it a request handler (and hence an http api call), a cron, or a script. The file logic.ts declares all app logics as well as their initialization, while pizza-logic.ts is one such logic.

- **/src/model**: This directory contains the code for interacting with the psql database. This includes schema.json (defines the database tables and relationships), and model-types.ts (defines the types corresponding to database entries), and model.ts which defines and creates the vineyard-ground collections for interacting with the db.

- **/src/backing-services**: This is where code to interact with external resources (see https://12factor.net/backing-services) should live. These resources include custom wrappers around external apis, additional databases, and cryptocurrency nodes. Logic files will call these backing service objects and aggregate their results. As with logic and model, the backing-services.ts file declares and creates all backing-services in the app.

All of these logics, backing-services, db table collections, and endpoints are created and integrated in village.ts. The `Village` interface... 
```
   export interface Village {
     config: FullConfig
     backingServices: BackingServices
     model: Model
     logic: Logic
     apiContract: ApiContract
   }
```

... contains every piece of the fully built application. Typically villages are constructed from config, to the backingServices and model, to logic, to apiContract.

### Scripts in package.json ###

   ```
   $yarn test
   ```
   Runs fully automated tests.
   ```
   $yarn extTest
   ```
   Runs external tests. These hit live backing-services (like a live api) and should be run sparingly.
   ```
   $yarn dev
   ```
   Starts the server.
   ```
   $yarn resetDb
   ```
   Resets the database. Can run `yarn resetDb -- test` to clean the database defined in config/config-test.ts.
   ```
   $yarn endpoints
   ```
   Compiles the json-schema endpoint definitions in src/endpoints/definitions to the generated files in src/endpoints/generated.
   ```
   $yarn tsc
   ```
   Runs tsc at the version bundled in the project (2.5.3)
   ```
   $yarn watch
   ```
   Kicks off a process which re-runs `yarn endpoints` whenever a json-schema file is changed.
   ```
   $yarn copyConfigSample
   ```
   Creates `config/config.ts` and `config/config-test.ts` or sets them to match `config/config-sample.ts`.
   ```
   $yarn initialStartUp
   ```
   Run when the project is first cloned.


### Working with vineyard-janus ###

This template is designed to integrate with vineyard-janus, a new vineyard module providing utilities around json-schema for defining
endpoints. You can learn more about json-schema here: http://json-schema.org/example2.html. In src/endpoints/definitions/index-pizza.json, you'll find the definition for the endpoint which serves up all the pizzas in the database.

```
{
  "title": "IndexPizza",
  "path": "/pizzas",
  "verb": "get",
  "authorized": 0,
  "request":{
    "type": "object",
    "properties": {
    },
    "additionalProperties": false
  },
  "response":{
    "type": "array",
    "items": {
      "$ref": "#/structures/pizza"
    }
  }
}
```

Upon running `$ yarn endpoints`, a script leveraging vineyard-janus, the above schema will generate...
1. types `IndexPizzaRequest` and `IndexPizzaResponse` which satisfy the json-schema under the above request and response properties.
2. stub functions `indexPizzaRequestDataStub()` and `indexPizzaResponseStub()` which will generate random data satisfying the schema.
3. a function type declaration `indexPizza: (req: IndexPizzaRequest) => Promise<IndexPizzaResponse>` within the `ApiContract` interface.

Once you've implemented the `indexPizza` method as in (3) above, the server will now spin up with a `/pizzas` endpoint and will
automatically validate requests to match the `IndexPizzaRequest` type and the more detailed request json-schema.

Janus functionality is configurable in the following portion of config/config.ts: 

```
  'janusEndpoints': {
    'sourceDir': '/endpoints/definitions',
    'targetDir': '/endpoints/generated',
    'stubMode': true,
    'endpointForSchema': 'endpointSchema'
  },
```

The sourceDir and targetDir simply reference where json-schema can be found, and where generated code should end up. Stub mode
is an interesting toggle that leverages the above stub functions (2) to spin the server up entirely with randomly generated stubbed data: 
As soon as the front and backend agree on the endpoint, the backend can have a running server for the front end to develop with.
Finally the endpointForSchema is an optional argument, which when present, creates an endpoint at (in this case) '/endpointSchema'
which serves up all of the raw schema kept in the sourceDir. 
   