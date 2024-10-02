import Link from "next/link";
import React from "react";

import { twMerge } from "tailwind-merge";

const getWindow = () => (typeof window === "undefined" ? {} : window);

const Navbar = () => {
    const selectedUpload = getWindow().location?.href?.endsWith("/");
    const selectedPrograms = getWindow().location?.href?.endsWith("/programs");
    const class1 = twMerge(
        "py-4 px-2 font-semibold",
        selectedUpload ? "text-[#3455FF]" : ""
    );
    const class2 = twMerge(
        "py-4 px-2 font-semibold",
        selectedPrograms ? "text-[#3455FF]" : ""
    );

    return (
        <nav className="border-b border-[#C3CFFF]">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-7">
                        <div>
                            {/* Website Logo */}
                            <a
                                href="#"
                                className="flex flex-col items-start py-4 px-2"
                            >
                                <span className="font-semibold text-gray-500 text-[24px]">
                                    discrimin🎱r
                                </span>
                                <span className="font-medium text-sm text-gray-400">
                                    by{" "}
                                    <span className="font-semibold">
                                        Top Ledger
                                    </span>
                                </span>
                            </a>
                        </div>
                    </div>
                    {/* Primary Navbar items */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link href="/" className={class1}>
                            Upload
                        </Link>
                        <Link href="/programs" className={class2}>
                            Search Programs
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
