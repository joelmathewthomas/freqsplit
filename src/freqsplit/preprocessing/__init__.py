# __init__.py

import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    format='%(asctime)s : %(message)s',
    level = logging.INFO
)

logging.info("freqsplit/preprocessing package has been imported.")