import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Group } from '@visx/group';
import { Bar, AreaClosed } from '@visx/shape';
import { scaleBand, scaleLinear, scaleTime } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { timeParse, timeFormat } from 'd3-time-format';
import { ParentSize } from '@visx/responsive';
import { Brush } from '@visx/brush';
import { extent } from 'd3-array';
import { LinearGradient } from '@visx/gradient';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi'; // Import icons
import styles from '../../styles/Chart.module.scss';
import { FiX } from 'react-icons/fi'; // Icon for close button
import Modal from 'react-modal'; // Re-add Modal import

// Date parsing and formatting
const parseDate = timeParse("%Y-%m-%d");
const formatDate = timeFormat("%b-%Y");
const formatTooltipDate = timeFormat("%Y-%m-%d");
const formatShortDate = timeFormat("%b %d"); // New short format

// Accessors
const getWeek = (d) => d.week;
const getDate = (d) => d.date;
const getTotalDeployed = (d) => d.total_deployed;

// Tooltip styles
const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: 'white',
    color: '#333', // Darker text for light background
    fontSize: '12px',
    fontWeight: 400,
    padding: '8px',
    borderRadius: '4px',
    lineHeight: '1.4',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)', // Lighter shadow
    border: '1px solid #ccc', // Add light grey border
};

// Color
const barColor = '#8884d8';
const brushAreaColor = '#b6b2f2'; // Lighter color for brush area
const axisColor = '#657082';

// Define margins & brush height
const focusChartMargin = { top: 10, right: 5, bottom: 30, left: 30 };
const brushChartMargin = { top: 10, right: 5, bottom: 10, left: 30 };
const BRUSH_HEIGHT_PERCENT = 0.1;

// Custom Brush Handle component
const BrushHandle = ({ x, height, isBrushActive }) => {
    const pathWidth = 8;
    const pathHeight = 15;
    if (!isBrushActive) {
        return null;
    }
    return (
        <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
            <path
                fill="white"
                d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
                stroke={axisColor}
                strokeWidth="1"
                style={{ cursor: 'ew-resize' }}
            />
        </Group>
    );
};

