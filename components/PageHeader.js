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
                    <div className="flex items-center bg-white border border-[#CCD8FF] rounded px-4 py-2 focus-within:border-[#576EB7] focus-within:ring-1 focus-within:ring-[#576EB7] transition-all duration-200 shadow-sm w-96">
                        <svg
                            className="h-5 w-5 text-[#657082]"
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
                        <input
                            className="ml-3 outline-none text-[#657082] placeholder-[#657082] w-full text-base"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search programs"
                            aria-label="Program search input"
                        />
                    </div>
                )}
            </div>
            <div className="h-px bg-[#CCD8FF]"></div>
        </div>
    );
};

export default PageHeader; 