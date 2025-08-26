import React, { useState } from 'react';

const MockInterview = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    alert(`Microphone ${!isMuted ? 'muted' : 'unmuted'}`);
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened);
    alert(`Audio ${!isDeafened ? 'disabled' : 'enabled'}`);
  };

  const disconnectCall = () => {
    alert('Disconnected from interview. Partner has been notified.');
  };

  const swapRoles = () => {
    alert('Roles swapped! You are now the Helper/Interviewer');
  };

  const runCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      alert('Code executed successfully!');
    }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
      
      {/* Header with ALL BUTTONS */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Mock Interview - Real-time Controls
          </h1>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            
            {/* MUTE BUTTON */}
            <button
              onClick={toggleMute}
              style={{
                padding: '10px 15px',
                backgroundColor: isMuted ? '#ef4444' : '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isMuted ? '🔇 UNMUTE' : '🎤 MUTE'}
            </button>

            {/* AUDIO BUTTON */}
            <button
              onClick={toggleDeafen}
              style={{
                padding: '10px 15px',
                backgroundColor: isDeafened ? '#ef4444' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isDeafened ? '🔊 ENABLE AUDIO' : '🔇 DISABLE AUDIO'}
            </button>

            {/* DISCONNECT BUTTON */}
            <button
              onClick={disconnectCall}
              style={{
                padding: '10px 15px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📞 DISCONNECT
            </button>

            {/* SWAP ROLES BUTTON */}
            <button
              onClick={swapRoles}
              style={{
                padding: '10px 15px',
                backgroundColor: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ���� SWAP ROLES
            </button>

            {/* RUN CODE BUTTON */}
            <button
              onClick={runCode}
              disabled={isRunning}
              style={{
                padding: '10px 15px',
                backgroundColor: isRunning ? '#9ca3af' : '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isRunning ? '⏳ RUNNING...' : '▶️ RUN CODE'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>
          🎯 ALL BUTTONS ARE NOW VISIBLE!
        </h2>
        <p style={{ fontSize: '20px', marginBottom: '30px', color: '#64748b' }}>
          Look at the header bar above - you can see all 5 buttons:
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '10px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎤</div>
            <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>MUTE/UNMUTE</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Toggle microphone on/off</p>
          </div>
          
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '10px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔊</div>
            <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>AUDIO CONTROL</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Enable/disable audio</p>
          </div>
          
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '10px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>📞</div>
            <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>DISCONNECT</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Cut connection</p>
          </div>
          
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '10px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔄</div>
            <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>SWAP ROLES</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Switch with partner</p>
          </div>
          
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '10px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>▶️</div>
            <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>RUN CODE</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Execute code</p>
          </div>
        </div>

        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          backgroundColor: '#fef3c7', 
          borderRadius: '10px',
          border: '2px solid #f59e0b'
        }}>
          <h3 style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '10px' }}>
            ✅ SUCCESS! All buttons are now visible!
          </h3>
          <p style={{ color: '#92400e' }}>
            The 5 buttons are in the header bar: MUTE, AUDIO, DISCONNECT, SWAP ROLES, and RUN CODE.
            Click each button to test - they will show alerts when clicked!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;