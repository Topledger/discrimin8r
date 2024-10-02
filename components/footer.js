import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="container min-h-[100px] flex items-center justify-between">
            <div className="text-xs flex flex-col md:flex-row-reverse items-center md:items-end">
                <span className="grow text-left text-[#657082] text-[13px]">
                    © 2024 Top Ledger Pte Ltd, All rights reserved.
                </span>
            </div>
            <Link className="text-sm font-normal" target="_blank" href="https://topledger.xyz">About Top Ledger</Link>
        </footer>
    );
};

export default Footer;
