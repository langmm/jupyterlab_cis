#!/bin/bash

# Replace config.url with env var
for file in `find /opt/conda/share/jupyter/lab/static -type f -exec grep "cis-tacc" {} + | cut -f1 -d:`
do 
    echo $file
    sed "s?https\:\/\/dev\.cis-tacc\.ndslabs\.org?${IFRAME_SRC_URL}?g" -i $file
done

# Start JupyterLab
jupyter lab
