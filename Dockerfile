FROM ndslabs/jupyterlab:0.34.10

USER root

# Install OS dependencies
RUN apt-get update && \
    apt-get install -y curl sudo screen vim

# Install NodeJS and NPM
RUN wget https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
    sudo apt-get install -y nodejs npm

# Set up plugin working directory
USER jovyan
ENV SRCDIR="/home/jovyan/work/jupyterlab_cis"
RUN mkdir -p $SRCDIR
WORKDIR $SRCDIR

# Install NPM dependencies
COPY package.json .
RUN npm install

# Copy in our extension source
COPY src/* ./src/
COPY style/* ./style/
COPY tsconfig.json .

# Perform TypeScript compile and install extension
RUN npm install -g typescript
RUN jupyter labextension install

# Set up Cy-JupyterLab extension
RUN git clone https://github.com/idekerlab/cy-jupyterlab /home/jovyan/work/cy-jupyterlab
WORKDIR /home/jovyan/work/cy-jupyterlab
RUN git reset --hard cbb12372f9f108d2329a56aeac3d32aaf4440c33 && \
    jupyter labextension install

# Set up Plotly JupyterLab extension
RUN jupyter labextension install @jupyterlab/plotly-extension
RUN jupyter labextension install @jupyter-widgets/jupyterlab-manager

# Add documentation last
COPY Dockerfile README.md ./
WORKDIR /home/jovyan

# Enable nbgitpuller extension
RUN pip install nbgitpuller yggdrasil ipywidgets matlab_kernel plotly networkx && \
    jupyter serverextension enable --py nbgitpuller --sys-prefix

# Add future MATLAB location to our PATH
ENV PATH=/usr/local/matlab/bin/:$PATH