// Internal component - receives mutedSeries, does NOT render legend
const WeeklyDeployedChartInternal = ({ data, width, height, margin = focusChartMargin, mutedSeries }) => {
    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip();

    // Process data only once
    const processedData = useMemo(() => data.map(d => ({
        ...d,
        date: parseDate(d.week)
    })).sort((a, b) => a.date - b.date),
        [data]);

    const [filteredData, setFilteredData] = useState(processedData);

    // Dimension calculation uses new percentage & margins
    const brushChartHeight = Math.max(30, height * BRUSH_HEIGHT_PERCENT);
    // Adjust focus height calculation based on potentially changed height prop and new margins
    const yMaxFocus = Math.max(0, height - margin.top - margin.bottom - brushChartHeight - brushChartMargin.top - brushChartMargin.bottom);
    const yMaxBrush = Math.max(0, brushChartHeight);
    const xMax = width - margin.left - margin.right;

    // Scales
    // Shared X scale for context/brush (full time range)
    const xScaleContext = useMemo(() =>
        scaleTime({
            range: [0, xMax],
            domain: extent(processedData, getDate),
        }),
        [xMax, processedData]
    );

    // Dynamic X scale for focus chart (updated by brush)
    const [xScaleFocus, setXScaleFocus] = useState(() => scaleTime({
        range: [0, xMax],
        domain: extent(processedData, getDate),
    }));

    // Y scale for focus chart (based on filtered data)
    const yScaleFocus = useMemo(() => {
        const maxVal = Math.max(...filteredData.map(getTotalDeployed));
        return scaleLinear({
            range: [yMaxFocus, 0],
            round: true,
            // Domain depends only on filteredData now
            domain: [0, Math.max(10, maxVal * 1.1)],
        });
    }, [yMaxFocus, filteredData]); // Remove mutedSeries dependency

    // Y scale for brush chart (based on all data)
    const yScaleBrush = useMemo(() =>
        scaleLinear({
            range: [yMaxBrush, 0],
            round: true,
            domain: [0, Math.max(...processedData.map(getTotalDeployed)) * 1.1 || 10],
        }),
        [yMaxBrush, processedData]
    );

    // Effect to synchronize state on initial load and resize
    useEffect(() => {
        if (width >= 10 && height >= 10 && processedData && processedData.length > 0) {
            const newXMax = width - margin.left - margin.right;
            const fullDomain = extent(processedData, getDate);

            // Ensure focus scale reflects full domain and current width
            setXScaleFocus(() => scaleTime({
                range: [0, newXMax],
                domain: fullDomain,
            }));
            // Ensure filtered data is the full set initially
            setFilteredData(processedData);
        }
        // Depend on inputs that define the initial view
    }, [processedData, width, height, margin.left, margin.right]);

    // Brush handler
    const onBrushChange = useCallback((domain) => {
        if (!domain) return;
        const { x0, x1 } = domain;
        const subset = processedData.filter((d) => {
            const dDate = getDate(d);
            return dDate >= x0 && dDate <= x1;
        });
        setFilteredData(subset);
        // Update focus chart's X scale domain
        setXScaleFocus(() => scaleTime({
            range: [0, xMax],
            domain: [x0, x1],
        }));
        hideTooltip();
    }, [processedData, xMax, hideTooltip]);

    // Tooltip handler
    const handleTooltip = useCallback((event, datum) => {
        // Get coordinates relative to the SVG element containing the event target
        const ownerSVG = event.target.ownerSVGElement;
        if (!ownerSVG) return;
        const point = localPoint(ownerSVG, event);
        if (!point) return;

        const { x: svgX, y: svgY } = point;

        // Find the closest data point based on the X coordinate
        const dateX = xScaleFocus.invert(svgX - margin.left);
        if (filteredData.length === 0) return;
        const closestDatum = filteredData.reduce((prev, curr) => {
            const prevDiff = Math.abs(getDate(prev).getTime() - dateX.getTime());
            const currDiff = Math.abs(getDate(curr).getTime() - dateX.getTime());
            return currDiff < prevDiff ? curr : prev;
        });

        showTooltip({
            tooltipData: closestDatum, // Show data for the closest point
            tooltipLeft: svgX,
            tooltipTop: svgY,
        });
    }, [xScaleFocus, filteredData, showTooltip, margin.left]);

    // Reduce ticks for focus chart
    const numTicksFocus = width < 400 ? 2 : (width < 600 ? 4 : 6);

    // Brush reset handler
    const handleBrushReset = useCallback(() => {
        setFilteredData(processedData);
        setXScaleFocus(() => scaleTime({ range: [0, xMax], domain: extent(processedData, getDate) }));
    }, [processedData, xMax]);

    // Calculate initial brush extent BEFORE the early return
    const initialBrushExtent = useMemo(() => {
        if (!processedData || processedData.length === 0) return undefined; // Handle empty data
        const [minDate, maxDate] = extent(processedData, getDate);
        return {
            start: { x: xScaleContext(minDate ?? new Date()) },
            end: { x: xScaleContext(maxDate ?? new Date()) }
        };
    }, [processedData, xScaleContext]);

    const legendGlyphSize = 10; // Smaller glyph size

    // Prevent rendering if dimensions are too small (might be 0 on initial render)
    if (width < 10 || height < 10 || !processedData || processedData.length === 0) return null; // Added check for processedData

    return (
        // Add wrapper div with position: relative for tooltip context
        <div style={{ position: 'relative' }}>
            {/* Focus Chart SVG - Top margin applied via Group */}
            <svg width={width} height={yMaxFocus + margin.top + margin.bottom}>
                <Group left={margin.left} top={margin.top}> {/* Group applies top/left margin */}
                    <GridRows scale={yScaleFocus} width={xMax} height={yMaxFocus} stroke="#e0e0e0" />

                    {/* Revert to simple .map rendering */}
                    {!mutedSeries.includes('Total Deployed') && filteredData.map((item) => {
                        const date = getDate(item);
                        const barWidth = Math.max(1, xMax / filteredData.length * 0.6);
                        const barX = xScaleFocus(date) - barWidth / 2;

                        const barVal = getTotalDeployed(item);
                        const calculatedBarHeight = yMaxFocus - (yScaleFocus(barVal) ?? yMaxFocus);
                        const barHeight = Math.max(0, calculatedBarHeight);

                        if (barX === undefined || isNaN(barX) || barHeight <= 0) return null;

                        return (
                            <Bar // Use standard Bar
                                key={`focus-bar-${getWeek(item)}`}
                                x={barX}
                                y={yMaxFocus - barHeight} // Calculate Y directly
                                width={barWidth}
                                height={barHeight} // Calculate height directly
                                fill={barColor}
                                // No style or animation props
                                onMouseLeave={hideTooltip}
                                onMouseMove={(event) => handleTooltip(event, item)}
                            />
                        );
                    })}

                    <AxisLeft
                        scale={yScaleFocus}
                        stroke={axisColor}
                        tickStroke={axisColor}
                        numTicks={5}
                        tickLength={4}
                        tickLabelProps={{ fill: axisColor, fontSize: 11, textAnchor: 'end', dy: '0.33em' }}
                    />
                    <AxisBottom
                        top={yMaxFocus}
                        scale={xScaleFocus}
                        numTicks={numTicksFocus}
                        stroke={axisColor}
                        tickStroke={axisColor}
                        tickLength={4}
                        tickFormat={formatDate}
                        tickLabelProps={{
                            fill: axisColor,
                            fontSize: 11,
                            textAnchor: 'middle'
                        }}
                    />
                </Group>
            </svg>

            {/* Context Chart SVG */}
            <svg width={width} height={yMaxBrush + brushChartMargin.top + brushChartMargin.bottom}>
                <Group left={brushChartMargin.left} top={brushChartMargin.top}>
                    <LinearGradient id="brush-gradient" from={brushAreaColor} to={brushAreaColor} fromOpacity={0.4} toOpacity={0.1} />
                    <AreaClosed
                        data={processedData}
                        x={(d) => xScaleContext(getDate(d)) ?? 0}
                        y={(d) => yScaleBrush(getTotalDeployed(d)) ?? 0}
                        yScale={yScaleBrush}
                        strokeWidth={0.5}
                        stroke={brushAreaColor}
                        fill="url(#brush-gradient)" // Use gradient fill
                    />
                    <AxisBottom
                        top={yMaxBrush}
                        scale={xScaleContext}
                        numTicks={numTicksFocus}
                        stroke={axisColor}
                        hideTicks
                        hideAxisLine
                        tickLabelProps={{ display: 'none' }}
                    />
                    {/* Brush Component */}
                    <Brush
                        xScale={xScaleContext} // Brush operates on the context scale
                        yScale={yScaleBrush} // Provide Y scale for brush dimensions
                        width={xMax}
                        height={yMaxBrush}
                        margin={brushChartMargin} // Use brush margin
                        handleSize={8}
                        resizeTriggerAreas={['left', 'right']}
                        brushDirection="horizontal"
                        initialBrushPosition={initialBrushExtent} // Use the memoized value
                        onChange={onBrushChange}
                        onClick={handleBrushReset} // Use named reset handler
                        renderBrushHandle={(props) => <BrushHandle {...props} />}
                        selectedBoxStyle={{
                            fill: 'rgba(136, 132, 216, 0.2)',
                            stroke: '#b6b2f2',
                            strokeWidth: 0.5,
                            rx: 2
                        }}
                        useWindowMoveEvents // Better performance
                    />
                </Group>
            </svg>

            {/* Tooltip - Now positioned relative to the wrapper div */}
            {tooltipOpen && tooltipData && (
                <TooltipWithBounds
                    key={Math.random()}
                    top={tooltipTop}
                    left={tooltipLeft}
                    style={tooltipStyles}
                >
                    {/* Add hierarchy and color glyph */}
                    {(() => {
                        const startDate = getDate(tooltipData);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 6); // Calculate end date
                        return (
                            <>
                                {/* Style the date range */}
                                <div style={{
                                    marginBottom: '4px',
                                    fontSize: '11px', // Smaller font size
                                    color: '#413ea0' // Primary blue color
                                }}>
                                    {formatShortDate(startDate)} - {formatShortDate(endDate)}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        width: `10px`,
                                        height: `10px`,
                                        backgroundColor: barColor, // Use the bar color
                                        borderRadius: '50%',
                                        marginRight: '5px'
                                    }}></div>
                                    <strong>Deployed:</strong>
                                    <span style={{ marginLeft: '5px' }}>{getTotalDeployed(tooltipData)}</span>
                                </div>
                            </>
                        );
                    })()}
                </TooltipWithBounds>
            )}
        </div> // Close the wrapper div
    );
};

