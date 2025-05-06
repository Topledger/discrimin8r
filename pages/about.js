import React from 'react';
import Page from "../components/Page";
import Counter from "../components/Counter";

const AboutTopLedger = () => {
    return (
        <Page
            title="About Top Ledger"
            subtitle="Powering data-driven innovation on Solana"
        >
            <div className="flex flex-col gap-0">
                {/* About Us Section */}
                <div id="about-us" className="mb-12">

                    <div className="prose prose-sm max-w-none">
                        <p className="text-[#666666] text-sm mb-4">
                            TopLedger turns raw on-chain events into actionable intelligence—so builders, traders, and institutions make confident decisions in milliseconds.
                        </p>

                    </div>

                </div>

                {/* Key Stats Section */}
                <div id="key-stats" className="mb-12">
                    <h2 className="text-lg font-semibold text-[#333333] mb-4">Key Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Stat 1 */}
                        <div className="bg-white rounded-[8px] p-6 shadow-sm border border-[#CCD8FF]">
                            <p className="text-2xl font-medium  text-[#576EB7] text-center">3+</p>
                            <p className="text-sm text-[#666666] text-center mt-2">Years in Solana</p>
                        </div>

                        {/* Stat 2 */}
                        <div className="bg-white rounded-[8px] p-6 shadow-sm border border-[#CCD8FF]">
                            <p className="text-2xl font-medium text-[#576EB7] text-center">Billion+</p>
                            <p className="text-sm text-[#666666] text-center mt-2">Indexed Transactions</p>
                        </div>

                        {/* Stat 3 */}
                        <div className="bg-white rounded-[8px] p-6 shadow-sm border border-[#CCD8FF]">
                            <p className="text-2xl font-medium  text-[#576EB7] text-center">50+</p>
                            <p className="text-sm text-[#666666] text-center mt-2">Clients Served</p>
                        </div>

                        {/* Stat 4 */}
                        <div className="bg-white rounded-[8px] p-6 shadow-sm border border-[#CCD8FF]">
                            <p className="text-2xl font-medium  text-[#576EB7] text-center">{'< 0.01s'}</p>
                            <p className="text-sm text-[#666666] text-center mt-2">Data Latency</p>
                        </div>
                    </div>
                    <hr className="mt-8 border-t border-[#CCD8FF]" />
                </div>

                {/* Our Products Section */}
                <div id="our-products" className="mb-12">
                    <h2 className="text-lg font-semibold text-[#333333] mb-4">Our Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product 1 */}
                        <div className="border border-[#CCD8FF] rounded-[8px] p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className=" p-2">
                                    <svg className="w-5 h-5 text-[#576EB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-[#576EB7] font-medium">Flash.Trade Insights</h3>
                            </div>
                            <p className="text-[#666666] text-sm mb-3">
                                Real-time perpetuals analytics & risk dashboards.
                            </p>

                        </div>

                        {/* Product 2 */}
                        <div className="border border-[#CCD8FF] rounded-[8px] p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className=" p-2 ">
                                    <svg className="w-5 h-5 text-[#576EB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-[#576EB7] font-medium">Cursor AI for Solana</h3>
                            </div>
                            <p className="text-[#666666] text-sm mb-3">
                                Query on-chain & off-chain data using natural language.
                            </p>

                        </div>

                        {/* Product 3 */}
                        <div className="border border-[#CCD8FF] rounded-[8px] p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2">
                                    <svg className="w-5 h-5 text-[#576EB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                    </svg>
                                </div>
                                <h3 className="text-[#576EB7] font-medium">Indexer SDK</h3>
                            </div>
                            <p className="text-[#666666] text-sm mb-3">
                                Plug-and-play program decoders with Kafka & DB sinks.
                            </p>

                        </div>

                        {/* Product 4 */}
                        <div className="border border-[#CCD8FF] rounded-[8px] p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2">
                                    <svg className="w-5 h-5 text-[#576EB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-[#576EB7] font-medium">Stablecoin Pulse</h3>
                            </div>
                            <p className="text-[#666666] text-sm mb-3">
                                Institution-grade stablecoin metrics for capital allocators.
                            </p>

                        </div>
                    </div>
                    <hr className="mt-8 border-t border-[#CCD8FF]" />
                </div>

                {/* CTA section */}
                <div id="ready-to-build" className="mb-12">
                    <h2 className="text-lg font-semibold text-[#333333] mb-4">Ready to build with crystal-clear data?</h2>
                    <div className="prose prose-sm max-w-none">
                        <p className="text-[#666666] text-sm mb-6">
                            Whether you're a DeFi protocol, trading firm, or enterprise—TopLedger accelerates your product with low-latency, high-fidelity analytics.
                        </p>
                        <div>
                            <a href="https://calendly.com/nitin_topledger/30min" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 text-[#ffffff] hover:text-[#576EB7] hover:border-[0.5px] hover:border-[#576EB7] rounded-[8px] font-medium text-sm bg-[#576EB7] hover:bg-[#EAEFFF] transition">
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Schedule a Call
                            </a>
                        </div>
                    </div>
                    <hr className="mt-8 border-t border-[#CCD8FF]" />
                </div>

                {/* Contact section */}
                <div id="contact-us" className="mb-12">
                    <h2 className="text-lg font-semibold text-[#333333] mb-4">Contact Us</h2>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <a href="https://topledger.xyz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#576EB7] hover:text-[#4457A1] transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span className="text-sm">Visit our website</span>
                        </a>
                        <a href="https://twitter.com/ledger_top" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#576EB7] hover:text-[#4457A1] transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 1200 1227" fill="currentColor">
                                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                            </svg>
                            <span className="text-sm">Follow us on X</span>
                        </a>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default AboutTopLedger; 