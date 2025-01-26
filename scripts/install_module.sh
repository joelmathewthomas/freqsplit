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

# List all environments in the envs/ directory
echo "Available environments:"
env_count=0
envs_list=()

for env_dir in envs/*; do
    if [ -d "$env_dir" ]; then
        env_name=$(basename "$env_dir")
        envs_list+=("$env_name")
        echo "$((env_count + 1)). $env_name"
        ((env_count++))
    fi
done

# Check if any environments exist
if [ "$env_count" -eq 0 ]; then
    echo "No environments found in 'envs/'. Please create them first."
    exit 1
fi

# Ask the user to select an environment
read -p "Select an environment (1-$env_count): " env_choice

# Validate the user's choice
if [[ ! "$env_choice" =~ ^[0-9]+$ ]] || [ "$env_choice" -lt 1 ] || [ "$env_choice" -gt "$env_count" ]; then
    echo "Invalid choice. Please select a number between 1 and $env_count."
    exit 1
fi

# Get the selected environment name
selected_env="${envs_list[$((env_choice - 1))]}"

# Ask the user for the module they want to install
read -p "Enter the module you want to install in the '$selected_env' environment: " module_name

# Function to install a module in the selected environment
install_module() {
    local env_dir=$1
    local module=$2

    echo "Activating environment '$env_dir' and installing module '$module'..."
    source "$env_dir/bin/activate"  # Activate the environment
    pip install "$module"  # Install the module
    deactivate  # Deactivate the environment
    echo "Module '$module' installed successfully in '$env_dir'."
}

# Install the module in the selected environment
install_module "envs/$selected_env" "$module_name"

echo "Module installation complete."

