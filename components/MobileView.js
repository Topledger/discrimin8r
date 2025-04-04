import React, { useEffect } from 'react';

const MobileView = () => {
    useEffect(() => {
        const originalBodyOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;

        // Prevent scrolling when the component mounts
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = originalBodyOverflow || 'auto';
            document.documentElement.style.overflow = originalHtmlOverflow || 'auto';
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 overflow-hidden h-screen">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-[#576EB7] mb-1">discrimin🎱r</h1>
                <span className="text-xs text-[#657082] mb-4">by Top Ledger</span>
                <p className="text-base text-gray-600">Please use a desktop to view this site.</p>
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-center">
                <a
                    href="https://topledger.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-sm text-[#657082] hover:text-[#576EB7] cursor-pointer"
                >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>About Top Ledger</span>
                </a>
            </div>
        </div>
    );
};

export default MobileView; 