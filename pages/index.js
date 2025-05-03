import React, { useState, useEffect, useRef } from 'react';
import Page from "../components/Page";
import Counter from '../components/Counter';
import WeeklyDeployedChart from '../components/charts/WeeklyDeployedChart';
import CombinedWeeklyChart from '../components/charts/CombinedWeeklyChart';
import SpinnerLoader from '../components/SpinnerLoader';
// We'll use inline styles only to avoid SCSS compilation issues
// import styles from '../styles/index.module.scss';

// API Endpoints
const STATS_API_URL = "https://analytics.topledger.xyz/solana/api/queries/13053/results.json?api_key=Iv9jJmVvjFnq9PQ9tTVQR8mrfbkcHNiRQ70GItKg";
const CLOSED_API_URL = "https://analytics.topledger.xyz/solana/api/queries/11240/results.csv?api_key=fHjOXwnhkZBP1moNKBWtezhMIDcmTBmwcVdoWCMi";
const CHART_API_URL = "https://analytics.topledger.xyz/solana/api/queries/11229/results.csv?api_key=YTgFnyWPDQlCph02eNmmGTXojo4S11v5nSQYCnF4";

// Helper to parse simple CSV (header\nvalue)
const parseSimpleCsvValue = (csvText) => {
    try {
        const lines = csvText.trim().split('\n');
        if (lines.length >= 2) {
            const value = parseInt(lines[1].trim(), 10);
            return isNaN(value) ? null : value;
        }
    } catch (e) {
        console.error("Error parsing simple CSV:", e);
    }
    return null;
};

// Helper to parse multi-column CSV into an array of objects
const parseComplexCsv = (csvText) => {
    try {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return []; // Need header and at least one data row

        const header = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const row = {};
            header.forEach((key, index) => {
                const value = values[index]?.trim();
                // Attempt to convert numeric values, handle percentages
                if (key.startsWith('%') || ['total_deployed', 'deployed_with_anchor', 'deployed_with_IDLs'].includes(key)) {
                    const numValue = parseFloat(value);
                    row[key] = isNaN(numValue) ? 0 : numValue; // Default to 0 if parsing fails
                } else {
                    row[key] = value; // Keep dates/other fields as strings
                }
            });
            return row;
        });
        // Sort by week ascending for charting
        return data.sort((a, b) => new Date(a.week) - new Date(b.week));
    } catch (e) {
        console.error("Error parsing complex CSV:", e);
    }
    return [];
};

