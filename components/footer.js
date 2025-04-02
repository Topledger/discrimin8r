import React from "react";

const Footer = () => {
    return (
        <footer className="min-h-[100px] flex items-center justify-between px-12">
            <div className="text-xs flex flex-col md:flex-row-reverse items-center md:items-end">
                <span className="grow text-left text-[#657082] text-[13px]">
                    © 2025 Top Ledger Pte Ltd, All rights reserved.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
