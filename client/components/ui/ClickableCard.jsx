// components/ui/ClickableCard.jsx
'use client';

import { useRouter } from 'next/navigation';

const ClickableCard = ({ 
    href, 
    children, 
    className = '', 
    onClick 
}) => {
    const router = useRouter();
    
    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        } else if (href) {
            console.log('Navigating to:', href);
            router.push(href);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
        }
    };

    return (
        <div
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={`p-5 hover:bg-red-50 shadow-lg rounded-lg bg-white border border-gray-200 cursor-pointer transition-all duration-200 ${className}`}
            role="button"
            tabIndex={0}
            style={{ 
                position: 'relative',
                zIndex: 10,
                outline: 'none'
            }}
        >
            {children}
        </div>
    );
};

export default ClickableCard;