# Tempo API

This application is based on [node-gtfs](https://www.npmjs.com/package/gtfs) and is designed to work as an API for [Synchrobus Tempo](https://github.com/Iteatime/tempo-react).

## Requirements

- **Node.js version 10 or later.** You can download it [here](https://nodejs.org/en/download/)
- **MongoDB.** Installation instructions [here](https://docs.mongodb.com/manual/administration/install-community/)

## Installation

[Clone this repository](https://help.github.com/en/articles/cloning-a-repository) or download it.

Invoke a command line tool at the installation directory and install the application's dependencies using:

`npm install`

## Running

Make sure that the MongoDB service is running (refer back to the [installation instructions](https://docs.mongodb.com/manual/administration/install-community/) if it's not).

Run the application using:

`nodemon server`

At this point, the console should read:

```
[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node server.js`
Listening on port 4000
Database is connected
```

If you can read this, then everything is working fine.

In order to ensure the application is actually working, you can navigate to [http://localhost:4000/](http://localhost:4000/), which should return the following message: `Tempo API is up and running!`.

You can now connect to Synchrobus Tempo and upload your GTFS file.

## API Reference

### GET `/`

Returns a friendly message, in order to check the API is working fine.

### GET `/file`

Returns a JSON representation of the last GTFS file which was uploaded to the API.

- `name`: The file's name, stripped of its `.zip` extension
- `date`: The upload date

### POST `/file`

Retrieves a GTFS file and stores the data it holds into MongoDB for further use. The file must be a standard GTFS `.zip` file with `.txt` files stored directly inside (not in a subdirectory).

Read more on the GTFS standard format [here](https://developers.google.com/transit/gtfs/).

Returns a **204** response if the file was imported succesfully, a **500** error otherwise.

### GET `/config`

Returns Tempo configuration data that was previously saved.

Format specification:

> For each **route id**
>> For each **direction id** (0 or 1)
>>> - **anotations**: For each **special** code *(of route in direction)*
>>>> - **symbol**: The name of the symbol to display alongside stop times relevant to the annotation
>>>> - **text**: The caption to display at the bottom of the time sheet
>>> - **frequencies**: An array of objects featuring the properties of each frequency display range:
>>>> - **start**: The start time of the period
>>>> - **end**: The end time of the period
>>>> - **timing**: How often a bus shows up during the given period

### POST `/config`

Retrieves Tempo's current configuration and stores it in the database.

Returns a **204** response if the configuration was written succesfully, a **500** error otherwise.

### POST `/query`

Send a query to the **node-gtfs** client. Read more on how to query node-gtfs [here](https://github.com/BlinkTagInc/node-gtfs#gtfsgetagenciesquery-projection-options).

The POST request must include a JSON object with the following parameters:

- method: A string representation of the desired node-gtfs method's name.
- params: A JSON object containing the parameters you would pass to that node-gtfs method.

Returns the request's results as an array of JSON objects.

### POST `/timetables`

Returns GTFS data arranged in a format designed specifically to display timetables of every stop in Synchrobus Tempo. Optionnally, you may pass an array of route names along with the POST request. If you do, this endpoint will only return data related to those routes.

Format specification:

> For each **route id**
>> For each **direction id** (0 or 1)
>>> - **headsigns**: For each **stop id** *(of route in direction)*
>>>> An array of last stop names (useful for branched routes) 
>>> - **name**: A human-readable direction name for UI display
>>> - **special**: A list of all special codes found in trips on this route/direction
>>> - **stops**: A list of all stop names along this route/direction
>>> - **times**: For each **stop id** *(of route in direction)*
>>>> For each **period id** *(found in all **stop times** related to stop in route and direction)*
>>>>> An array of **stop times** *(from period at stop in route and direction)*

Example ouput *(where each `{...}` is a **stop time** object)*:

```
[
    "Route-1": [
        0: {
            headsigns: ["Stop B"],
            name: "Stop B",
            special: ["1-0010000"],
            stops: ["Stop A", "Stop B"],
            times: {
                "Stop A": {
                    "Week": [
                        {...},
                        {...},
                        {...},
                    ],
                    "Weekend": [
                        {...},
                        {...},
                        {...},
                    ],
                },
                "Stop B": {
                    "Week": [
                        {...},
                        {...},
                        {...},
                    ],
                    "Weekend": [
                        {...},
                        {...},
                        {...},
                    ],
                },
            },
        },

        1: {
            headsigns: ["Stop A"],
            name: "Stop A",
            special: ["1-0010000"],
            stops: ["Stop B", "Stop A"],
            times: {
                "Stop A": {
                    "Week": [
                        {...},
                        {...},
                        {...},
                    ],
                    "Weekend": [
                        {...},
                        {...},
                        {...},
                    ],
                },
                "Stop B": {
                    "Week": [
                        {...},
                        {...},
                        {...},
                    ],
                    "Weekend": [
                        {...},
                        {...},
                        {...},
                    ],
                },
            },
        },
    ],
]
```
