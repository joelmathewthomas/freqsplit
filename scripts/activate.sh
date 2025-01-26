#!/bin/bash

# Define the paths for the environments
ENV_1_PATH="envs/env"
ENV_2_PATH="envs/env_tensorflow"

# Check if the environments exist
if [ ! -d "$ENV_1_PATH" ] || [ ! -d "$ENV_2_PATH" ]; then
    echo "One or both environments do not exist in the 'envs/' directory."
    exit 1
fi

# Activate the first environment (default)
echo "Activating environment '$ENV_1_PATH'..."
source "$ENV_1_PATH/bin/activate"

# Export PYTHONPATH to include both environments' site-packages
export PYTHONPATH="$PWD/$ENV_1_PATH/lib/python3.12/site-packages:$PWD/$ENV_2_PATH/lib/python3.12/site-packages"

echo "Environment set up successfully. PYTHONPATH set to include both environments."

# Optionally, print the current PYTHONPATH to verify
echo "PYTHONPATH=${PYTHONPATH}"
