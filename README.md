# Github-Visualisation

### Stage 1 - API Calls

Open the project in a terminal and enter
```sh
./docker-build.sh
```
to build the docker image. Then enter
```sh
./docker-build.sh <repo owner username> <repo name> <your username> <your personal access token>
```
to gather the data

---

### Stage 2 - Visualisation

Move to the github_visualisation directory. Then move to src directory. Open the App.js and enter the repon owner on line 16 and the repo name on line 17. Move back to the 
github_visualisation directory and run

```sh
./build.sh
```
to build the docker image. Then run
```sh
./run.sh
```
to run the visualisation. The visualisation will run on localhost:3000 on your browser.
