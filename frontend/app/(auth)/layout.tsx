'use client';



export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-black">
            <div
                className="absolute inset-0 z-0 opacity-50"
                style={{
                    backgroundImage: 'url(/images/map-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                {children}
            </div>
        </div>
    );
}
