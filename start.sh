#!/bin/bash
# Usage: ./start.sh

docker run --name=jupyterlab -itd -p 8888:8888 cropsinsilico/jupyterlab