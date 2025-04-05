import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";

const getWindow = () => {
    if (typeof window !== "undefined") {
        return window;
    }
    return {};
};

const Navbar = () => {
    const [selectedTab, setSelectedTab] = useState("");

    useEffect(() => {
        // Get the current path and set the selected tab
        const path = getWindow().location?.pathname || "";
        if (path === "/") {
            setSelectedTab("home");
        } else if (path === "/upload-idl") {
            setSelectedTab("upload-idl");
        }

        else if (path === "/instruction-name") {
            setSelectedTab("instruction-name");
        } else if (path === "/instruction-discriminator") {
            setSelectedTab("instruction-discriminator");
        } else if (path === "/verify-idl") {
            setSelectedTab("verify-idl");
        } else if (path === "/programs") {
            setSelectedTab("programs");
        }
    }, []);

    const getTabClass = (tabName) => {
        return twMerge(
            "py-4 px-2 font-semibold transition-colors duration-200",
            selectedTab === tabName
                ? "text-[#3455FF]"
                : "text-gray-600 hover:text-[#3455FF]"
        );
    };

    return (
        <nav className="border-b border-[#C3CFFF]">
            <div className="px-32">
                <div className="flex justify-between">
                    <div className="flex space-x-7">
                        <div>
                            {/* Website Logo */}
                            <Link
                                href="/"
                                className="flex flex-col items-start py-4 px-2"
                            >
                                <span className="font-semibold text-gray-500 text-[24px]">
                                    discrimin🎱r
                                </span>
                                <span className="font-medium text-sm text-lts">
                                    by{" "}
                                    <span className="font-semibold text-lts">
                                        Top Ledger
                                    </span>
                                </span>
                            </Link>
                        </div>
                    </div>
                    {/* Primary Navbar items */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link href="/" className={getTabClass("home")}>
                            {/* Home Icon SVG */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 inline-block mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Home
                        </Link>
                        <Link href="/" className={getTabClass("upload")}>
                            Upload
                        </Link>
                        <Link href="/instruction-name" className={getTabClass("instruction-name")}>
                            Instruction Name
                        </Link>
                        <Link href="/instruction-discriminator" className={getTabClass("instruction-discriminator")}>
                            Instruction Discriminator
                        </Link>
                        <Link href="/verify-idl" className={getTabClass("verify-idl")}>
                            Verify IDL
                        </Link>
                        <Link href="/programs" className={getTabClass("programs")}>
                            Search Programs
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;