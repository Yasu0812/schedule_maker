import React from 'react';

export default function CancelIcon(props: {
    onClick: () => void,
    className?: string,
}) {
    return <svg
        onClick={props.onClick}
        className={`cursor-pointer ${props.className}`}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="red"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
};
