"""
Flipkart Listing Helper API
---------------------------
This Flask API serves as the backend for the Flipkart Listing Helper Chrome Extension.
It provides endpoints for auto-filling listing details and price management.

Author: Shahid-XT
"""

import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import fill_details, price_fix

# Initialize Flask application
app = Flask(__name__)

# Configure CORS for all API endpoints
CORS(app, resources={
    r"/api/*": {"origins": "*"},
    r"/price/*": {"origins": "*"},
    r"/test/*": {"origins": "*"},
    r"/test/": {"origins": "*"}
})


@app.route('/api', methods=['POST'])
def process_listing_details():
    """
    Process and fill in listing details on Flipkart seller page.
    
    Accepts a JSON payload with all necessary listing fields and
    automates the data entry process using keyboard simulation.
    
    Returns:
        JSON response indicating success status
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": False, "message": "No data provided"}), 400
        
        fill_details(data)
        return jsonify({"status": True, "message": "Listing details applied successfully"})
    
    except Exception as e:
        # Log the error (would be better with a proper logging system)
        print(f"Error processing listing details: {str(e)}")
        return jsonify({"status": False, "message": f"An error occurred: {str(e)}"}), 500


@app.route('/test', methods=['POST', 'GET'])
def test_connection():
    """
    Test endpoint to verify the API is running and accessible.
    
    Returns:
        JSON response with status=True if the server is running
    """
    return jsonify({"status": True, "message": "Server is running correctly"})


@app.route('/price', methods=['POST'])
def process_price_adjustment():
    """
    Process price adjustments based on market average price.
    
    Extracts the average price from the provided text and
    applies it to the listing using keyboard simulation.
    
    Returns:
        JSON response indicating success status
    """
    try:
        data = request.get_json()
        if not data or 'data' not in data:
            return jsonify({"status": False, "message": "Invalid data format"}), 400
        
        # Extract price from the provided text
        pattern = r'Average price is (\d+)\.'
        match = re.search(pattern, data['data'])
        
        if match:
            allowed_price = match.group(1)
            price_fix(allowed_price)
            return jsonify({
                "status": True, 
                "message": f"Price adjusted to {allowed_price}"
            })
        else:
            return jsonify({
                "status": False, 
                "message": "Could not extract price information"
            }), 400
    
    except Exception as e:
        # Log the error
        print(f"Error processing price adjustment: {str(e)}")
        return jsonify({"status": False, "message": f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    # Run the Flask application
    print("Starting Flipkart Listing Helper API...")
    app.run(debug=True, host='0.0.0.0', port=5000)