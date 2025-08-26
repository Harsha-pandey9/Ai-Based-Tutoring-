import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import * as monaco from 'monaco-editor';

export default function CollabEditor({ room }) {
  const editorRef = useRef();

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(room, ydoc);
    const yText = ydoc.getText('monaco');

    const editor = monaco.editor.create(editorRef.current, {
      value: '',
      language: 'javascript',
      theme: 'vs-dark',
    });

    const binding = new MonacoBinding(yText, editor.getModel(), new Set([editor]), provider.awareness);

    return () => {
      editor.dispose();
      binding.destroy();
      provider.destroy();
    };
  }, [room]);

  return <div ref={editorRef} style={{ height: '400px', border: '1px solid #ccc', borderRadius: '8px' }} />;
}
