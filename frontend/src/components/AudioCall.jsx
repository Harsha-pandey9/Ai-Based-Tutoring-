import React, { useRef, useEffect } from 'react';

export default function AudioCall({ socket, username, room }) {
  const localAudio = useRef();
  const remoteAudio = useRef();
  const peerRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      localAudio.current.srcObject = stream;

      socket.on('signal', ({ from, signal }) => {
        peerRef.current.signal(signal);
      });

      peerRef.current = new window.SimplePeer({
        initiator: true,
        trickle: false,
        stream,
      });

      peerRef.current.on('signal', signal => {
        socket.emit('signal', { signal, room, username });
      });

      peerRef.current.on('stream', remoteStream => {
        remoteAudio.current.srcObject = remoteStream;
      });
    });

    return () => {
      peerRef.current?.destroy();
    };
  }, [socket]);

  return (
    <div className="flex gap-4">
      <div>
        <p className="text-sm">You</p>
        <audio ref={localAudio} autoPlay controls />
      </div>
      <div>
        <p className="text-sm">Partner</p>
        <audio ref={remoteAudio} autoPlay controls />
      </div>
    </div>
  );
}