const Home = () => {
    const [theme, setTheme] = useState("light"); // Default to light theme
    const [counterData, setCounterData] = useState(null);
    const [closedProgramsCount, setClosedProgramsCount] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const statsRef = useRef(null);
    const statsContentRef = useRef(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Use useEffect to handle theme changes only on the client (if needed later)
    // useEffect(() => {
    //     if (theme === "dark") {
    //         document.body.classList.add("theme-dark");
    //     } else {
    //         document.body.classList.remove("theme-dark");
    //     }
    //     return () => document.body.classList.remove("theme-dark");
    // }, [theme]);

    // Fetch data on component mount
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all endpoints concurrently
                const [statsResponse, closedResponse, chartResponse] = await Promise.all([
                    fetch(STATS_API_URL),
                    fetch(CLOSED_API_URL),
                    fetch(CHART_API_URL) // Add chart data fetch
                ]);

                // Process stats response (JSON)
                if (!statsResponse.ok) throw new Error(`Stats API error! status: ${statsResponse.status}`);
                const statsResult = await statsResponse.json();
                if (statsResult?.query_result?.data?.rows?.length > 0) {
                    setCounterData(statsResult.query_result.data.rows[0]);
                } else {
                    console.warn("No data found in stats API response");
                    setCounterData({});
                }

                // Process closed programs response (CSV)
                if (!closedResponse.ok) throw new Error(`Closed Programs API error! status: ${closedResponse.status}`);
                const closedCsvText = await closedResponse.text();
                const closedCount = parseSimpleCsvValue(closedCsvText);
                if (closedCount !== null) {
                    setClosedProgramsCount(closedCount);
                } else {
                    console.warn("Could not parse closed programs count from CSV");
                    setClosedProgramsCount(0);
                }

                // Process chart data response (CSV)
                if (!chartResponse.ok) throw new Error(`Chart API error! status: ${chartResponse.status}`);
                const chartCsvText = await chartResponse.text();
                const parsedChartData = parseComplexCsv(chartCsvText);
                setChartData(parsedChartData);

            } catch (e) {
                console.error("Failed to fetch data:", e);
                setError(e.message);
                setCounterData(null);
                setClosedProgramsCount(null);
                setChartData([]); // Clear chart data on error
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []); // Empty dependency array means this runs once on mount

    // Add scroll event listener for fade effect
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const heroSection = document.querySelector('.geometric-hero');
            const viewportHeight = window.innerHeight;

            // If we have the stats section and hero section
            if (statsRef.current && heroSection && statsContentRef.current) {
                const heroRect = heroSection.getBoundingClientRect();
                const statsRect = statsRef.current.getBoundingClientRect();

                // Calculate how far the hero has scrolled off-screen
                // 1 when hero is fully visible, 0 when hero is completely off-screen
                const heroVisibility = Math.max(0, Math.min(1,
                    (heroRect.bottom) / viewportHeight
                ));

                // When hero is still fully visible or mostly visible, fade should be complete
                // As the hero scrolls off, stats should become visible
                if (heroVisibility > 0.1) {
                    // Inverse of heroVisibility gives us the opacity we want for stats
                    // We use a somewhat steeper curve to make the transition more dramatic
                    const fadeAmount = Math.max(0, Math.min(1, (1 - heroVisibility) * 1.5));

                    // Apply the calculated opacity and transform values
                    statsContentRef.current.style.opacity = fadeAmount.toString();
                    statsContentRef.current.style.filter = `blur(${2 * (1 - fadeAmount)}px)`;
                    statsContentRef.current.style.transform = `translateY(${20 * (1 - fadeAmount)}px)`;
                } else {
                    // When hero is mostly off-screen, ensure stats are fully visible
                    statsContentRef.current.style.opacity = "1";
                    statsContentRef.current.style.filter = "blur(0)";
                    statsContentRef.current.style.transform = "translateY(0)";
                }
            }

            setLastScrollY(currentScrollY);
        };

        // Run once to set initial state
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const scrollToStats = () => {
        statsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'  // Align the top of the element with the top of the viewport
        });
    };

    return (
        <Page
            theme={theme}
            hideHorizontalLine={true}
        >
            {/* Interactive Hero Section with Minimal Design */}
            <div className="geometric-hero">
                {/* Subtle background shapes */}
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>

                <div className="hero-content">
                    <h1 className="hero-title">
                        Explore Solana

                        <span className="gradient-text"> Program.</span>
                    </h1>
                    <p className="hero-description">Discover insights about Solana's ecosystem with our interactive charts and statistics</p>
                    <button className="view-stats-btn" onClick={scrollToStats}>
                        View Stats
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 13l5 5 5-5"></path>
                            <path d="M7 6l5 5 5-5"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
                {loading && !error && <SpinnerLoader />}

                {!loading && !error && (
                    <>
                        {/* Add extra spacing */}
                        <div className="section-spacer"></div>

                        {/* Stats content wrapper with fade effect */}
                        <div
                            ref={statsContentRef}
                            className="stats-content"
                        >
                            {/* Title and Subtitle */}
                            <div ref={statsRef} className="section-header">
                                <h1 className="section-title">Solana Program Details</h1>
                                <p className="section-subtitle">Real-time data counters</p>
                                <div className="header-divider"></div>
                            </div>

                            {/* Container for counters */}
                            <div className="counters-container">
                                {counterData && (
                                    <>
                                        <Counter
                                            title="Total Programs Deployed on Solana"
                                            value={counterData.total_deployed}
                                        />
                                        <Counter
                                            title="Programs Deployed with Anchor"
                                            value={counterData.deployed_with_anchor}
                                        />
                                        <Counter
                                            title="Programs Deployed with On-Chain IDL"
                                            value={counterData.deployed_with_IDLs}
                                        />
                                    </>
                                )}
                                {closedProgramsCount !== null && (
                                    <Counter
                                        title="Total Programs Closed"
                                        value={closedProgramsCount}
                                    />
                                )}
                                {!counterData && closedProgramsCount === null && chartData.length === 0 && (
                                    <p>Could not load any data.</p>
                                )}
                            </div>

                            {/* Charts Section */}
                            {chartData.length > 0 && (
                                <div className="charts-container">
                                    <div className="chart-wrapper">
                                        <WeeklyDeployedChart data={chartData} />
                                    </div>
                                    <div className="chart-wrapper">
                                        <CombinedWeeklyChart data={chartData} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {error && <p style={{ color: 'red' }}>Error loading data: {error}</p>}
            </div>

            <style jsx>{`
                .geometric-hero {
                    position: relative;
                    height: 85vh;
                    width: 100%;
                    overflow: hidden;
                    background-color: #F3F3FF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2rem;
                    border-radius: 0;
                    padding: 0 2rem;
                }

                .shape {
                    position: absolute;
                    opacity: 0.15;
                    animation: float 18s ease-in-out infinite;
                    z-index: 1;
                    pointer-events: none;
                }

                .shape-1 {
                    width: 400px;
                    height: 400px;
                    top: 5%;
                    right: 5%;
                    animation-delay: 0s;
                    background: linear-gradient(45deg, #576EB7, #4457A1);
                    clip-path: circle(50% at 50% 50%);
                }

                .shape-2 {
                    width: 300px;
                    height: 300px;
                    bottom: 5%;
                    left: 5%;
                    animation-delay: 1s;
                    background: linear-gradient(45deg, #a18cd1, #576EB7);
                    clip-path: circle(50% at 50% 50%);
                }

                .shape-3 {
                    width: 200px;
                    height: 200px;
                    top: 50%;
                    right: 10%;
                    animation-delay: 2s;
                    background: linear-gradient(45deg, #CCD8FF, #576EB7);
                    clip-path: circle(50% at 50% 50%);
                }

                @keyframes float {
                    0% {
                        transform: translatey(0) scale(1);
                    }
                    50% {
                        transform: translatey(-20px) scale(1.05);
                    }
                    100% {
                        transform: translatey(0) scale(1);
                    }
                }

                .hero-content {
                    position: relative;
                    z-index: 10;
                    text-align: center;
                    max-width: 900px;
                    padding: 0;
                    margin: 0 auto;
                }

                .hero-title {
                    font-size: 3.5rem;
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                    font-weight: 250;
                    letter-spacing: 0.02em;
                    color: #576EB7;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #576EB7, #4457A1);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    display: inline-block;
                    font-weight: 300;
                }

                .hero-description {
                    font-size: 1.1rem;
                    margin-bottom: 3rem;
                    line-height: 1.8;
                    max-width: 550px;
                    color: #657082;
                    font-weight: 300;
                    margin-left: auto;
                    margin-right: auto;
                }

                .view-stats-btn {
                    background: #576EB7;
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    font-size: 0.95rem;
                    font-weight: 400;
                    border-radius: 8px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 14px rgba(87, 110, 183, 0.2);
                    transition: all 0.3s ease;
                    opacity: 1;
                    letter-spacing: 0.5px;
                }

                .view-stats-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(87, 110, 183, 0.3);
                    background: #4457A1;
                }

                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(18, 18, 18, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(18, 18, 18, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(18, 18, 18, 0);
                    }
                }

                .stats-section {
                    padding-top: 2rem;
                }
                
                .section-spacer {
                    height: 6rem;  /* Adjust this value to push down as needed */
                }

                .section-header {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 1.5rem;
                    scroll-margin-top: 1.5rem; /* Add scroll margin to adjust final scroll position */
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 500;
                    color: #576EB7;
                    letter-spacing: -0.01em;
                    cursor: default;
                }

                .section-subtitle {
                    color: #657082;
                    max-width: 42rem;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    margin-top: 0.125rem;
                }

                .header-divider {
                    height: 1px;
                    background-color: #CCD8FF;
                    margin-top: 1rem;
                }

                .counters-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.3rem;
                    padding: 0.5rem 0;
                    margin-bottom: 1.5rem;
                }

                .charts-container {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 1.3rem;
                    margin-bottom: 3rem; /* Add bottom margin for better spacing */
                }

                .chart-wrapper {
                    flex: 1;
                    min-width: 350px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                
                
                /* Stats content fade effects */
                .stats-content {
                    transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease;
                    will-change: opacity, transform, filter;
                }

                @media (max-width: 768px) {
                    .geometric-hero {
                        padding: 0 1.5rem;
                    }

                    .hero-title {
                        font-size: 2.5rem;
                    }

                    .hero-description {
                        font-size: 0.95rem;
                        max-width: 100%;
                    }
                }
            `}</style>
        </Page>
    );
};

export default Home;
