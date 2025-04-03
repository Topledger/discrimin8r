import React from 'react';

const PageHeader = ({ title, subtitle, searchValue, onSearchChange, showSearch, breadcrumb, onBreadcrumbClick }) => {
    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="py-1">
                    <div className="flex items-center gap-2">
                        <h1
                            className="text-xl font-medium text-[#576EB7] tracking-tight cursor-pointer hover:text-[#4457A1] transition-colors"
                            onClick={onBreadcrumbClick}
                        >
                            {title}
                        </h1>
                        {breadcrumb && (
                            <>
                                <span className="text-[#657082]">/</span>
                                <span className="text-xl font-medium text-[#657082] tracking-tight">
                                    {breadcrumb}
                                </span>
                            </>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-[#657082] max-w-2xl text-sm leading-relaxed mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                            {subtitle}
                        </p>
                    )}
                </div>
                {showSearch && (
                    <div className="flex flex-col gap-2 w-96">
                        <div className="flex items-center relative">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full px-4 py-3 pl-11 border border-[#CCD8FF] rounded focus:border-[#576EB7] focus:ring-1 focus:ring-[#576EB7] transition-all duration-200 shadow-sm text-base text-[#657082] tracking-wide"
                                placeholder="Search programs"
                                aria-label="Program search input"
                            />
                            <svg
                                className="h-5 w-5 text-[#657082] absolute left-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
            <div className="h-px bg-[#CCD8FF]"></div>
        </div>
    );
};

export default PageHeader; 