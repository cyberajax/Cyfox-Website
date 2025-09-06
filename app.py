from flask import Flask, render_template_string, request, jsonify, session, Response
import datetime
import json
import uuid
import requests
import os
from functools import wraps
from user_agents import parse

app = Flask(__name__)
app.secret_key = "cyfox_elite_cybersecurity_secret_key_2025"
app.config['PERMANENT_SESSION_LIFETIME'] = datetime.timedelta(minutes=30)

# Ensure log files exist
if not os.path.exists('log.txt'):
    with open('log.txt', 'w') as f:
        f.write("VISITOR_LOG_STARTED\n")

if not os.path.exists('submit.txt'):
    with open('submit.txt', 'w') as f:
        f.write("FORM_SUBMISSIONS_LOG\n")


# === Basic Auth Credentials ===
USERNAME = "Pranay"
PASSWORD = "9764318520"

def check_auth(username, password):
    return username == USERNAME and password == PASSWORD

def authenticate():
    return Response('Access denied. Login required.', 401,
        {'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

def get_client_ip():
    if request.environ.get('HTTP_X_FORWARDED_FOR'):
        return request.environ['HTTP_X_FORWARDED_FOR'].split(',')[0].strip()
    elif request.environ.get('HTTP_X_REAL_IP'):
        return request.environ['HTTP_X_REAL_IP']
    elif request.environ.get('HTTP_CLIENT_IP'):
        return request.environ['HTTP_CLIENT_IP']
    else:
        return request.environ.get('REMOTE_ADDR', '127.0.0.1')

def get_geolocation(ip):
    try:
        if ip == '127.0.0.1' or ip.startswith('192.168.'):
            ip = '8.8.8.8'
        response = requests.get(f"http://ip-api.com/json/{ip}", timeout=5)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Geolocation error: {e}")
    return {
        "country": "Unknown",
        "region": "Unknown",
        "city": "Unknown",
        "lat": 0.0,
        "lon": 0.0,
        "timezone": "Unknown",
        "isp": "Unknown"
    }

def log_visitor_data(data):
    try:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {json.dumps(data, indent=2)}\n{'='*100}\n"
        with open('log.txt', 'a', encoding='utf-8') as f:
            f.write(log_entry)
    except Exception as e:
        print(f"Visitor log error: {e}")

def log_form_submission(data):
    try:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] FORM_SUBMISSION\n{json.dumps(data, indent=2)}\n{'='*50}\n"
        with open('submit.txt', 'a', encoding='utf-8') as f:
            f.write(log_entry)
    except Exception as e:
        print(f"Form log error: {e}")


@app.before_request
def track_visitor():
    if request.endpoint == 'collect_fingerprint':
        return
    try:
        ip = get_client_ip()
        ua = request.headers.get('User-Agent', '')
        parsed_ua = parse(ua)
        geo = get_geolocation(ip)

        if 'session_id' not in session:
            session['session_id'] = str(uuid.uuid4())
            session.permanent = True

        visitor_data = {
            "session_id": session['session_id'],
            "timestamp": datetime.datetime.now().isoformat(),
            "ip_address": ip,
            "user_agent": ua,
            "browser": {
                "name": parsed_ua.browser.family,
                "version": parsed_ua.browser.version_string,
                "is_bot": parsed_ua.is_bot
            },
            "os": {
                "name": parsed_ua.os.family,
                "version": parsed_ua.os.version_string
            },
            "device": {
                "family": parsed_ua.device.family,
                "brand": parsed_ua.device.brand,
                "model": parsed_ua.device.model,
                "is_mobile": parsed_ua.is_mobile,
                "is_tablet": parsed_ua.is_tablet,
                "is_pc": parsed_ua.is_pc
            },
            "request_info": {
                "method": request.method,
                "url": request.url,
                "path": request.path,
                "referrer": request.referrer,
                "query_string": request.query_string.decode(),
                "accept_language": request.headers.get('Accept-Language', ''),
                "accept_encoding": request.headers.get('Accept-Encoding', '')
            },
            "geolocation": geo,
            "fingerprint_collected": False
        }
        log_visitor_data(visitor_data)
    except Exception as e:
        print(f"Visitor tracking error: {e}")

@app.route('/')
def index():
    return render_template_string(get_html_template())

@app.route('/collect-fingerprint', methods=['POST'])
def collect_fingerprint():
    try:
        fingerprint_data = request.get_json()
        enhanced = {
            "server_timestamp": datetime.datetime.now().isoformat(),
            "ip_address": get_client_ip(),
            "session_id": session.get('session_id', 'unknown'),
            "user_agent": request.headers.get('User-Agent', ''),
            "fingerprint": fingerprint_data
        }
        log_visitor_data(enhanced)
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"Fingerprint error: {e}")
        return jsonify({"status": "error", "message": str(e)})

