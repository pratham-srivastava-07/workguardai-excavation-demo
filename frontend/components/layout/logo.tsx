'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
        xl: 'h-16 w-16',
    };

    const textClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl',
        xl: 'text-5xl',
    };

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <div className={cn('relative flex-shrink-0', sizeClasses[size])}>
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    {/* House Base - Charcoal Grey */}
                    <path
                        d="M20 45V85H80V45L50 15L20 45Z"
                        fill="#1F2937"
                        stroke="#374151"
                        strokeWidth="2"
                    />
                    {/* Roof Ridge */}
                    <path
                        d="M15 48L50 13L85 48"
                        stroke="#4B5563"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Leaf / Circular Arrow - Forest Green */}
                    <path
                        d="M50 40C50 40 75 45 75 70C75 95 50 90 50 90C50 90 25 95 25 70C25 45 50 40 50 40Z"
                        fill="#10B981"
                        fillOpacity="0.9"
                    />
                    {/* Leaf Vein */}
                    <path
                        d="M50 45L50 85"
                        stroke="#064E3B"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    {/* Circular Connection Dot */}
                    <circle cx="50" cy="15" r="4" fill="#10B981" />
                </svg>
            </div>
            {showText && (
                <span className={cn('font-bold text-white tracking-tight', textClasses[size])}>
                    Reno<span className="text-emerald-500">Wise</span>
                </span>
            )}
        </div>
    );
}
