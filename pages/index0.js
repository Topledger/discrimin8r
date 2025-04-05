import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Page from "../components/Page";
import styles from '../styles/index.module.scss';

// Create a custom loader component
const Loader = () => (
    <div className={styles.dashboardLoader}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

// Dynamically import TLDashboards, ensuring we get the default export
const TLDashboards = dynamic(
    () => import('tl-dashboards').then(mod => mod.default || mod),
    {
        ssr: false,
        loading: () => <Loader />
    }
);

const Home = () => {
    const [theme, setTheme] = useState("dark");
    const [isMounted, setIsMounted] = useState(false);
    const dashboardRef = useRef();

    // Use useEffect to handle theme changes only on the client
    useEffect(() => {
        setIsMounted(true);

        if (theme === "dark") {
            document.body.classList.add("theme-dark");
        } else {
            document.body.classList.remove("theme-dark");
        }

        return () => document.body.classList.remove("theme-dark");
    }, [theme]);

    return (
        <Page
            title="Home"
            subtitle="Dashboard Overview"
            theme={theme}
        >
            <div className={styles.dashboardSection}>
                <h1 className={styles.pageTitle}>Dashboard Overview</h1>
                {isMounted && (
                    <div className={styles.dashboardContainer}  >
                        <TLDashboards
                            client="solana"
                            token="BbltxQ56fNnR3lm5huJiK61fZtB0xJ1a8rXetlAI"
                            onDashboardLoad={() => {
                                console.log("Dashboard loaded callback triggered");
                            }}
                            dashboardRef={dashboardRef}
                            loader={<Loader />}
                        />
                    </div>
                )}
            </div>
        </Page>
    );
};

export default Home;
