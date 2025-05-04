import React, { useState, useEffect, useRef } from 'react';
import Page from "../components/Page";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";

const helpSections = [
    {
        id: 'introduction',
        title: 'Introduction',
        content: `Discrimin8r is a powerful public tool designed for developers and analytics professionals building on Solana.

Discrimin8r simplifies working with Anchor-based programs and offers a suite of features to streamline your development workflow, improve analytics capabilities, and enhance program verification processes.

Whether you're building a new program, upgrading an existing one, or writing decoders, Discrimin8r makes Solana development and analysis more accessible than ever.`
    },
    {
        id: 'upload-idl',
        title: 'Upload IDL',
        content: `Upload IDL (Interface Definition Language) files and instantly generate fully functional Python parsers.

1. Upload your Anchor IDL by pasting or dropping the file
2. Access a complete parser ready for immediate use`,
        videoId: 'xCcr_l8gTSs'
    },
    {
        id: 'instruction-name',
        title: 'Instruction Name Decoder',
        content: `Decode instruction data to find the corresponding instruction name from Anchor programs.

Paste any Base58- or hex-encoded instruction data,
click Search,
instantly see its human-readable Anchor instruction name and corresponding program address.`,
        videoId: 'YUAx-NTZ0SQ'
    },
    {
        id: 'instruction-discriminator',
        title: 'Instruction Name Search',
        content: `Search by instruction name to discover its implementation across all Solana programs.

1. Enter the instruction name you're looking for (e.g., "acceptOwnership")
2. Click "Search" to query the database
3. View the resulting 8-byte discriminator (as a byte array)
4. Access a list of program addresses and complete IDLs where this instruction is implemented`,
        videoId: 'RD-7Iomvnzs'
    },
    {
        id: 'verify-idl',
        title: 'IDL Verification',
        content: `Validate if an IDL matches a program's actual on-chain behavior.

1. Provide a dApp address for the program you want to verify
2. Specify a block slot
3. Upload the IDL you want to validate

Discrimin8r will parse instructions to validate if the IDL matches the program's actual on-chain behavior.`,
        videoId: 'Vlyu9hpajAs'
    }
];

