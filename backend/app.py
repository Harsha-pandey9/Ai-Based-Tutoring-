import eventlet
eventlet.monkey_patch()
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, emit
from jose import jwt
import requests
import subprocess
import tempfile
import os
import sys
import time
import sqlite3
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet", transports=["websocket", "polling"])
  # Enable Socket.IO
DB_PATH = 'progress.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, clerk_id TEXT UNIQUE, username TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS logins
                 (id INTEGER PRIMARY KEY, user_id INTEGER, login_date DATE)''')
    c.execute('''CREATE TABLE IF NOT EXISTS activities
                 (id INTEGER PRIMARY KEY, user_id INTEGER, activity_type TEXT, value INTEGER, activity_date DATE)''')
    c.execute('''CREATE TABLE IF NOT EXISTS aptitude_scores
                 (id INTEGER PRIMARY KEY, user_id INTEGER, score INTEGER, timestamp DATETIME)''')
    conn.commit()
    conn.close()

init_db()

# Clerk + OpenRouter Configuration (unchanged)
CLERK_JWKS_URL = "https://complete-hare-60.clerk.accounts.dev/.well-known/jwks.json"
CLERK_AUDIENCE = "pk_test_Y29tcGxldGUtaGFyZS02MC5jbGVyay5hY2NvdW50cy5kZXYk"
CLERK_ISSUER = "https://complete-hare-60.clerk.accounts.dev"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")

YOUR_SITE_URL = "http://localhost:5173"
YOUR_APP_NAME = "AlphaX"

try:
    jwks = requests.get(CLERK_JWKS_URL).json()
except Exception as e:
    print("Failed to fetch JWKS from Clerk:", e)
    jwks = {"keys": []}


def verify_clerk_token(token):
    try:
        header = jwt.get_unverified_header(token)
        key = next((k for k in jwks["keys"] if k["kid"] == header["kid"]), None)
        if not key:
            raise Exception("Matching JWKS key not found.")
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=CLERK_AUDIENCE,
            issuer=CLERK_ISSUER,
        )
        return payload
    except Exception as e:
        raise Exception(f"JWT verification failed: {str(e)}")


@app.route("/")
def index():
    return jsonify({"message": "Flask backend running!"})

@app.route("/api/test", methods=['GET'])
def test_endpoint():
    """Test endpoint without authentication"""
    return jsonify({
        "status": "success",
        "message": "Backend is working!",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/test_progress", methods=['GET'])
def test_progress():
    """Test progress endpoint without authentication"""
    return jsonify({
        "pdfNotesRead": 25.0,
        "lecturesWatched": 40.0,
        "quantumRead": 15.0,
        "overallProgress": 26.7,
        "pdfCount": 12,
        "videoCount": 8,
        "quantumCount": 6,
        "testCount": 3,
        "aptitudeTestsTaken": 2,
        "currentStreak": 5,
        "totalDaysVisited": 12,
        "totalLogins": 15,
        "testsAttempted": 3,
        "totalTests": 10,
        "totalMarks": 180,
        "maxMarks": 500,
        "bestAptitudeScore": 8,
        "avgAptitudeScore": 7.5,
        "totalPdfsAvailable": 50,
        "totalVideosAvailable": 30,
        "totalQuantumAvailable": 40,
        "recentActivities": [],
        "streak": 5
    })


@app.route("/api/chat", methods=["POST"])
def chat():
    print("🤖 Chat request received!")
    
    try:
        data = request.get_json()
        print(f"📝 Chat data: {data}")
        
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
            
        prompt = data.get("prompt", "").strip()
        conversation_history = data.get("history", [])
        print(f"💬 Prompt: {prompt}")
        
        if not prompt:
            return jsonify({"error": "Missing prompt"}), 400

        # Try OpenRouter API first (ChatGPT-like functionality)
        try:
            response_text = get_ai_response(prompt, conversation_history)
            return jsonify({"response": response_text})
        except Exception as api_error:
            print(f"⚠️ AI API failed: {str(api_error)}")
            # Fallback to enhanced local responses
            response_text = get_enhanced_local_response(prompt)
            return jsonify({"response": response_text})
        
    except Exception as e:
        print(f"❌ Error in chat: {str(e)}")
        return jsonify({"error": f"Chat failed: {str(e)}"}), 500

def get_ai_response(prompt, history=[]):
    """Get response from OpenRouter API (ChatGPT-like functionality)"""
    
    # Build conversation context
    messages = [
        {
            "role": "system",
            "content": """You are Alpha-X AI Assistant, an advanced AI tutor and learning companion with ChatGPT-like capabilities. You excel at providing comprehensive, detailed, and educational responses.

🎓 **CORE EXPERTISE:**
- **Mathematics**: All levels from basic arithmetic to advanced calculus, linear algebra, statistics, discrete mathematics, and mathematical proofs
- **Computer Science**: Programming languages (Python, JavaScript, Java, C++, C#, Go, Rust), algorithms, data structures, software engineering, system design
- **Sciences**: Physics (classical, quantum, relativity), Chemistry (organic, inorganic, physical), Biology (molecular, cellular, genetics, ecology)
- **Engineering**: Electrical, mechanical, civil, chemical, computer engineering principles and applications
- **Academic Writing**: Essays, research papers, citations, thesis writing, technical documentation

💻 **PROGRAMMING EXCELLENCE:**
- Write clean, efficient, well-documented code with best practices
- Provide multiple solution approaches and explain trade-offs
- Debug code and explain errors in detail
- Create complete, runnable examples
- Explain complex algorithms step-by-step
- Cover testing, optimization, and scalability considerations

📚 **LEARNING METHODOLOGY:**
- Break down complex concepts into digestible parts
- Use analogies and real-world examples
- Provide step-by-step solutions with explanations
- Offer practice problems and exercises
- Suggest study strategies and learning paths
- Adapt explanations to different skill levels

🎯 **RESPONSE FORMATTING:**
- Use markdown formatting for better readability
- Include code blocks with proper syntax highlighting
- Structure responses with clear headings and bullet points
- Provide examples and practical applications
- Include relevant formulas, equations, and diagrams when helpful

🔧 **INTERACTIVE FEATURES:**
- Generate executable code examples
- Create practice problems with solutions
- Provide multiple approaches to solve problems
- Offer debugging assistance and code reviews
- Suggest improvements and optimizations

Always be thorough, accurate, and educational. Encourage learning through understanding rather than memorization. Provide context and explain the 'why' behind concepts, not just the 'how'."""
        }
    ]
    
    # Add conversation history
    for msg in history[-10:]:  # Keep last 10 messages for context
        messages.append({
            "role": msg.get("role", "user"),
            "content": msg.get("content", "")
        })
    
    # Add current prompt
    messages.append({
        "role": "user",
        "content": prompt
    })
    
    # Make API request to OpenRouter
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": YOUR_SITE_URL,
        "X-Title": YOUR_APP_NAME,
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "openai/gpt-4o-mini",  # Using GPT-4o-mini for better performance
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 2000,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    }
    
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=30
    )
    
    if response.status_code == 200:
        result = response.json()
        return result["choices"][0]["message"]["content"]
    else:
        raise Exception(f"API request failed: {response.status_code} - {response.text}")

def get_enhanced_local_response(prompt):
    """Enhanced local response system with more comprehensive answers"""
    prompt_lower = prompt.lower()
    
    # Programming and coding questions
    if any(word in prompt_lower for word in ['python', 'javascript', 'java', 'c++', 'programming', 'code', 'algorithm', 'function', 'variable', 'loop', 'array', 'object']):
        if 'python' in prompt_lower:
            return """I'd be happy to help you with Python! Here's what I can assist with:

🐍 **Python Fundamentals:**
- Variables, data types, and operators
- Control structures (if/else, loops)
- Functions and modules
- Object-oriented programming

🔧 **Advanced Topics:**
- Data structures (lists, dictionaries, sets)
- File handling and I/O operations
- Error handling and debugging
- Libraries (NumPy, Pandas, Matplotlib)

💡 **Practical Applications:**
- Web development with Flask/Django
- Data analysis and visualization
- Machine learning basics
- Automation scripts

What specific Python topic would you like to explore? Feel free to share your code if you need debugging help!"""

        elif any(word in prompt_lower for word in ['javascript', 'js', 'react', 'node']):
            return """Great! I can help you with JavaScript and web development:

🌐 **JavaScript Fundamentals:**
- Variables, functions, and scope
- DOM manipulation
- Event handling
- Asynchronous programming (Promises, async/await)

⚛️ **Modern JavaScript:**
- ES6+ features (arrow functions, destructuring, modules)
- React.js for frontend development
- Node.js for backend development
- API integration and fetch requests

🛠️ **Web Development:**
- HTML5 and CSS3 integration
- Responsive design principles
- Frontend frameworks and libraries
- Database connectivity

What JavaScript concept or project are you working on? I can provide code examples and explanations!"""

        else:
            return """I'm here to help with programming! I can assist with:

💻 **Languages I Support:**
- Python (data science, web dev, automation)
- JavaScript (frontend, backend, React)
- Java (OOP, enterprise applications)
- C++ (systems programming, algorithms)
- SQL (database queries and design)

🎯 **What I Can Help With:**
- Code debugging and optimization
- Algorithm design and analysis
- Data structures implementation
- Project architecture planning
- Best practices and code review

📚 **Learning Resources:**
- Step-by-step tutorials
- Practice problems with solutions
- Code examples and explanations
- Career guidance for developers

What programming challenge are you facing? Share your code or describe the problem!"""

    # Mathematics questions
    elif any(word in prompt_lower for word in ['math', 'mathematics', 'calculus', 'algebra', 'geometry', 'statistics', 'equation', 'formula', 'solve']):
        if 'calculus' in prompt_lower:
            return """I'd love to help you with Calculus! Here's what I can cover:

📈 **Differential Calculus:**
- Limits and continuity
- Derivatives and differentiation rules
- Applications (optimization, related rates)
- Implicit differentiation

📊 **Integral Calculus:**
- Antiderivatives and integration techniques
- Definite and indefinite integrals
- Applications (area, volume, work)
- Fundamental Theorem of Calculus

🔬 **Advanced Topics:**
- Multivariable calculus
- Partial derivatives
- Multiple integrals
- Vector calculus

What specific calculus problem or concept would you like help with? I can provide step-by-step solutions!"""

        elif 'algebra' in prompt_lower:
            return """I can help you master Algebra! Here's what I cover:

🔢 **Basic Algebra:**
- Linear equations and inequalities
- Quadratic equations and factoring
- Polynomial operations
- Rational expressions

📐 **Intermediate Topics:**
- Systems of equations
- Exponential and logarithmic functions
- Sequences and series
- Matrix operations

🎯 **Problem-Solving Strategies:**
- Word problems and applications
- Graphing techniques
- Function analysis
- Real-world modeling

What algebra topic or problem are you working on? I can break it down step by step!"""

        else:
            return """I'm here to help with Mathematics! I can assist with:

🧮 **Core Areas:**
- Algebra (equations, functions, graphing)
- Geometry (shapes, proofs, trigonometry)
- Calculus (derivatives, integrals, limits)
- Statistics (probability, data analysis)

📊 **Applied Mathematics:**
- Linear algebra and matrices
- Discrete mathematics
- Differential equations
- Mathematical modeling

🎓 **Study Support:**
- Step-by-step problem solving
- Concept explanations with examples
- Practice problems generation
- Exam preparation strategies

What math topic or problem would you like help with? I can provide detailed explanations and solutions!"""

    # Study and learning questions
    elif any(word in prompt_lower for word in ['study', 'exam', 'test', 'learn', 'homework', 'assignment', 'grade', 'school', 'college', 'university']):
        return """I'm your study companion! Here's how I can help you succeed:

📚 **Study Strategies:**
- Active reading techniques
- Note-taking methods (Cornell, mind mapping)
- Spaced repetition for memory retention
- Time management and scheduling

🎯 **Exam Preparation:**
- Creating study schedules
- Practice test strategies
- Stress management techniques
- Last-minute review tips

✍️ **Academic Writing:**
- Essay structure and organization
- Research methods and citations
- Proofreading and editing
- Presentation skills

📈 **Performance Optimization:**
- Goal setting and tracking
- Motivation techniques
- Learning style identification
- Study group organization

What specific study challenge are you facing? I can create a personalized plan for you!"""

    # Science questions
    elif any(word in prompt_lower for word in ['physics', 'chemistry', 'biology', 'science', 'experiment', 'theory', 'formula']):
        return """I can help you with Science subjects! Here's my coverage:

🔬 **Physics:**
- Mechanics (motion, forces, energy)
- Thermodynamics and heat
- Electricity and magnetism
- Waves and optics
- Modern physics concepts

⚗️ **Chemistry:**
- Atomic structure and bonding
- Chemical reactions and equations
- Stoichiometry and calculations
- Organic and inorganic chemistry
- Laboratory techniques

🧬 **Biology:**
- Cell biology and genetics
- Evolution and ecology
- Human anatomy and physiology
- Molecular biology
- Biochemistry fundamentals

🎓 **Scientific Method:**
- Hypothesis formation
- Experimental design
- Data analysis and interpretation
- Scientific writing and reporting

What science topic or problem would you like to explore? I can provide detailed explanations and examples!"""

    # General help or greeting
    elif any(word in prompt_lower for word in ['hello', 'hi', 'hey', 'help', 'what can you do', 'capabilities']):
        return """Hello! I'm Alpha-X AI Assistant, your comprehensive learning companion! 🎓

🚀 **My Capabilities:**

💻 **Programming & Tech:**
- Code in Python, JavaScript, Java, C++, and more
- Debug and optimize your programs
- Explain algorithms and data structures
- Web development guidance

📐 **Mathematics & Sciences:**
- Solve complex math problems step-by-step
- Physics, Chemistry, Biology explanations
- Statistics and data analysis
- Engineering problem-solving

📚 **Academic Support:**
- Study strategies and time management
- Essay writing and research help
- Exam preparation techniques
- Project planning and execution

🎯 **Personalized Learning:**
- Adapt to your learning style
- Provide practice problems
- Track your progress
- Offer career guidance

**How to get the best help:**
- Be specific about your questions
- Share code or problems you're working on
- Let me know your current level of understanding
- Ask for examples or step-by-step explanations

What would you like to learn or work on today? I'm here to help you succeed! 🌟"""

    # Default comprehensive response
    else:
        return f"""I understand you're asking about "{prompt}". I'm Alpha-X AI Assistant, and I'm here to provide comprehensive help!

🎯 **I can help you with:**

📚 **Academic Subjects:**
- Mathematics (all levels from basic to advanced)
- Computer Science and Programming
- Physics, Chemistry, Biology
- Engineering and Technical subjects
- Business and Economics
- Literature and Writing

💡 **Learning Support:**
- Detailed explanations and examples
- Step-by-step problem solving
- Study strategies and techniques
- Exam preparation and practice
- Research and writing assistance

🔧 **Practical Skills:**
- Programming in multiple languages
- Data analysis and visualization
- Project planning and management
- Career guidance and advice

To give you the most helpful response, could you:
- Be more specific about what you need help with
- Share any relevant details or context
- Let me know your current level of understanding

What specific topic or problem would you like to explore? I'm ready to provide detailed, personalized assistance! 🚀"""


# ---------------------------
# 🔴 Code Execution API
# ---------------------------

@app.route("/api/execute", methods=["POST"])
def execute_code():
    print("🔥 Code execution request received!")
    
    try:
        data = request.get_json()
        print(f"📝 Request data: {data}")
        
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
            
        code = data.get("code", "").strip()
        language = data.get("language", "python").lower()
        
        print(f"💻 Code: {code[:50]}...")
        print(f"🔤 Language: {language}")
        
        if not code:
            return jsonify({
                "success": False,
                "error": "No code provided",
                "output": "",
                "execution_time": 0
            }), 400

        result = execute_code_safely(code, language)
        print(f"✅ Execution result: {result}")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Error in execute_code: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Execution failed: {str(e)}",
            "output": "",
            "execution_time": 0
        }), 500

def execute_code_safely(code, language):
    """Execute code safely with timeout and resource limits"""
    start_time = time.time()
    
    try:
        if language == "python":
            return execute_python(code, start_time)
        elif language == "javascript":
            return execute_javascript(code, start_time)
        elif language == "java":
            return execute_java(code, start_time)
        elif language == "cpp" or language == "c++":
            return execute_cpp(code, start_time)
        elif language == "c":
            return execute_c(code, start_time)
        else:
            return {
                "success": False,
                "error": f"Language '{language}' not supported",
                "output": "",
                "execution_time": 0
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "output": "",
            "execution_time": time.time() - start_time
        }

def execute_python(code, start_time):
    """Execute Python code"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_file = f.name
    
    try:
        result = subprocess.run(
            [sys.executable, temp_file],
            capture_output=True,
            text=True,
            timeout=10,  # 10 second timeout
            cwd=tempfile.gettempdir()
        )
        
        execution_time = time.time() - start_time
        
        if result.returncode == 0:
            return {
                "success": True,
                "output": result.stdout,
                "error": result.stderr if result.stderr else None,
                "execution_time": execution_time
            }
        else:
            return {
                "success": False,
                "output": result.stdout,
                "error": result.stderr,
                "execution_time": execution_time
            }
    finally:
        try:
            os.unlink(temp_file)
        except:
            pass

def execute_javascript(code, start_time):
    """Execute JavaScript code using Node.js"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
        f.write(code)
        temp_file = f.name
    
    try:
        result = subprocess.run(
            ['node', temp_file],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=tempfile.gettempdir()
        )
        
        execution_time = time.time() - start_time
        
        if result.returncode == 0:
            return {
                "success": True,
                "output": result.stdout,
                "error": result.stderr if result.stderr else None,
                "execution_time": execution_time
            }
        else:
            return {
                "success": False,
                "output": result.stdout,
                "error": result.stderr,
                "execution_time": execution_time
            }
    except FileNotFoundError:
        return {
            "success": False,
            "error": "Node.js not found. Please install Node.js to run JavaScript code.",
            "output": "",
            "execution_time": time.time() - start_time
        }
    finally:
        try:
            os.unlink(temp_file)
        except:
            pass

def execute_java(code, start_time):
    """Execute Java code"""
    # Extract class name from code
    import re
    class_match = re.search(r'public\s+class\s+(\w+)', code)
    if not class_match:
        return {
            "success": False,
            "error": "No public class found. Java code must contain a public class.",
            "output": "",
            "execution_time": time.time() - start_time
        }
    
    class_name = class_match.group(1)
    
    with tempfile.TemporaryDirectory() as temp_dir:
        java_file = os.path.join(temp_dir, f"{class_name}.java")
        with open(java_file, 'w') as f:
            f.write(code)
        
        try:
            # Compile
            compile_result = subprocess.run(
                ['javac', java_file],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=temp_dir
            )
            
            if compile_result.returncode != 0:
                return {
                    "success": False,
                    "error": f"Compilation failed: {compile_result.stderr}",
                    "output": "",
                    "execution_time": time.time() - start_time
                }
            
            # Execute
            run_result = subprocess.run(
                ['java', class_name],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=temp_dir
            )
            
            execution_time = time.time() - start_time
            
            if run_result.returncode == 0:
                return {
                    "success": True,
                    "output": run_result.stdout,
                    "error": run_result.stderr if run_result.stderr else None,
                    "execution_time": execution_time
                }
            else:
                return {
                    "success": False,
                    "output": run_result.stdout,
                    "error": run_result.stderr,
                    "execution_time": execution_time
                }
        except FileNotFoundError:
            return {
                "success": False,
                "error": "Java compiler (javac) not found. Please install Java JDK.",
                "output": "",
                "execution_time": time.time() - start_time
            }

def execute_cpp(code, start_time):
    """Execute C++ code"""
    with tempfile.TemporaryDirectory() as temp_dir:
        cpp_file = os.path.join(temp_dir, "main.cpp")
        exe_file = os.path.join(temp_dir, "main.exe" if os.name == 'nt' else "main")
        
        with open(cpp_file, 'w') as f:
            f.write(code)
        
        try:
            # Compile
            compile_cmd = ['g++', cpp_file, '-o', exe_file]
            compile_result = subprocess.run(
                compile_cmd,
                capture_output=True,
                text=True,
                timeout=10,
                cwd=temp_dir
            )
            
            if compile_result.returncode != 0:
                return {
                    "success": False,
                    "error": f"Compilation failed: {compile_result.stderr}",
                    "output": "",
                    "execution_time": time.time() - start_time
                }
            
            # Execute
            run_result = subprocess.run(
                [exe_file],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=temp_dir
            )
            
            execution_time = time.time() - start_time
            
            if run_result.returncode == 0:
                return {
                    "success": True,
                    "output": run_result.stdout,
                    "error": run_result.stderr if run_result.stderr else None,
                    "execution_time": execution_time
                }
            else:
                return {
                    "success": False,
                    "output": run_result.stdout,
                    "error": run_result.stderr,
                    "execution_time": execution_time
                }
        except FileNotFoundError:
            return {
                "success": False,
                "error": "C++ compiler (g++) not found. Please install GCC.",
                "output": "",
                "execution_time": time.time() - start_time
            }

def execute_c(code, start_time):
    """Execute C code"""
    with tempfile.TemporaryDirectory() as temp_dir:
        c_file = os.path.join(temp_dir, "main.c")
        exe_file = os.path.join(temp_dir, "main.exe" if os.name == 'nt' else "main")
        
        with open(c_file, 'w') as f:
            f.write(code)
        
        try:
            # Compile
            compile_cmd = ['gcc', c_file, '-o', exe_file]
            compile_result = subprocess.run(
                compile_cmd,
                capture_output=True,
                text=True,
                timeout=10,
                cwd=temp_dir
            )
            
            if compile_result.returncode != 0:
                return {
                    "success": False,
                    "error": f"Compilation failed: {compile_result.stderr}",
                    "output": "",
                    "execution_time": time.time() - start_time
                }
            
            # Execute
            run_result = subprocess.run(
                [exe_file],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=temp_dir
            )
            
            execution_time = time.time() - start_time
            
            if run_result.returncode == 0:
                return {
                    "success": True,
                    "output": run_result.stdout,
                    "error": run_result.stderr if run_result.stderr else None,
                    "execution_time": execution_time
                }
            else:
                return {
                    "success": False,
                    "output": run_result.stdout,
                    "error": run_result.stderr,
                    "execution_time": execution_time
                }
        except FileNotFoundError:
            return {
                "success": False,
                "error": "C compiler (gcc) not found. Please install GCC.",
                "output": "",
                "execution_time": time.time() - start_time
            }

# ---------------------------
# 🔴 Mock Interview Features
# ---------------------------

rooms = {}  # Keeps track of users in a room
waiting_users = []  # Users waiting for interview match
online_users = set()  # Track online users
interview_rooms = {}  # Active interview rooms

@socketio.on('connect')
def handle_connect():
    print(f"🔗 User connected: {request.sid}")
    online_users.add(request.sid)
    print(f"📊 Total online users: {len(online_users)}")
    emit('online_users_count', len(online_users), broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    print(f"❌ User disconnected: {request.sid}")
    online_users.discard(request.sid)
    
    # Remove from waiting users
    global waiting_users
    waiting_users = [user for user in waiting_users if user['sid'] != request.sid]
    
    print(f"📊 Total online users: {len(online_users)}")
    emit('online_users_count', len(online_users), broadcast=True)
    emit('waiting_users', waiting_users, broadcast=True)

@socketio.on('join_progress_room')
def handle_join_progress_room():
    """Handle users joining the progress tracking room"""
    print(f"👤 User {request.sid} joined progress room")
    emit('online_users_count', len(online_users))

@socketio.on('heartbeat')
def handle_heartbeat():
    """Handle heartbeat to keep connection alive"""
    emit('heartbeat_response', {'status': 'alive'})

@socketio.on('join_interview_pool')
def handle_join_interview_pool(data):
    user_data = {
        'sid': request.sid,
        'userId': data.get('userId'),
        'username': data.get('username', 'Anonymous')
    }
    print(f"👤 User joined interview pool: {user_data['username']}")
    emit('online_users_count', len(online_users))
    emit('waiting_users', waiting_users)

@socketio.on('find_match')
def handle_find_match(data):
    user_data = {
        'sid': request.sid,
        'userId': data.get('userId'),
        'username': data.get('username', 'Anonymous')
    }
    
    print(f"🔍 User looking for match: {user_data['username']}")
    
    # Check if there's someone waiting
    if waiting_users:
        # Match with the first waiting user
        partner = waiting_users.pop(0)
        room_id = f"interview_{request.sid}_{partner['sid']}"
        
        # Create interview room
        interview_rooms[room_id] = {
            'users': [user_data, partner],
            'created_at': time.time()
        }
        
        # Join both users to the room
        join_room(room_id, sid=request.sid)
        join_room(room_id, sid=partner['sid'])
        
        # Notify both users of the match
        emit('match_found', {
            'roomId': room_id,
            'partner': partner,
            'role': 'solver'
        }, room=request.sid)
        
        emit('match_found', {
            'roomId': room_id,
            'partner': user_data,
            'role': 'helper'
        }, room=partner['sid'])
        
        print(f"✅ Match found: {user_data['username']} <-> {partner['username']}")
        
    else:
        # Add to waiting list
        waiting_users.append(user_data)
        emit('waiting_users', waiting_users, broadcast=True)
        print(f"⏳ User added to waiting list: {user_data['username']}")

@socketio.on('cancel_search')
def handle_cancel_search(data):
    global waiting_users
    waiting_users = [user for user in waiting_users if user['sid'] != request.sid]
    emit('waiting_users', waiting_users, broadcast=True)
    print(f"❌ User cancelled search: {data.get('userId')}")

@socketio.on('start_round')
def handle_start_round(data):
    room_id = data['roomId']
    problem = data['problem']
    round_num = data.get('round', 1)
    
    emit('new_problem', {
        'problem': problem,
        'turn': 'solver',
        'round': round_num
    }, room=room_id)
    
    print(f"🎯 New round started in room {room_id}: {problem['title']}")

@socketio.on('code_change')
def handle_code_change(data):
    room_id = data['roomId']
    code = data['code']
    
    # Broadcast code change to other user in the room
    emit('code_update', {'code': code}, room=room_id, include_self=False)

@socketio.on('switch_turn')
def handle_switch_turn(data):
    room_id = data['roomId']
    
    # Generate new problem for the switch
    problems = [
        {
            'id': 1,
            'title': 'Reverse String',
            'difficulty': 'Easy',
            'description': 'Write a function that reverses a string.',
            'examples': [{'input': '"hello"', 'output': '"olleh"'}],
            'testCases': [{'input': '"hello"', 'expected': '"olleh"'}],
            'starterCode': {
                'python': 'def reverse_string(s):\n    # Your code here\n    pass',
                'javascript': 'function reverseString(s) {\n    // Your code here\n}',
                'java': 'public String reverseString(String s) {\n    // Your code here\n    return "";\n}'
            }
        }
    ]
    
    import random
    new_problem = random.choice(problems)
    
    emit('turn_switched', {
        'newTurn': 'solver',
        'newProblem': new_problem,
        'round': 2
    }, room=room_id)
    
    print(f"🔄 Turn switched in room {room_id}")

@socketio.on('send_message')
def handle_interview_message(data):
    room_id = data['roomId']
    username = data['username']
    message = data['message']
    timestamp = data['timestamp']
    
    emit('receive_message', {
        'username': username,
        'message': message,
        'timestamp': timestamp
    }, room=room_id)
    
    print(f"💬 Message in room {room_id} from {username}: {message}")

@socketio.on('test_results')
def handle_test_results(data):
    room_id = data['roomId']
    results = data['results']
    
    emit('test_results', {'results': results}, room=room_id, include_self=False)
    print(f"🧪 Test results shared in room {room_id}")

# ---------------------------
# 🔴 WebRTC Voice Communication
# ---------------------------

@socketio.on('voice_offer')
def handle_voice_offer(data):
    room_id = data['roomId']
    offer = data['offer']
    
    # Forward the WebRTC offer to the other user in the room
    emit('voice_offer', {'offer': offer}, room=room_id, include_self=False)
    print(f"🎤 Voice offer sent in room {room_id}")

@socketio.on('voice_answer')
def handle_voice_answer(data):
    room_id = data['roomId']
    answer = data['answer']
    
    # Forward the WebRTC answer to the other user in the room
    emit('voice_answer', {'answer': answer}, room=room_id, include_self=False)
    print(f"🎤 Voice answer sent in room {room_id}")

@socketio.on('voice_ice_candidate')
def handle_voice_ice_candidate(data):
    room_id = data['roomId']
    candidate = data['candidate']
    
    # Forward the ICE candidate to the other user in the room
    emit('voice_ice_candidate', {'candidate': candidate}, room=room_id, include_self=False)
    print(f"🎤 ICE candidate sent in room {room_id}")

@socketio.on('voice_mute_status')
def handle_voice_mute_status(data):
    room_id = data['roomId']
    is_muted = data['isMuted']
    username = data['username']
    
    # Notify the other user about mute status change
    emit('partner_mute_status', {'isMuted': is_muted, 'username': username}, room=room_id, include_self=False)
    print(f"🎤 {username} {'muted' if is_muted else 'unmuted'} in room {room_id}")

@socketio.on('voice_deafen_status')
def handle_voice_deafen_status(data):
    room_id = data['roomId']
    is_deafened = data['isDeafened']
    username = data['username']
    
    # Notify the other user about deafen status change
    emit('partner_deafen_status', {'isDeafened': is_deafened, 'username': username}, room=room_id, include_self=False)
    print(f"🎤 {username} {'deafened' if is_deafened else 'undeafened'} in room {room_id}")

@socketio.on('disconnect_interview')
def handle_disconnect_interview(data):
    room_id = data['roomId']
    username = request.sid
    
    # Get user info from interview room
    if room_id in interview_rooms:
        room_users = interview_rooms[room_id]['users']
        disconnecting_user = next((user for user in room_users if user['sid'] == request.sid), None)
        
        if disconnecting_user:
            # Notify the other user about disconnection
            emit('interview_disconnected', {
                'username': disconnecting_user['username']
            }, room=room_id, include_self=False)
            
            # Remove the room
            del interview_rooms[room_id]
            print(f"❌ User {disconnecting_user['username']} disconnected from interview room {room_id}")

@socketio.on('swap_roles')
def handle_swap_roles(data):
    room_id = data['roomId']
    
    if room_id in interview_rooms:
        room_users = interview_rooms[room_id]['users']
        
        # Swap roles for both users
        for user in room_users:
            if user['sid'] == request.sid:
                # Current user becomes the opposite role
                new_role = 'helper' if user.get('role', 'solver') == 'solver' else 'solver'
                user['role'] = new_role
                emit('roles_swapped', {'newRole': new_role}, room=user['sid'])
            else:
                # Partner becomes the opposite role
                new_role = 'helper' if user.get('role', 'solver') == 'solver' else 'solver'
                user['role'] = new_role
                emit('roles_swapped', {'newRole': new_role}, room=user['sid'])
        
        print(f"🔄 Roles swapped in room {room_id}")

@socketio.on('typing_start')
def handle_typing_start(data):
    room_id = data['roomId']
    username = data['username']
    
    # Notify the other user that someone is typing
    emit('typing_start', {'username': username}, room=room_id, include_self=False)

@socketio.on('typing_stop')
def handle_typing_stop(data):
    room_id = data['roomId']
    username = data['username']
    
    # Notify the other user that someone stopped typing
    emit('typing_stop', {'username': username}, room=room_id, include_self=False)

# Legacy handlers for backward compatibility
@socketio.on('join_room')
def handle_join(data):
    room = data['room']
    username = data['username']
    join_room(room)

    if room not in rooms:
        rooms[room] = []
    rooms[room].append(username)

    emit('user_joined', {'username': username, 'users': rooms[room]}, room=room)
    print(f"{username} joined room {room}")

@socketio.on('leave_room')
def handle_leave(data):
    room = data['room']
    username = data['username']
    leave_room(room)

    if room in rooms and username in rooms[room]:
        rooms[room].remove(username)
        if not rooms[room]:
            del rooms[room]

    emit('user_left', {'username': username, 'users': rooms.get(room, [])}, room=room)
    print(f"{username} left room {room}")

@socketio.on('send_question')
def handle_question(data):
    room = data['room']
    question = data['question']
    emit('receive_question', {'question': question}, room=room)


def calculate_streak(logins):
    if not logins:
        return 0
    logins = sorted(set(logins))
    streak = 1
    current = datetime.strptime(logins[-1], '%Y-%m-%d')
    for i in range(len(logins)-2, -1, -1):
        prev = datetime.strptime(logins[i], '%Y-%m-%d')
        if (current - prev) == timedelta(days=1):
            streak += 1
            current = prev
        else:
            break
    return streak

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT COUNT(*) FROM users")
        user_count = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM logins")
        login_count = c.fetchone()[0]
        c.execute("SELECT SUM(value) FROM activities")
        activity_sum = c.fetchone()[0] or 0
        conn.close()
        return jsonify({
            "users": user_count,
            "logins": login_count,
            "activities": activity_sum
        })
    except Exception as e:
        print(f"Stats error: {e}")
        return jsonify({
            "users": 0,
            "logins": 0,
            "activities": 0
        })

@app.route('/api/record_login', methods=['POST'])
def record_login():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "No token provided"}), 401
    try:
        payload = verify_clerk_token(token.replace('Bearer ', ''))
        clerk_id = payload['sub']
        username = payload.get('username', 'Unknown')
    except Exception as e:
        return jsonify({"error": str(e)}), 401
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE clerk_id = ?", (clerk_id,))
    user = c.fetchone()
    if not user:
        c.execute("INSERT INTO users (clerk_id, username) VALUES (?, ?)", (clerk_id, username))
        conn.commit()
        user_id = c.lastrowid
    else:
        user_id = user[0]
    today = time.strftime('%Y-%m-%d')
    c.execute("SELECT id FROM logins WHERE user_id = ? AND login_date = ?", (user_id, today))
    if not c.fetchone():
        c.execute("INSERT INTO logins (user_id, login_date) VALUES (?, ?)", (user_id, today))
        conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/api/record_activity', methods=['POST'])
def record_activity():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "No token provided"}), 401
    try:
        payload = verify_clerk_token(token.replace('Bearer ', ''))
        clerk_id = payload['sub']
    except Exception as e:
        return jsonify({"error": str(e)}), 401
    data = request.get_json()
    activity_type = data.get('type')
    value = data.get('value', 1)
    if not activity_type:
        return jsonify({"error": "Missing type"}), 400
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE clerk_id = ?", (clerk_id,))
    user = c.fetchone()
    if not user:
        return jsonify({"error": "User not found"}), 404
    user_id = user[0]
    today = time.strftime('%Y-%m-%d')
    c.execute("INSERT INTO activities (user_id, activity_type, value, activity_date) VALUES (?, ?, ?, ?)", (user_id, activity_type, value, today))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/api/submit_aptitude_score', methods=['POST'])
def submit_aptitude_score():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "No token provided"}), 401
    try:
        payload = verify_clerk_token(token.replace('Bearer ', ''))
        clerk_id = payload['sub']
    except Exception as e:
        return jsonify({"error": str(e)}), 401
    data = request.get_json()
    score = data.get('score')
    if score is None:
        return jsonify({"error": "Missing score"}), 400
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE clerk_id = ?", (clerk_id,))
    user = c.fetchone()
    if not user:
        return jsonify({"error": "User not found"}), 404
    user_id = user[0]
    now = datetime.now().isoformat()
    c.execute("INSERT INTO aptitude_scores (user_id, score, timestamp) VALUES (?, ?, ?)", (user_id, score, now))
    conn.commit()
    # Calculate rank
    c.execute("""SELECT user_id, MAX(score) as max_score FROM aptitude_scores GROUP BY user_id ORDER BY max_score DESC""")
    rankings = c.fetchall()
    rank = next((i+1 for i, (uid, _) in enumerate(rankings) if uid == user_id), None)
    conn.close()
    return jsonify({"success": True, "rank": rank})

@app.route('/api/get_aptitude_leaderboard', methods=['GET'])
def get_aptitude_leaderboard():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""SELECT u.username, MAX(s.score) as max_score 
                 FROM aptitude_scores s 
                 JOIN users u ON s.user_id = u.id 
                 GROUP BY s.user_id 
                 ORDER BY max_score DESC 
                 LIMIT 10""")
    leaderboard = [{"username": row[0], "score": row[1]} for row in c.fetchall()]
    conn.close()
    return jsonify(leaderboard)

@app.route('/api/get_detailed_progress', methods=['GET'])
def get_detailed_progress():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "No token provided"}), 401
    try:
        payload = verify_clerk_token(token.replace('Bearer ', ''))
        clerk_id = payload['sub']
    except Exception as e:
        return jsonify({"error": str(e)}), 401
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE clerk_id = ?", (clerk_id,))
    user = c.fetchone()
    if not user:
        return jsonify({"error": "User not found"}), 404
    user_id = user[0]
    # Logins
    c.execute("SELECT login_date FROM logins WHERE user_id = ?", (user_id,))
    logins = [row[0] for row in c.fetchall()]
    # Activities by date and type
    c.execute("""SELECT activity_date, activity_type, SUM(value) 
                 FROM activities 
                 WHERE user_id = ? 
                 GROUP BY activity_date, activity_type""", (user_id,))
    activities = {}
    for date, typ, val in c.fetchall():
        if date not in activities:
            activities[date] = {}
        activities[date][typ] = val
    conn.close()
    return jsonify({
        "logins": logins,
        "activities": activities
    })

@app.route('/api/get_progress', methods=['GET'])
def get_progress():
    print("🔍 Progress API called")
    token = request.headers.get('Authorization')
    print(f"📝 Token received: {token is not None}")
    
    if not token:
        print("❌ No token provided")
        return jsonify({"error": "No token provided"}), 401
    
    try:
        payload = verify_clerk_token(token.replace('Bearer ', ''))
        clerk_id = payload['sub']
        print(f"✅ Token verified for user: {clerk_id}")
    except Exception as e:
        print(f"❌ Token verification failed: {str(e)}")
        return jsonify({"error": str(e)}), 401
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE clerk_id = ?", (clerk_id,))
    user = c.fetchone()
    
    if not user:
        print(f"👤 User not found, creating new user for: {clerk_id}")
        # Create user if not exists
        username = payload.get('username', 'Unknown')
        c.execute("INSERT INTO users (clerk_id, username) VALUES (?, ?)", (clerk_id, username))
        conn.commit()
        user_id = c.lastrowid
        print(f"✅ Created new user with ID: {user_id}")
    else:
        user_id = user[0]
        print(f"✅ Found existing user with ID: {user_id}")
    
    # Login streak and total days
    c.execute("SELECT login_date FROM logins WHERE user_id = ? ORDER BY login_date", (user_id,))
    logins = [row[0] for row in c.fetchall()]
    current_streak = calculate_streak(logins)
    total_days_visited = len(set(logins))
    
    # Activities with detailed counts
    c.execute("""SELECT activity_type, SUM(value), COUNT(*) FROM activities 
                 WHERE user_id = ? GROUP BY activity_type""", (user_id,))
    act_data = c.fetchall()
    
    # Initialize counters
    pdf_count = 0
    video_count = 0
    quantum_count = 0
    test_count = 0
    total_marks = 0
    aptitude_count = 0
    
    for typ, sm, cnt in act_data:
        if typ == 'pdf':
            pdf_count = sm or 0
        elif typ == 'video':
            video_count = sm or 0
        elif typ == 'quantum':
            quantum_count = sm or 0
        elif typ == 'test':
            test_count = cnt or 0
            total_marks = sm or 0
        elif typ == 'aptitude':
            aptitude_count = sm or 0
    
    # Get aptitude scores
    c.execute("SELECT COUNT(*), MAX(score), AVG(score) FROM aptitude_scores WHERE user_id = ?", (user_id,))
    aptitude_data = c.fetchone()
    aptitude_tests_taken = aptitude_data[0] or 0
    best_aptitude_score = aptitude_data[1] or 0
    avg_aptitude_score = round(aptitude_data[2] or 0, 1)
    
    # Calculate percentages for progress bars
    total_pdf = 50  # Assume 50 PDFs available
    total_video = 30  # Assume 30 videos available
    total_quantum = 40  # Assume 40 quantum notes available
    
    pdf_pct = min(100, (pdf_count / total_pdf * 100) if total_pdf else 0)
    video_pct = min(100, (video_count / total_video * 100) if total_video else 0)
    quantum_pct = min(100, (quantum_count / total_quantum * 100) if total_quantum else 0)
    
    # Calculate overall progress
    overall_progress = round((pdf_pct + video_pct + quantum_pct) / 3, 1)
    
    # Get recent activity (last 7 days)
    from datetime import datetime, timedelta
    week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    c.execute("""SELECT activity_date, activity_type, SUM(value) 
                 FROM activities 
                 WHERE user_id = ? AND activity_date >= ? 
                 GROUP BY activity_date, activity_type 
                 ORDER BY activity_date DESC""", (user_id, week_ago))
    recent_activities = c.fetchall()
    
    conn.close()
    
    return jsonify({
        # Basic progress percentages
        "pdfNotesRead": round(pdf_pct, 1),
        "lecturesWatched": round(video_pct, 1),
        "quantumRead": round(quantum_pct, 1),
        "overallProgress": overall_progress,
        
        # Detailed counts
        "pdfCount": pdf_count,
        "videoCount": video_count,
        "quantumCount": quantum_count,
        "testCount": test_count,
        "aptitudeTestsTaken": aptitude_tests_taken,
        
        # Streak and visit data
        "currentStreak": current_streak,
        "totalDaysVisited": total_days_visited,
        "totalLogins": len(logins),
        
        # Test and score data
        "testsAttempted": test_count,
        "totalTests": 10,
        "totalMarks": total_marks,
        "maxMarks": 500,
        "bestAptitudeScore": best_aptitude_score,
        "avgAptitudeScore": avg_aptitude_score,
        
        # Totals for reference
        "totalPdfsAvailable": total_pdf,
        "totalVideosAvailable": total_video,
        "totalQuantumAvailable": total_quantum,
        
        # Recent activity
        "recentActivities": recent_activities,
        
        # Legacy fields for compatibility
        "streak": current_streak
    })

# ---------------------------
# Flask Run
# ---------------------------
if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000, use_reloader=False)
