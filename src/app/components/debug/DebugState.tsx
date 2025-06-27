import { useState } from "react";


export default function DebugState(
    props: {
        children: React.ReactNode,
    }
) {

    const [debugState, setDebugState] = useState<boolean>(false);


    return (
        <div
            style={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.8)',
                color: '#0f0',
                padding: '1rem',
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                maxWidth: '500px',
                maxHeight: '300px',
                overflow: 'auto',
                zIndex: 9999,
                boxShadow: '0 0 10px #0f0'
            }}
        >
            <strong onClick={() => setDebugState(!debugState)}>🛠 Debug State</strong>
            {debugState && props.children}
        </div>
    );
}