import { ColorUtil } from '@/app/common/ColorUtil';
import React from 'react';

export default function MileStoneIcon(props: {
    color: string,
    size?: number,
    className?: string,
}) {

    const size = props.size || 30;
    const gradColor = ColorUtil.generateShadedGradientHSL(props.color);

    return <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
        width={48} height={48} viewBox="0 0 24 24"
    >
        <defs>
            <radialGradient id="ballGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor={gradColor.start} />
                <stop offset="100%" stopColor={gradColor.end} />
            </radialGradient>

            <radialGradient id="highlight" cx="35%" cy="35%" r="20%">
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="shadow" cx="50%" cy="70%" r="50%">
                <stop offset="0%" stopColor="#888888" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#888888" stopOpacity="0" />
            </radialGradient>
        </defs>

        <circle cx="12" cy="12" r="10" fill="url(#ballGradient)" />

        <circle cx="10" cy="9" r="4" fill="url(#highlight)" />

        <circle cx="12" cy="15" r="6" fill="url(#shadow)" />
    </svg>

};
