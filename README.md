# Tempo

This application is based on [node-gtfs](https://www.npmjs.com/package/gtfs) and is designed to work as an API for [Synchrobus Tempo](https://github.com/Iteatime/tempo-react).

## How To start:

### Step 1 Requirements:

- Download [Node.js version 10.x: latest](https://nodejs.org/en/download/)   
- Download [MongoDB installer](https://www.mongodb.com/download-center/community?jmp=docs) (version 4 or later) as MSI  file, then follow the instructions provided in [this page](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#download-mdb-edition) to install MongoDB as a Windows service.
 
### Step 2: Download this repository

Click the *clone or download* button to download this repository as a ZIP filem then extract it in your desired directory using a ZIP file extractor like [7Zip](https://www.7-zip.org/).

### Step 3 Installation:

Here you have to:
- Move in the directory of the project using `cd` command
example:`cd Bureau/tempo-api`
- Use `npm install` command

### Step 4: Run bundled command file

This repository comes with a command file named `run.bat`. Run it **with administration privileges** and wait for the process to complete.

Here's what the command file does:

- `npm install`: Install the application's required dependencies.
- `"C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"`: Connect MongoDB with the application.
- `nodemon server`: Run the application in a local server.

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

You can now connect to Synchrobus Tempo and upload your GTFS file.

### 5 Unit tests:



### 6 Continous deployment:

The code pushed on this repo is continously deployed to [Netlify](https://www.netlify.com/).

```
If you can read this, then everything is working fine.

You can now connect to Synchrobus Tempo and upload your GTFS file.
