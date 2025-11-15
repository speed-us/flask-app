from flask import Flask, render_template
import json
import os

app = Flask(__name__)

@app.route("/")
def hello_world():
    # Load JSON data
    json_path = os.path.join(os.path.dirname(__file__), 'info.jason')
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return render_template("home.html", data=data)
    except FileNotFoundError:
        return f"Error: JSON file not found at {json_path}", 500
    except json.JSONDecodeError as e:
        return f"Error: Invalid JSON in file - {str(e)}", 500
    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)