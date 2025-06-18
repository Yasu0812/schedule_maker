import { ColorUtil } from '@/app/common/ColorUtil';
import React from 'react';

export default function MileStoneIcon(props: {
    color: string,
    size?: number,
    className?: string,
}) {

    const size = props.size || 32;
    const gradColor = ColorUtil.generateShadedGradientHSL(props.color);

    return <div className="marble-wrapper">
        <svg className='marble' style={{ width: size, height: size }} width="128" height="128" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="marbleGradient" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor={gradColor.start} />
                    <stop offset="100%" stopColor={gradColor.end} />
                </radialGradient>
            </defs>
            <circle cx="128" cy="128" r="110" fill="url(#marbleGradient)" stroke="black" strokeWidth="10" strokeOpacity="0.5" />
            <ellipse className='highlight' cx="88" cy="76" rx="34" ry="24" fill="white" fillOpacity="0.6" />
            <circle cx="106" cy="96" r="8" fill="white" fillOpacity="0.4" />
            <circle cx="160" cy="130" r="6" fill="white" fillOpacity="0.2" />
        </svg>
    </div>


};
