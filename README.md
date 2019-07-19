# Tempo API

This application is based on [node-gtfs](https://www.npmjs.com/package/gtfs) and is designed to work as an API for [Synchrobus Tempo](https://github.com/Iteatime/tempo-react).

## How to install

### Step 1: Install Node.js

Download [Node.js installer](https://nodejs.org/en/) (version 10 or later), then follow the instructions.

### Step 2: Install MongoDB

Follow the instructions provided in [this page](https://docs.mongodb.com/manual/administration/install-community/) to install MongoDB according to your OS.

### Step 3: Download this repository

Click the *clone or download* button to download this repository as a ZIP file then extract it in your desired directory using a ZIP file extractor like [7Zip](https://www.7-zip.org/).

### Step 4: Install dependencies

Navigate to the repository folder, then run the following command from your terminal to install the application's required dependencies.

`npm install`

### Step 5: Connect MongoDB

From the same terminal instance, run the following command to launch the MongoDB client.

`mongo`

### Step 6: Run the application

From the same terminal instance, run the following command to actually start the applicaiton.

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

In order to test the application, you can navigate to [http://localhost:4000/](http://localhost:4000/), which should return the following message: `Tempo API is up and running!`.

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
>>> For each **stop id** *(of route in direction)*
>>>> For each **period id** *(found in all **stop times** related to stop in route and direction)*
>>>>> An array of **stop times** *(from period at stop in route and direction)*

Example ouput *(where each `{...}` is a **stop time** object)*:

```
[
    "Route-1": [
        0: {
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

        1: {
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
        },
    ],
]
```