@app.route('/track-pixel')
def track_pixel():
    try:
        data = request.args.get('data', '{}')
        pixel_data = {
            "method": "pixel_tracking",
            "timestamp": datetime.datetime.now().isoformat(),
            "ip_address": get_client_ip(),
            "data": data
        }
        log_visitor_data(pixel_data)

        # Transparent 1x1 GIF
        pixel = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00'
            b'\x00\x00\x00\x00\x00\x00\x21\xF9\x04\x01\x00\x00\x00'
            b'\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02'
            b'\x04\x01\x00\x3B'
        )
        return pixel, 200, {'Content-Type': 'image/gif'}
    except Exception as e:
        print(f"Pixel error: {e}")
        return '', 200

@app.route('/submit-form', methods=['POST'])
def submit_form():
    try:
        form_data = request.get_json()
        enhanced_data = {
            "server_timestamp": datetime.datetime.now().isoformat(),
            "ip_address": get_client_ip(),
            "session_id": session.get('session_id', 'unknown'),
            "form_data": form_data
        }
        log_form_submission(enhanced_data)
        return jsonify({"status": "success", "message": "Form submitted successfully"})
    except Exception as e:
        print(f"Form submission error: {e}")
        return jsonify({"status": "error", "message": str(e)})


@app.route('/submissions')
@requires_auth
def view_submissions():
    try:
        with open('submit.txt', 'r', encoding='utf-8') as f:
            submit_logs = f.read()
    except Exception as e:
        submit_logs = f"[Error reading submit.txt] {e}"

    try:
        with open('log.txt', 'r', encoding='utf-8') as f:
            visitor_logs = f.read()
    except Exception as e:
        visitor_logs = f"[Error reading log.txt] {e}"

    html = f"""
    <html>
        <head>
            <title>CYFOX | Submissions Log Viewer</title>
            <style>
                body {{
                    font-family: monospace;
                    background: #111;
                    color: #0f0;
                    padding: 20px;
                }}
                h1 {{
                    color: #0ff;
                }}
                pre {{
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    background: #000;
                    border: 1px solid #0f0;
                    padding: 1rem;
                    margin-bottom: 3rem;
                }}
            </style>
        </head>
        <body>
            <h1>📬 FORM SUBMISSIONS</h1>
            <pre>{submit_logs}</pre>
            <h1>🕵️ VISITOR LOGS</h1>
            <pre>{visitor_logs}</pre>
        </body>
    </html>
    """
    return html



