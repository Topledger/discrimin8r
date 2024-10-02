"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const getWindow = () => (typeof window === "undefined" ? {} : window);

const Navbar = () => {
    const [selectedUpload, setSelectedUpload] = useState();
    const [selectedPrograms, setSelectedPrograms] = useState();

    useEffect(() => {
        setSelectedUpload(getWindow().location?.href?.endsWith("/"));
        setSelectedPrograms(getWindow().location?.href?.endsWith("/programs"));
    }, []);

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
            <div className="px-32">
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
