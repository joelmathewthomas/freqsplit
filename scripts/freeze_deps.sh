#!/bin/bash

# Check if the script is running in the root directory of the project
PROJECT_ROOT="freq-split-enhance"
CURRENT_DIR=$(basename "$PWD")

if [ "$CURRENT_DIR" != "$PROJECT_ROOT" ]; then
    echo "This script must be run in the root directory of the project: '$PROJECT_ROOT'."
    exit 1
fi

# Check if the envs/ directory exists
if [ ! -d "envs" ]; then
    echo "Directory 'envs/' does not exist. Please make sure it exists and contains the required environments. Please run the scripts/setup_env.sh script."
    exit 1
fi

# Check if the requirements/ directory exists, create it if not
if [ ! -d "requirements" ]; then
    echo "Directory 'requirements/' does not exist. Creating it..."
    mkdir requirements
fi

# Function to freeze the dependencies of an environment
freeze_env_deps() {
    local env_dir=$1
    local requirements_file=$2

    echo "Freezing dependencies for environment '$env_dir'..."
    source "$env_dir/bin/activate"  # Activate the environment
    pip freeze > "$requirements_file"  # Freeze the dependencies
    deactivate  # Deactivate the environment
    echo "Dependencies for '$env_dir' saved to '$requirements_file'."
}

# Loop through all the environments inside envs/
for env_dir in envs/*; do
    if [ -d "$env_dir" ]; then
        env_name=$(basename "$env_dir")
        requirements_file="requirements/$env_name.txt"
        freeze_env_deps "$env_dir" "$requirements_file"
    fi
done

echo "Dependencies for all environments have been successfully frozen."

