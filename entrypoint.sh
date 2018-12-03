#!/bin/bash

# Replace config.url with env var
echo "export const iframe_url = \"${IFRAME_SRC_URL}\"" > "$SRCDIR/src/config.js"

# Rebuild extension
cd $SRCDIR
jupyter labextension install

# Start JupyterLab
cd /home/jovyan
jupyter lab