def get_html_template():
    """Returns the HTML template with advanced tracking"""
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CYFOX - Elite Cybersecurity Club</title>
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>
    <div class="cursor"></div>

    <canvas class="matrix-bg" id="matrixCanvas"></canvas>
    <canvas class="geometric-bg" id="geometricCanvas"></canvas>

    <!-- Hidden canvases for fingerprinting -->
    <canvas class="fingerprint-canvas" id="canvasFingerprint" width="300" height="150"></canvas>
    <canvas class="fingerprint-canvas" id="webglFingerprint" width="256" height="128"></canvas>

    <nav>
        <div class="nav-container">
            <div class="logo glitch">CYFOX</div>
            <ul class="nav-links">
                <li><a href="#home">HOME</a></li>
                <li><a href="#about">ABOUT</a></li>
                <li><a href="#team">TEAM</a></li>
                <li><a href="#events">EVENTS</a></li>
                <li><a href="#join">JOIN</a></li>
            </ul>
        </div>
    </nav>

    <section class="hero" id="home">
        <div class="container">
            <h1 class="glitch">CYFOX</h1>
            <p>ELITE CYBERSECURITY COLLECTIVE CLUB</p>
            <button class="cta-button" onclick="document.getElementById('join').scrollIntoView({behavior: 'smooth'})">
                HACK THE FUTURE
            </button>
        </div>
    </section>

    <section class="about" id="about">
        <div class="container">
            <h2>DECODE THE MATRIX</h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem; font-family: 'Fira Code', monospace;">
                We are the digital guardians, the code breakers, the cyber defenders of tomorrow.
            </p>

            <div class="features-grid">
                

                <div class="feature-card">
                    <div class="feature-icon">🔍</div>
                    <h3>Ethical Hacking</h3>
                    <p>Learn penetration testing and vulnerability assessment techniques.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">🧠</div>
                    <h3>AI Security</h3>
                    <p>Explore the intersection of artificial intelligence and cybersecurity.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">🌐</div>
                    <h3>Network Forensics</h3>
                    <p>Investigate digital crimes and analyze network traffic patterns.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="team-section" id="team">
        <div class="container">
            <h2>CORE TEAM // OPERATORS</h2>
            <div class="team-slider-container">
                <div class="team-slider">
                    <div class="team-card">
                        <img src="static\e.jpg" alt="Team Member 1">
                        <h3>DIVYANSHU MAURYA</h3>
                        <p>Founder Of CYFOX</p>
                    </div>
                    <div class="team-card">
                        <img src="static\owner.jpg" alt="Team Member 1">
                        <h3>PRANAY AGRAWAL</h3>
                        <p>Network Security and Forensics Expert</p>
                    </div>
                    <div class="team-card">
                        <img src="static\goyanka.jpg" alt="Team Member 1">
                        <h3>ARPIT </h3>
                        <p>AI Security Specialist</p>
                    </div>
                    <div class="team-card">
                        <img src="static\c.jpg" alt="Team Member 1">
                        <h3>TAPAN</h3>
                        <p>AISE HI AAGYA KOI SKILL NHI HAI </p>
                    </div>
                    <div class="team-card">
                        <img src="static\d.jpg" alt="Team Member 1">
                        <h3>RITHIK</h3>
                        <p>Malware Analyst</p>
                    </div>
                    <div class="team-card">
                        <img src="static\akshay.jpg" alt="Team Member 1">
                        <h3>AKSHAY</h3>
                        <p>Threat Intelligence Lead</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="form-section" id="join">
        <div class="container">
            <div class="form-container">
                <h2>JOIN THE COLLECTIVE</h2>
                <form id="membershipForm">
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" name="fullName" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required>
                    </div>

                    <div class="form-group">
                        <label for="experience">Experience Level</label>
                        <select id="experience" name="experience" required>
                            <option value="">Select Level</option>
                            <option value="beginner">Script Kiddie</option>
                            <option value="intermediate">White Hat</option>
                            <option value="advanced">Elite Hacker</option>
                            <option value="expert">Cyber Ninja</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="interests">Areas of Interest</label>
                        <textarea id="interests" name="interests" rows="4" placeholder="Web Security, Cryptography, Malware Analysis, etc."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="motivation">Why do you want to join CYFOX?</label>
                        <textarea id="motivation" name="motivation" rows="4" required></textarea>
                    </div>

                    <button type="submit" class="submit-btn">
                        INITIATE SEQUENCE
                    </button>
                </form>
            </div>
        </div>
    </section>

    <script src="/static/tracking.js"></script>
    <script src="/static/animations.js"></script>
</body>
</html>'''

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

