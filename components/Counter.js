import React from 'react';
import CountUp from 'react-countup';
import styles from '../styles/Counter.module.scss'; // We'll create this style file next

const Counter = ({ title, value, duration = 2 }) => {
    // Ensure value is a number, default to 0 if not
    const numericValue = typeof value === 'number' ? value : 0;

    return (
        <div className={styles.counterWidget}>
            <div className={styles.counterValue}>
                <CountUp
                    end={numericValue}
                    duration={duration}
                    separator=","
                />
            </div>
            <h3 className={styles.counterTitle}>{title}</h3>
        </div>
    );
};

export default Counter; 