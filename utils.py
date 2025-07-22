"""
Keyboard Event Automation Module
-------------------------------
This module provides functions to automate keyboard interactions
for filling Flipkart seller listing forms.

Author: Shahid-XT
"""

import time
import keyboard
import random
import string
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Track used random words to avoid duplicates
used_random_words = set()

# Constants
TYPING_DELAY = 0.07
TAB_DELAY = 0.1


def sleep(seconds=TYPING_DELAY):
    """
    Pause execution for the specified number of seconds.
    
    Args:
        seconds (float): Time to sleep in seconds
    """
    time.sleep(seconds)


def tab():
    """Press tab key with appropriate delay."""
    keyboard.press_and_release("tab")
    time.sleep(TAB_DELAY)


def type_value(value):
    """
    Type a value with proper handling and logging.
    
    Args:
        value (str): The value to type
    """
    if value is None:
        logger.warning("Attempted to type None value")
        return
    
    try:
        keyboard.write(str(value))
        sleep()
    except Exception as e:
        logger.error(f"Error typing value: {str(e)}")


def price_fix(value):
    """
    Clear existing price value and enter new price.
    
    Args:
        value (str): The price value to enter
    """
    try:
        # Clear existing value (backspace 5 times)
        for _ in range(5):
            keyboard.press_and_release('backspace')
        
        # Type new value
        type_value(value)
        logger.info(f"Price adjusted to: {value}")
    except Exception as e:
        logger.error(f"Error fixing price: {str(e)}")


def generate_unique_random_word():
    """
    Generate a unique random word that hasn't been used before.
    
    Returns:
        str: A unique random alphanumeric word
    """
    while True:
        word_length = random.randint(2, 5)
        characters = string.ascii_letters + string.digits
        random_word = ''.join(random.choice(characters) for _ in range(word_length))
        
        if random_word not in used_random_words:
            used_random_words.add(random_word)
            return random_word


def select_tax_code(tax_code):
    """
    Select the appropriate tax code by simulating keyboard navigation.
    
    Args:
        tax_code (str): The tax code to select
    """
    tax_code_map = {
        "18": "ggg",       # Press 'g' 3 times
        "0": "g",          # Press 'g' 1 time
        "12": "gg",        # Press 'g' 2 times
        "5": "gggggg",     # Press 'g' 6 times
        "28": "gggg",      # Press 'g' 4 times
        "3": "ggggg"       # Press 'g' 5 times
    }
    
    # Default to "18" tax code if not found
    key_sequence = tax_code_map.get(str(tax_code), "ggggggg")
    
    # Type each 'g' in the sequence
    for key in key_sequence:
        keyboard.write(key)


def select_country(country_code):
    """
    Select the appropriate country by simulating keyboard navigation.
    
    Args:
        country_code (str): The country code to select (I for India, C for China)
    """
    if country_code == "I":
        keyboard.write("II")  # India
    else:
        keyboard.write("ccccccccc")  # China


def fill_details(data):
    """
    Fill in the Flipkart listing form using keyboard simulation.
    
    Args:
        data (dict): Dictionary containing all form field values
    """
    try:
        logger.info("Starting to fill listing details")
        
        # Add a random suffix to SKU to ensure uniqueness
        random_word = generate_unique_random_word()
        sku_with_suffix = f"{data['sku']} {random_word}"
        
        # SKU Field
        type_value(sku_with_suffix)
        tab()
        
        # Listing Status
        type_value(data["listingStatus"])
        tab()
        
        # MRP and Price
        type_value(data["mrp"])
        tab()
        type_value(data["price"])
        tab()
        
        # Min Order Quantity
        type_value(data["minOq"])
        tab()
        
        # Fulfillment
        type_value(data["fulfilment"])
        tab()
        
        # Procurement Type
        type_value(data["procurementType"])
        tab()
        
        # SLA
        type_value(data["sla"])
        tab()
        
        # Stock
        type_value(data["stock"])
        tab()
        
        # Shipping Provider
        type_value(data["shippingProvider"])
        tab()
        
        # Delivery Charges (if enabled)
        if data.get("isdelivaryyyy"):
            # Local Delivery Charge
            type_value(data["localDeliveryCharge"])
            tab()
            
            # Zonal Delivery Charge
            type_value(data["zonalDeliveryCharge"])
            tab()
            
            # National Delivery Charge
            type_value(data["nationalDeliveryCharge"])
            tab()
        
        # Product Dimensions
        type_value(data["length"])
        tab()
        type_value(data["breath"])
        tab()
        type_value(data["height"])
        tab()
        type_value(data["weight"])
        tab()
        
        # HSN Code
        type_value(data["hsn"])
        tab()
        tab()  # Skip to tax code field
        
        # Tax Code
        logger.info(f"Setting tax code: {data.get('taxCode', '18')}")
        select_tax_code(data.get("taxCode"))
        tab()
        
        # Country of Origin
        select_country(data.get("country", "I"))
        tab()
        
        # Manufacturer Details
        type_value(data["manufacturerDetails"])
        tab()
        
        # Packer Details
        type_value(data["packerDetails"])
        tab()
        
        # Importer Details (only if country is not India)
        if data.get("country") != "I":
            type_value(data["importerDetails"])
            tab()
        
        # Manufacturing date and shelf life (if enabled)
        if data.get("isManufacturingdate"):
            # Process date to reverse format (DD-MM-YYYY)
            date_parts = data["manudate"].split("-")
            
            reversed_date = date_parts[1],date_parts[2],date_parts[0]
                
            # Enter each part of the date
            for part in reversed_date:
                type_value(part)
            
            tab()
            tab()
            type_value(data["slife"])
        
        logger.info("Successfully filled all listing details")
    
    except Exception as e:
        logger.error(f"Error filling details: {str(e)}")
        raise  # Re-raise the exception to handle it upstream