echo "Setting up virtual environments"

mkdir envs

#Create common env
echo "Creating common virtual environment env"
python -m venv envs/env

#Create env for tensorflow
echo "Creating virtual environment env_tensorflow"
python -m venv envs/env_tensorflow

source envs/env/bin/activate
echo "Installing dependencies in virtual environment env"
pip install -r requirements/env.txt
deactivate

source envs/env_tensorflow/bin/activate
pip install -r requirements/env_tensorflow.txt
deactivate

echo "Creating site-packages.pth"
touch site-packages.pth
echo "env/env/lib/python3.12/site-packages" >> site-packages.pth
echo "env/env_tensorflow/lib/python3.12/site-packages" >> site-packages.pth
