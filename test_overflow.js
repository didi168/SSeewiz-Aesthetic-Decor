import subprocess
import json
import os

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# We can run chrome with --dump-dom or evaluate a script by injecting an inspector snippet or using Node with a lightweight CDP or script.
# Actually, we can write a tiny Node script that uses chrome remote debugging or fetch
script = """
const { execSync } = require('child_process');

console.log('Testing overflow detection...');
"""
