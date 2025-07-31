#!/bin/bash

# Start the first process
./celery.sh &

# Start the second process
./daphne.sh &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
