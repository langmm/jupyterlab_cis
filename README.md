# JupyterLab cis-extension

Show a Crops in Silico Model Composer in a JupyterLab panel


# Prerequisites

* JupyterLab
* Docker (optional)

# With Docker
## Build
Build the Docker image:
```bash
docker build -t cropsinsilico/jupyterlab .
```

Or use the helper script:
```bash
./build.sh
```

## Start JupyterLab
Run a Docker container from the built image:
```bash
docker run --name=jupyterlab -itd -p 8888:8888 cropsinsilico/jupyterlab
```

Or use the helper script:
```bash
./start.sh
```

Run `docker logs -f jupyterlab` to retrieve the URL / token to access your server.


### Stop JupyterLab
Stop and remove the running container:
```bash
docker rm -f jupyterlab
```

Or use the helper script:
```bash
./stop.sh
```

## Develop
Map the extension source code into the running container using `-v <src>:<dest>`:
```bash
docker run --name=jupyterlab -itd -v $(pwd):/home/jovyan/work/jupyterlab_cis -p 8888:8888 cropsinsilico/jupyterlab
```

### IDE
You can then use any IDE on your host to edit the files locally.

If you don't have an IDE locally, you can run Cloud9 in a container and map
in the same source.

Choose a `USERNAME` and `PASSWORD`, then run:
```bash
docker run --name=cloud9 -itd -v $(pwd):/workspace -p 8080:8080 ndslabs/cloud9-all node /cloud9/server.js -p 8080 -l 0.0.0.0 -a <USERNAME>:<PASSWORD> -w /workspace
```

You should then be able to browser to `localhost:8080` in your browser to access your Cloud9 IDE.

NOTE: You should be prompted for the `USERNAME` / `PASSWORD` you chose prior.

**WARNING: This authentication method is INSECURE over HTTP. Use HTTPS if you want
to keep your credentials safe.**

# Without Docker
Although running in Docker is recommended, it should still be possible to use 
the extension without it.

## Installation

```bash
git clone https://github.com/cropsinsilico/jupyterlab_cis && cd jupyterlab_cis/
jupyter labextension install
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

