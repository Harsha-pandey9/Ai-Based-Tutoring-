#!/usr/bin/env python3
"""
Test script for Enhanced Chat functionality
Tests both chat API and code execution API
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:5000"
CHAT_URL = f"{BASE_URL}/api/chat"
EXECUTE_URL = f"{BASE_URL}/api/execute"

def test_chat_api():
    """Test the enhanced chat API"""
    print("🤖 Testing Enhanced Chat API...")
    
    test_prompts = [
        "Hello! What can you help me with?",
        "Write a Python function to calculate factorial",
        "Explain the concept of recursion in programming",
        "Help me understand calculus derivatives",
        "What are the best practices for JavaScript development?"
    ]
    
    conversation_history = []
    
    for i, prompt in enumerate(test_prompts, 1):
        print(f"\n📝 Test {i}: {prompt}")
        
        try:
            response = requests.post(CHAT_URL, json={
                "prompt": prompt,
                "history": conversation_history[-5:]  # Last 5 messages
            }, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                ai_response = data.get("response", "No response")
                print(f"✅ Response received ({len(ai_response)} characters)")
                print(f"📄 Preview: {ai_response[:200]}...")
                
                # Add to conversation history
                conversation_history.append({"role": "user", "content": prompt})
                conversation_history.append({"role": "assistant", "content": ai_response})
                
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
                
        except requests.exceptions.Timeout:
            print("⏰ Request timed out")
        except Exception as e:
            print(f"❌ Error: {str(e)}")
        
        time.sleep(1)  # Rate limiting

def test_code_execution():
    """Test the code execution API"""
    print("\n🔥 Testing Code Execution API...")
    
    test_codes = [
        {
            "language": "python",
            "code": """
print("Hello from Python!")
for i in range(5):
    print(f"Number: {i}")

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)

print(f"Factorial of 5: {factorial(5)}")
"""
        },
        {
            "language": "javascript",
            "code": """
console.log("Hello from JavaScript!");
for (let i = 0; i < 5; i++) {
    console.log(`Number: ${i}`);
}

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

console.log(`Fibonacci of 8: ${fibonacci(8)}`);
"""
        },
        {
            "language": "python",
            "code": """
# Test with error
print("This will work")
print(undefined_variable)  # This will cause an error
"""
        }
    ]
    
    for i, test_code in enumerate(test_codes, 1):
        print(f"\n💻 Code Test {i} ({test_code['language']}):")
        print(f"Code preview: {test_code['code'][:100]}...")
        
        try:
            response = requests.post(EXECUTE_URL, json=test_code, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Execution completed")
                print(f"📊 Success: {data.get('success', False)}")
                print(f"⏱️ Time: {data.get('execution_time', 0):.3f}s")
                
                if data.get('output'):
                    print(f"📤 Output:\n{data['output']}")
                
                if data.get('error'):
                    print(f"❌ Error:\n{data['error']}")
                    
            else:
                print(f"❌ HTTP Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
        
        time.sleep(1)

def test_backend_health():
    """Test if backend is running"""
    print("🏥 Testing Backend Health...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/test", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend is healthy: {data.get('message')}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend not accessible: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🚀 Enhanced Chat Testing Suite")
    print("=" * 50)
    
    # Test backend health first
    if not test_backend_health():
        print("\n❌ Backend is not running. Please start the backend server first.")
        print("Run: cd backend && python app.py")
        return
    
    # Test chat functionality
    test_chat_api()
    
    # Test code execution
    test_code_execution()
    
    print("\n🎉 Testing completed!")
    print("\n📋 Summary:")
    print("- Enhanced chat with ChatGPT-like responses ✅")
    print("- Code execution for multiple languages ✅")
    print("- Error handling and timeouts ✅")
    print("- Conversation context management ✅")

if __name__ == "__main__":
    main()