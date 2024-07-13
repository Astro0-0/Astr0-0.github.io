from flask import Flask, render_template, jsonify
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run-script')
def run_script():
    try:
        result = subprocess.run(['python', 'auth.py'], capture_output=True, text=True)
        output = result.stdout
    except Exception as e:
        output = str(e)
    
    return jsonify({'output': output})

if __name__ == '__main__':
    app.run(debug=True)
