FROM ndslabs/jupyterlab:0.34.10

USER root

# Install OS dependencies
RUN apt-get update && \
    apt-get install -y curl sudo screen vim

# Install NodeJS and NPM
RUN wget https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
    sudo apt-get install -y nodejs npm

USER jovyan

# Set up common JupyterLab extensions
RUN jupyter labextension install @jupyterlab/plotly-extension @jupyterlab/launcher-extension @jupyter-widgets/jupyterlab-manager @jupyterlab/hub-extension

# Set up Cy-JupyterLab extension
RUN git clone https://github.com/idekerlab/cy-jupyterlab /home/jovyan/work/cy-jupyterlab
WORKDIR /home/jovyan/work/cy-jupyterlab
RUN git reset --hard cbb12372f9f108d2329a56aeac3d32aaf4440c33 && \
    jupyter labextension install

# Set up plugin working directory
ENV SRCDIR="/home/jovyan/work/jupyterlab_cis"
RUN mkdir -p $SRCDIR
WORKDIR $SRCDIR

# Install NPM dependencies
RUN npm install -g typescript
COPY --chown=jovyan:users package.json .
RUN npm install

# Copy in our extension source
COPY --chown=jovyan:users src/* ./src/
COPY --chown=jovyan:users style/* ./style/
COPY --chown=jovyan:users tsconfig.json .

# Perform TypeScript compile and install extension
RUN jupyter labextension install

# Install cis_interface (from source)
RUN git clone https://github.com/cropsinsilico/cis_interface /home/jovyan/work/cis_interface
WORKDIR /home/jovyan/work/cis_interface
RUN ls -al && \
    cat /home/jovyan/work/cis_interface/cis_interface/defaults.cfg && \
    sed -i -e "s/startup_waittime_s = 10/startup_waittime_s = 30/g" "/home/jovyan/work/cis_interface/cis_interface/defaults.cfg" && \
    echo "Changed defaults:" && \
    cat /home/jovyan/work/cis_interface/cis_interface/defaults.cfg && \
    python setup.py install

# Add documentation last
WORKDIR /home/jovyan

# Enable nbgitpuller extension
RUN pip install nbgitpuller ipywidgets matlab_kernel plotly networkx && \
    jupyter serverextension enable --py nbgitpuller --sys-prefix

# Add future MATLAB location to our PATH
ENV PATH=/usr/local/matlab/bin/:$PATH \
    IFRAME_SRC_URL="https://dev.cis-tacc.ndslabs.org/#/"

COPY --chown=jovyan:users Dockerfile README.md entrypoint.sh /

CMD [ "/entrypoint.sh" ]
