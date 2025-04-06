import React, { useState, useEffect } from 'react';
import Page from "../components/Page";
import Counter from '../components/Counter';
import WeeklyDeployedChart from '../components/charts/WeeklyDeployedChart'; // Import new chart component
import CombinedWeeklyChart from '../components/charts/CombinedWeeklyChart'; // Import new chart component
import SpinnerLoader from '../components/SpinnerLoader';
// We might need index styles later for layout
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

    return (
        <Page
            title="Solana Program Details"
            // subtitle="Real-time data counters"
            theme={theme}
        >
            {loading && !error && <SpinnerLoader />}

            {!loading && !error && (
                <>
                    {/* Container for counters */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.3rem',
                        padding: '0.5rem 0',
                        marginBottom: '0.8rem'
                    }}>
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
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: '1.3rem'
                        }}>
                            <div style={{ flex: '1', minWidth: '350px' }}>
                                <WeeklyDeployedChart data={chartData} />
                            </div>
                            <div style={{ flex: '1', minWidth: '350px' }}>
                                <CombinedWeeklyChart data={chartData} />
                            </div>
                        </div>
                    )}
                </>
            )}

            {error && <p style={{ color: 'red' }}>Error loading data: {error}</p>}
        </Page>
    );
};

export default Home;
