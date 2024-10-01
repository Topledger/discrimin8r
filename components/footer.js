import Link from "next/link";

const Footer = () => {
    return (
        <>
            <footer className="container px-8 md:px-16">
                <div className="pb-8 text-xs flex flex-col md:flex-row-reverse items-center md:items-end">
                    <div className="mb-4 md:mb-0">
                        <Link
                            className="text-lts hover:text-accent transition mr-4 md:mr-8"
                            href="https://topledger.xyz/"
                            target="_blank"
                        >
                            About
                        </Link>
                    </div>
                    <span className="grow text-left text-dts">© 2024 Top Ledger Pte Ltd, All rights reserved.</span>
                </div>
            </footer>
        </>
    );
};

export default Footer;