const Help = () => {
    const [activeSection, setActiveSection] = useState('introduction');
    const [activeCodeTab, setActiveCodeTab] = useState('javascript');
    const observerRef = useRef(null);
    const sectionRefs = useRef({});

    // Initialize Prism for syntax highlighting
    useEffect(() => {
        if (typeof window !== 'undefined') {
            Prism.highlightAll();
        }
    }, [activeSection, activeCodeTab]);

    // Setup Intersection Observer to detect which section is in view
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Slightly delay observer setup to ensure all elements are rendered
        setTimeout(() => {
            // Intersection Observer options
            const options = {
                root: null, // viewport
                rootMargin: '0px 0px -80% 0px', // Only trigger when section is at the top of the viewport
                threshold: 0.15 // Require more visibility
            };

            // Callback function when sections intersect viewport
            const handleIntersect = (entries) => {
                // Filter only intersecting entries and sort by their Y position in the viewport
                const visibleEntries = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => {
                        const rectA = a.boundingClientRect;
                        const rectB = b.boundingClientRect;
                        return rectA.top - rectB.top;
                    });

                // Use the topmost visible section
                if (visibleEntries.length > 0) {
                    setActiveSection(visibleEntries[0].target.id);
                }
            };

            // Create observer
            observerRef.current = new IntersectionObserver(handleIntersect, options);

            // Observe all section elements
            helpSections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    observerRef.current.observe(element);
                    sectionRefs.current[section.id] = element;
                }
            });
        }, 100);

        // Cleanup on component unmount
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Improved scroll event listener with debouncing
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let scrollTimeout;
        const handleScroll = () => {
            // Clear previous timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Set a small delay to avoid rapid updates
            scrollTimeout = setTimeout(() => {
                // Account for header and some spacing
                const scrollPosition = window.scrollY + 150;

                // Loop through sections in reverse (bottom to top)
                // This helps ensure we catch the section that's most prominently in view
                for (let i = helpSections.length - 1; i >= 0; i--) {
                    const section = helpSections[i];
                    const element = document.getElementById(section.id);

                    if (element) {
                        const { offsetTop } = element;

                        // More lenient check - if we've scrolled past the start of the section
                        if (scrollPosition >= offsetTop) {
                            if (activeSection !== section.id) {
                                setActiveSection(section.id);
                            }
                            break; // Stop checking once we find a match
                        }
                    }
                }
            }, 50);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Initial check
        handleScroll();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
        };
    }, [activeSection]);

    return (
        <Page
            title="Help"
            subtitle="Learn how to use Discrimin8r effectively"
        >
            <div className="flex flex-col md:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1">
                    {helpSections.map((section, index) => (
                        <div
                            key={section.id}
                            id={section.id}
                            className="mb-12"
                        >
                            <h2 className="text-xl font-bold text-[#333333] mb-4">{section.title}</h2>

                            <div className="prose prose-sm max-w-none">
                                {section.content.split('\n\n').map((paragraph, idx) => (
                                    <div key={idx} className="mb-6">
                                        {paragraph.startsWith('•') ? (
                                            <ul className="list-disc pl-5 space-y-2 text-[#666666]">
                                                {paragraph.split('\n').map((item, itemIdx) => (
                                                    <li key={itemIdx} className="text-[#666666] text-sm">
                                                        {item.replace('• ', '')}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : paragraph.match(/^\d\./) ? (
                                            <ol className="list-decimal pl-5 space-y-2 text-[#666666]">
                                                {paragraph.split('\n').map((item, itemIdx) => (
                                                    <li key={itemIdx} className="text-[#666666] text-sm">
                                                        {item.replace(/^\d\.\s/, '')}
                                                    </li>
                                                ))}
                                            </ol>
                                        ) : (
                                            <p className="text-[#666666] text-sm">{paragraph}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {section.videoId && (
                                <div className="mt-6 mb-2 mx-auto w-full max-w-[800px]">
                                    <div className="relative pb-[40%] h-0 overflow-hidden rounded-sm border border-[#CCD8FF] shadow-sm bg-white">

                                        <iframe
                                            className="absolute top-0 left-0 w-full h-[calc(100%)]"
                                            src={`https://www.youtube.com/embed/${section.videoId}`}
                                            title={`${section.title} video tutorial`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            {section.id === 'code-examples' && section.codeExamples && (
                                <div className="mt-4">
                                    <div className="bg-[#23272F] rounded-lg overflow-hidden">
                                        <div className="flex border-b border-[#353945] px-4 pt-2 pb-0">
                                            {section.codeExamples.map((example) => (
                                                <button
                                                    key={example.language}
                                                    onClick={() => setActiveCodeTab(example.language)}
                                                    className={`px-3 py-1 text-xs focus:outline-none transition-all ${activeCodeTab === example.language
                                                        ? 'text-[#6DD6A7] font-bold'
                                                        : 'text-[#A3AED0]'
                                                        }`}
                                                >
                                                    {example.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="border-b border-[#353945] w-full" />
                                        <div className="p-4">
                                            {section.codeExamples.map((example) => (
                                                <div
                                                    key={example.language}
                                                    className={activeCodeTab === example.language ? 'block' : 'hidden'}
                                                >
                                                    <pre className="text-xs font-mono whitespace-pre-wrap break-all bg-transparent text-[#f8f8f2] overflow-auto max-h-[300px]">
                                                        <code className={`language-${example.language}`}>
                                                            {example.code}
                                                        </code>
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add horizontal divider after each section except the last one */}
                            {index < helpSections.length - 1 && (
                                <hr className="mt-8 border-t border-[#CCD8FF]" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Sidebar Navigation */}
                <div className="md:w-64 flex-shrink-0">
                    <div className="sticky top-6">
                        <div className="mb-6">
                            <nav className="border-l-2 border-[#CCD8FF]">
                                <ul className="space-y-2">
                                    {helpSections.map((section) => (
                                        <li key={section.id}>
                                            <a
                                                href={`#${section.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' });
                                                    setActiveSection(section.id);
                                                }}
                                                className={`block pl-4 py-1 border-l-2 -ml-[2px] transition-colors text-xs ${activeSection === section.id
                                                    ? 'border-[#4285F4] text-[#4285F4] font-medium'
                                                    : 'border-transparent text-[#666666] hover:text-[#4285F4]'
                                                    }`}
                                            >
                                                {section.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default Help; 