// Wrapper component - Implement LOCAL modal logic
const WeeklyDeployedChart = ({
    data,
    chartId,
    // onExpandClick prop is no longer strictly needed for local modal
}) => {
    const chartMargin = focusChartMargin;
    const legendGlyphSize = 10;

    // --- Local Modal State & Handlers ---
    const [localModalIsOpen, setLocalModalIsOpen] = useState(false);
    const openLocalModal = () => setLocalModalIsOpen(true);
    const closeLocalModal = () => setLocalModalIsOpen(false);

    // Basic Modal Styles (can be moved to SCSS)
    const customModalStyles = {
        content: {
            top: '50%', left: '50%', right: 'auto', bottom: 'auto',
            marginRight: '-50%', transform: 'translate(-50%, -50%)',
            width: '90vw', height: '70vh', // Reduced height
            padding: '15px',
            border: '1px solid #ccc', borderRadius: '8px', display: 'flex',
            flexDirection: 'column', backgroundColor: '#fff'
        },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000 },
    };
    const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
    const modalChartContainerStyle = { flexGrow: 1, overflow: 'hidden', position: 'relative' }; // Added position relative
    // ---

    // State for legend muting
    const [mutedSeries, setMutedSeries] = useState([]);
    const handleLegendClick = useCallback((label) => {
        setMutedSeries(currentMuted =>
            currentMuted.includes(label)
                ? currentMuted.filter(s => s !== label)
                : [...currentMuted, label]
        );
    }, []);

    // Legend Items
    const legendItems = [
        { label: 'Total Deployed', color: barColor }
    ];

    return (
        // Outer div remains standard widget
        <div className={styles.chartWidget}>
            {/* Header */}
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Weekly Programs Deployed</h3>
                {/* Button opens LOCAL modal */}
                <button onClick={openLocalModal} className={styles.expandButton}>
                    <FiMaximize2 />
                </button>
            </div>

            {/* Chart Area (Normal view) */}
            <div style={{ height: 300 }}>
                <ParentSize>
                    {({ width, height }) => (
                        <WeeklyDeployedChartInternal
                            data={data}
                            width={width}
                            height={height}
                            margin={chartMargin}
                            mutedSeries={mutedSeries}
                        />
                    )}
                </ParentSize>
            </div>

            {/* Footer - Legend (Normal view) */}
            <div style={{
                paddingTop: '10px',
            }}>
                {/* Horizontal Line */}
                <div style={{
                    width: '100%',
                    borderTop: `1px solid ${axisColor}`,
                    opacity: 0.3,
                    marginBottom: '10px'
                }}></div>

                {/* Legend Items Container */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    gap: '15px'
                }}>
                    {legendItems.map((item) => {
                        const isMuted = mutedSeries.includes(item.label);
                        return (
                            <div
                                key={item.label}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    opacity: isMuted ? 0.5 : 1
                                }}
                                onClick={() => handleLegendClick(item.label)}
                            >
                                {/* Circular glyph */}
                                <div style={{
                                    width: `${legendGlyphSize}px`,
                                    height: `${legendGlyphSize}px`,
                                    backgroundColor: item.color,
                                    borderRadius: '50%', // Make it circular
                                    marginRight: '5px'
                                }}></div>
                                <span style={{ color: axisColor }}>{item.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- LOCAL Modal Definition --- */}
            <Modal
                isOpen={localModalIsOpen}
                onRequestClose={closeLocalModal}
                style={customModalStyles}
                contentLabel="Expanded Weekly Deployed Chart"
            // Ensure app element is set in parent/app entry point!
            >
                {/* Modal Header */}
                <div style={modalHeaderStyle}>
                    <h3 className={styles.chartTitle} style={{ borderBottom: 'none', marginBottom: 0 }}>Weekly Programs Deployed (Expanded)</h3>
                    <button onClick={closeLocalModal} className={styles.expandButton} style={{ fontSize: '1.2rem' }}>
                        <FiX />
                    </button>
                </div>

                {/* Modal Chart Container - Use ParentSize HERE */}
                <div style={modalChartContainerStyle}>
                    <ParentSize>
                        {({ width, height }) => (
                            <WeeklyDeployedChartInternal
                                data={data}
                                width={width}
                                height={height}
                                margin={chartMargin} // Can use same margin or adjust for modal
                                mutedSeries={mutedSeries} // Pass muted state if needed in modal
                            />
                        )}
                    </ParentSize>
                </div>

                {/* --- ADD Legend inside Modal --- */}
                <div style={{ paddingTop: '15px' }}> {/* Add padding above legend in modal */}
                    {/* Horizontal Line */}
                    <div style={{
                        width: '100%',
                        borderTop: `1px solid ${axisColor}`,
                        opacity: 0.3,
                        marginBottom: '10px'
                    }}></div>

                    {/* Legend Items Container */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start',
                        gap: '15px'
                    }}>
                        {legendItems.map((item) => {
                            const isMuted = mutedSeries.includes(item.label);
                            return (
                                <div
                                    key={item.label}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        opacity: isMuted ? 0.5 : 1
                                    }}
                                    onClick={() => handleLegendClick(item.label)}
                                >
                                    {/* Circular glyph */}
                                    <div style={{
                                        width: `${legendGlyphSize}px`,
                                        height: `${legendGlyphSize}px`,
                                        backgroundColor: item.color,
                                        borderRadius: '50%',
                                        marginRight: '5px'
                                    }}></div>
                                    <span style={{ color: axisColor }}>{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* --- END Legend inside Modal --- */}
            </Modal>
        </div>
    );
};

export default WeeklyDeployedChart; 