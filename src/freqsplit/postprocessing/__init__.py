# __init__.py

import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    format='%(asctime)s : %(message)s',
    level = logging.INFO
)

logging.info("freq-split-enhance/postprocessing package has been imported.")