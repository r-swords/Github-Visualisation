docker build -t github_visualisation:latest .
docker run --rm -it -v ${PWD}:/app -p 3000:3000 github_visualisation:latest
