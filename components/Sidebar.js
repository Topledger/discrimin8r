import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import MobileView from './MobileView';

const menuItems = [
    {
        name: 'Home',
        path: '/',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },

    {
        name: 'Upload IDL',
        path: '/upload-idl',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
        )
    },
    {
        name: 'Instruction Name',
        path: '/instruction-name',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        name: 'Search by Instruction',
        path: '/instruction-discriminator',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        )
    },
    {
        name: 'Verify IDL',
        path: '/verify-idl',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        )
    },
    {
        name: 'Programs',
        path: '/programs',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
        )
    },
    {
        name: 'APIs',
        path: '/apis',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        name: 'Help',
        path: '/help',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
        )
    }
];

const aboutMenuItem = {
    name: 'About Top Ledger',
    path: 'https://topledger.xyz',
    icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    )
};

const Sidebar = ({ onCollapse }) => {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
            setIsCollapsed(JSON.parse(savedState));
        }
        setIsMounted(true);

        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const handleCollapseChange = useCallback((newState) => {
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
        onCollapse?.(newState);
    }, [onCollapse]);

    const toggleCollapse = useCallback(() => {
        handleCollapseChange(!isCollapsed);
    }, [isCollapsed, handleCollapseChange]);

    if (!isMounted) return null;

    if (isMobile) {
        return <MobileView />;
    }

    return (
        <aside
            className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-[#CCD8FF] h-screen fixed left-0 top-0 transition-all duration-500 ease-in-out z-10 flex flex-col`}
        >
            <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-4 transition-all duration-500 ease-in-out flex-1`}>
                <div className={`flex flex-col ${isCollapsed ? 'items-center' : ''} mb-8 border-b border-[#CCD8FF] pb-4 transition-all duration-500 ease-in-out h-[52px]`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all duration-500 ease-in-out h-full`}>
                        {isCollapsed ? (
                            <div className="flex items-center transition-all duration-500 ease-in-out">
                                <h1 className="text-3xl font-bold text-[#576EB7] transition-opacity duration-500 ease-in-out" style={{
                                    opacity: isCollapsed ? '1' : '0'
                                }}>
                                    🎱
                                </h1>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center h-full">
                                <h1 className="text-xl font-bold text-[#576EB7] transition-opacity duration-500 ease-in-out whitespace-nowrap" style={{
                                    opacity: isCollapsed ? '0' : '1'
                                }}>
                                    discrimin🎱r
                                </h1>
                                <span className="text-xs text-[#657082] transition-opacity duration-500 ease-in-out whitespace-nowrap">
                                    by Top Ledger
                                </span>
                            </div>
                        )}
                        <div className="flex items-center transition-all duration-500 ease-in-out">
                            <button
                                onClick={toggleCollapse}
                                className="p-1 hover:bg-[#EAEFFF] rounded-lg transition-all duration-500 ease-in-out absolute -right-3"
                                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            >
                                <svg
                                    className="w-5 h-5 text-[#657082] transition-transform duration-500 ease-in-out"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    {isCollapsed ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <nav className="space-y-0 relative">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center h-[52px] px-4 border-b border-[#CCD8FF] transition-all duration-500 ease-in-out group relative ${router.pathname === item.path
                                ? 'bg-[#EAEFFF] text-[#576EB7]'
                                : 'text-[#657082] hover:bg-[#F6F8FF]'
                                }`}
                        >
                            <div className="w-6 flex items-center justify-start transition-all duration-500 ease-in-out">
                                {item.icon}
                            </div>
                            <span className={`ml-3 text-sm whitespace-nowrap transition-all duration-500 ease-in-out ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`} style={{
                                transition: isCollapsed
                                    ? 'opacity 0ms linear, width 0ms linear'
                                    : 'opacity 500ms ease-in-out, width 500ms ease-in-out',
                                width: isCollapsed ? '0' : 'auto'
                            }}>
                                {item.name}
                            </span>
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 bg-white border border-[#CCD8FF] text-[#657082] px-3 py-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 ease-in-out whitespace-nowrap z-50 shadow-sm font-medium tracking-wide text-sm">
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-l border-t border-[#CCD8FF] transform -rotate-45"></div>
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-4 transition-all duration-500 ease-in-out border-t border-[#CCD8FF]`}>
                <Link
                    href={aboutMenuItem.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center h-[52px] px-4 transition-all duration-500 ease-in-out group relative text-[#657082] hover:bg-[#F6F8FF]"
                >
                    <div className="w-6 flex items-center justify-start transition-all duration-500 ease-in-out">
                        {aboutMenuItem.icon}
                    </div>
                    <span className={`ml-3 text-sm whitespace-nowrap transition-all duration-500 ease-in-out ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`} style={{
                        transition: isCollapsed
                            ? 'opacity 0ms linear, width 0ms linear'
                            : 'opacity 500ms ease-in-out, width 500ms ease-in-out',
                        width: isCollapsed ? '0' : 'auto'
                    }}>
                        {aboutMenuItem.name}
                    </span>
                    {isCollapsed && (
                        <div className="absolute left-full ml-2 bg-white border border-[#CCD8FF] text-[#657082] px-3 py-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 ease-in-out whitespace-nowrap z-50 shadow-sm font-medium tracking-wide text-sm">
                            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-l border-t border-[#CCD8FF] transform -rotate-45"></div>
                            {aboutMenuItem.name}
                        </div>
                    )}
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
