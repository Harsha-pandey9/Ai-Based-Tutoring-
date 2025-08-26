#!/usr/bin/env python3
import requests
import json

def test_backend():
    base_url = "http://localhost:5000"
    
    print("🔍 Testing backend connection...")
    
    try:
        # Test health endpoint
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"✅ Health check: {response.status_code} - {response.json()}")
        
        # Test stats endpoint (no auth required)
        response = requests.get(f"{base_url}/api/stats", timeout=5)
        print(f"✅ Stats endpoint: {response.status_code} - {response.json()}")
        
        print("🎉 Backend is running and accessible!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running!")
        print("💡 Please start the backend server with: python backend/app.py")
        return False
    except Exception as e:
        print(f"❌ Error testing backend: {e}")
        return False

if __name__ == "__main__":
    test_backend()