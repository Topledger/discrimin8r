import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Group } from '@visx/group';
import { Bar, LinePath, AreaClosed } from '@visx/shape';
import { scaleBand, scaleLinear, scaleTime } from '@visx/scale';
import { AxisLeft, AxisBottom, AxisRight } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { timeParse, timeFormat } from 'd3-time-format';
import { ParentSize } from '@visx/responsive';
import { Brush } from '@visx/brush';
import { extent } from 'd3-array';
import { LinearGradient } from '@visx/gradient';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import styles from '../../styles/Chart.module.scss';
import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';

// Date parsing and formatting
const parseDate = timeParse("%Y-%m-%d");
const formatDate = timeFormat("%b-%Y");
const formatTooltipDate = timeFormat("%Y-%m-%d");
const formatShortDate = timeFormat("%b %d");

// Accessors
const getWeek = (d) => d.week;
const getDate = (d) => d.date;
const getTotalDeployed = (d) => d.total_deployed;
const getAnchorDeployed = (d) => d.deployed_with_anchor;
const getPercentAnchor = (d) => d['%deployed_with_anchor'];

// Define margins
const focusChartMargin = { top: 10, right: 25, bottom: 30, left: 30 };
const brushChartMargin = { top: 10, right: 25, bottom: 10, left: 30 };
const BRUSH_HEIGHT_PERCENT = 0.1;

// Tooltip styles
const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: 'white',
    color: '#333',
    fontSize: '12px',
    fontWeight: 400,
    padding: '8px',
    borderRadius: '4px',
    lineHeight: '1.4',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    border: '1px solid #ccc',
};

// Legend Data & Colors
const totalColor = '#413ea0';
const anchorColor = '#8884d8';
const percentColor = '#fd7e14';
const brushAreaColor = '#b6b2f2';
const axisColor = '#657082';

// Custom Brush Handle component (can be shared or defined here)
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

// Internal chart component
const CombinedWeeklyChartInternal = ({ data, width, height, margin = focusChartMargin, mutedSeries }) => {
    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip();

    const processedData = useMemo(() => data.map(d => ({
        ...d,
        date: parseDate(d.week)
    })).sort((a, b) => a.date - b.date),
        [data]);

    // Dimension calculation uses new percentage & margins
    const brushChartHeight = Math.max(30, height * BRUSH_HEIGHT_PERCENT);
    const yMaxFocus = Math.max(0, height - margin.top - margin.bottom - brushChartHeight - brushChartMargin.top - brushChartMargin.bottom);
    const yMaxBrush = Math.max(0, brushChartHeight);
    const xMax = width - margin.left - margin.right;

    // Scales
    const xScaleContext = useMemo(() =>
        scaleTime({
            range: [0, xMax],
            domain: extent(processedData, getDate),
        }),
        [xMax, processedData]
    );

    const [xScaleFocus, setXScaleFocus] = useState(() => scaleTime({
        range: [0, xMax],
        domain: extent(processedData, getDate),
    }));

    // Filtered data based on brush
    const [filteredData, setFilteredData] = useState(processedData);

    // Further filter based on muted state FOR RENDERING
    const renderData = useMemo(() => {
        // We still need all data points for scales and context chart
        // Muting only affects rendering of focus chart elements
        return filteredData;
    }, [filteredData]);

    // CORRECTED: Y scales base domain on filteredData, NOT muted state
    const yCountScaleFocus = useMemo(() => {
        const maxVal = Math.max(...filteredData.map(getTotalDeployed));
        return scaleLinear({
            range: [yMaxFocus, 0],
            round: true,
            domain: [0, Math.max(10, maxVal * 1.1)], // Use filteredData max
        });
    }, [yMaxFocus, filteredData]); // Remove mutedSeries dependency

    const yPercentScaleFocus = useMemo(() => {
        const maxVal = Math.max(...filteredData.map(getPercentAnchor));
        return scaleLinear({
            range: [yMaxFocus, 0],
            round: true,
            domain: [0, Math.max(10, maxVal * 1.1)], // Use filteredData max
        });
    }, [yMaxFocus, filteredData]); // Remove mutedSeries dependency

    // Context Y scale uses all data
    const yScaleBrush = useMemo(() => {
        const maxVal = Math.max(...processedData.map(getTotalDeployed));
        return scaleLinear({
            range: [yMaxBrush, 0],
            round: true,
            domain: [0, Math.max(10, maxVal * 1.1)],
        });
    }, [yMaxBrush, processedData]);

    // Effect to synchronize state on initial load and resize
    useEffect(() => {
        if (width >= 10 && height >= 10 && processedData && processedData.length > 0) {
            const newXMax = width - margin.left - margin.right;
            const fullDomain = extent(processedData, getDate);

            setXScaleFocus(() => scaleTime({
                range: [0, newXMax],
                domain: fullDomain,
            }));
            setFilteredData(processedData);
        }
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
        setXScaleFocus(() => scaleTime({
            range: [0, xMax],
            domain: [x0, x1],
        }));
        hideTooltip();
    }, [processedData, xMax, hideTooltip]);

    // Tooltip handler
    const handleTooltip = useCallback((event, datum, type) => {
        // Get coordinates relative to the SVG element containing the event target
        const ownerSVG = event.target.ownerSVGElement;
        if (!ownerSVG) return;
        const point = localPoint(ownerSVG, event);
        if (!point) return; // Exit if point calculation fails

        const { x: svgX, y: svgY } = point;

        // Still need to find the closest data point to display its info
        // Convert SVG x-coordinate to the corresponding date on the focus scale
        const dateX = xScaleFocus.invert(svgX - margin.left); // Adjust for left margin

        if (renderData.length === 0) return; // Need data to find closest point

        // Find the datum closest to the inverted date
        const closestDatum = renderData.reduce((prev, curr) => {
            const prevDiff = Math.abs(getDate(prev).getTime() - dateX.getTime());
            const currDiff = Math.abs(getDate(curr).getTime() - dateX.getTime());
            return currDiff < prevDiff ? curr : prev;
        });

        // Pass the SVG-relative coordinates directly to showTooltip
        // TooltipWithBounds will use these, relative to the SVG's position
        showTooltip({
            tooltipData: { ...closestDatum, type }, // Use data from the closest point
            tooltipLeft: svgX,
            tooltipTop: svgY,
        });
    }, [xScaleFocus, renderData, showTooltip, margin.left]); // Dependencies: scale for invert, data, showTooltip, margin

    // Define brush reset handler BEFORE the early return
    const handleBrushReset = useCallback(() => {
        setFilteredData(processedData);
        setXScaleFocus(() => scaleTime({ range: [0, xMax], domain: extent(processedData, getDate) }));
    }, [processedData, xMax]);

    // Calculate initial brush extent BEFORE the early return
    const initialBrushExtent = useMemo(() => {
        if (!processedData || processedData.length === 0) return undefined;
        const [minDate, maxDate] = extent(processedData, getDate);
        return {
            start: { x: xScaleContext(minDate ?? new Date()) },
            end: { x: xScaleContext(maxDate ?? new Date()) }
        };
    }, [processedData, xScaleContext]);

    // Reduce ticks for focus chart (calculation can stay here)
    const numTicksFocus = width < 400 ? 2 : (width < 600 ? 4 : 6);

    // Prevent rendering if dimensions are too small
    if (width < 10 || height < 10 || !processedData || processedData.length === 0) return null;

    const barWidthRatio = 0.4; // Define bar width calculation factor

    return (
        <div style={{ position: 'relative' }}>
            {/* Focus Chart SVG */}
            <svg width={width} height={yMaxFocus + margin.top + margin.bottom}>
                <Group left={margin.left} top={margin.top}>
                    <GridRows scale={yCountScaleFocus} width={xMax} height={yMaxFocus} stroke="#e0e0e0" />

                    {/* Revert Total Deployed Bars */}
                    {!mutedSeries.includes('Total Deployed') && filteredData.map((item) => {
                        const date = getDate(item);
                        const nextDateIndex = filteredData.findIndex(i => i.date > date);
                        let dateDiff = nextDateIndex !== -1 ? xScaleFocus(filteredData[nextDateIndex].date) - xScaleFocus(date) : xScaleFocus.range()[1] - xScaleFocus(date);
                        if (filteredData.length === 1) dateDiff = xMax;
                        let barWidth = Math.max(1, (dateDiff * barWidthRatio || xMax / processedData.length * barWidthRatio) / 2);
                        const barX = xScaleFocus(date) - barWidth;

                        const totalVal = getTotalDeployed(item);
                        const totalHeight = Math.max(0, yMaxFocus - (yCountScaleFocus(totalVal) ?? yMaxFocus));

                        if (isNaN(barX) || totalHeight <= 0) return null;
                        return (
                            <Bar // Use standard Bar
                                key={`focus-total-bar-${getWeek(item)}`}
                                x={barX}
                                y={yMaxFocus - totalHeight} // Calculate Y directly
                                width={barWidth}
                                height={totalHeight} // Calculate height directly
                                fill={totalColor}
                                // No animation styles
                                onMouseLeave={hideTooltip}
                                onMouseMove={(event) => handleTooltip(event, item, 'Total Deployed')}
                            />
                        );
                    })}

                    {/* Revert Anchor Deployed Bars */}
                    {!mutedSeries.includes('Deployed w/ Anchor') && filteredData.map((item) => {
                        const date = getDate(item);
                        const nextDateIndex = filteredData.findIndex(i => i.date > date);
                        let dateDiff = nextDateIndex !== -1 ? xScaleFocus(filteredData[nextDateIndex].date) - xScaleFocus(date) : xScaleFocus.range()[1] - xScaleFocus(date);
                        if (filteredData.length === 1) dateDiff = xMax;
                        let barWidth = Math.max(1, (dateDiff * barWidthRatio || xMax / processedData.length * barWidthRatio) / 2);
                        const barX = xScaleFocus(date);

                        const anchorVal = getAnchorDeployed(item);
                        const anchorHeight = Math.max(0, yMaxFocus - (yCountScaleFocus(anchorVal) ?? yMaxFocus));

                        if (isNaN(barX) || anchorHeight <= 0) return null;
                        return (
                            <Bar // Use standard Bar
                                key={`focus-anchor-bar-${getWeek(item)}`}
                                x={barX}
                                y={yMaxFocus - anchorHeight} // Calculate Y directly
                                width={barWidth}
                                height={anchorHeight} // Calculate height directly
                                fill={anchorColor}
                                // No animation styles
                                onMouseLeave={hideTooltip}
                                onMouseMove={(event) => handleTooltip(event, item, 'Deployed w/ Anchor')}
                            />
                        );
                    })}

                    {/* Percentage Line Path (Not Animated currently) */}
                    {!mutedSeries.includes('% Deployed w/ Anchor') && (
                        <LinePath
                            data={filteredData} // Use filteredData for line path
                            x={(d) => xScaleFocus(getDate(d))}
                            y={(d) => yPercentScaleFocus(getPercentAnchor(d)) ?? 0}
                            stroke={percentColor}
                            strokeWidth={2}
                            shapeRendering="geometricPrecision"
                        />
                    )}

                    {/* Tooltip Trigger Bars (Not Animated) */}
                    {!mutedSeries.includes('% Deployed w/ Anchor') && filteredData.map((d) => {
                        const date = getDate(d);
                        const nextDateIndex = filteredData.findIndex(item => item.date > date);
                        let barWidthRatio = 0.6;
                        let dateDiff = nextDateIndex !== -1 ? xScaleFocus(filteredData[nextDateIndex].date) - xScaleFocus(date) : xScaleFocus.range()[1] - xScaleFocus(date);
                        if (filteredData.length === 1) dateDiff = xMax;
                        let barWidth = Math.max(1, dateDiff * barWidthRatio || xMax / processedData.length * barWidthRatio);
                        const barX = xScaleFocus(date) - barWidth / 2;
                        if (isNaN(barX)) return null;
                        return (
                            <Bar
                                key={`focus-line-tooltip-${getWeek(d)}`}
                                x={barX}
                                y={0}
                                width={barWidth}
                                height={yMaxFocus}
                                fill="transparent"
                                onMouseLeave={hideTooltip}
                                onMouseMove={(event) => handleTooltip(event, d, '% Deployed w/ Anchor')}
                            />
                        );
                    })}

                    <AxisBottom
                        top={yMaxFocus}
                        scale={xScaleFocus}
                        numTicks={numTicksFocus}
                        stroke={axisColor}
                        tickStroke={axisColor}
                        tickLength={4} // Reduce tick length
                        tickFormat={formatDate}
                        tickLabelProps={{
                            fill: axisColor,
                            fontSize: 11,
                            textAnchor: 'middle'
                        }}
                    />
                    <AxisLeft
                        scale={yCountScaleFocus}
                        stroke={axisColor}
                        tickStroke={axisColor}
                        numTicks={5}
                        tickLength={4}
                        tickLabelProps={{ fill: axisColor, fontSize: 11, textAnchor: 'end', dy: '0.33em' }}
                    />
                    <AxisRight
                        left={xMax}
                        scale={yPercentScaleFocus}
                        stroke={axisColor}
                        tickStroke={axisColor}
                        numTicks={5}
                        tickLength={4}
                        tickLabelProps={{ fill: axisColor, fontSize: 11, textAnchor: 'start', dy: '0.33em' }}
                    />
                </Group>
            </svg>

            {/* Context Chart SVG */}
            <svg width={width} height={yMaxBrush + brushChartMargin.top + brushChartMargin.bottom}>
                <Group left={brushChartMargin.left} top={brushChartMargin.top}>
                    <LinearGradient id="combined-brush-gradient" from={brushAreaColor} to={brushAreaColor} fromOpacity={0.4} toOpacity={0.1} />
                    <AreaClosed
                        data={processedData} // Use all data for context
                        x={(d) => xScaleContext(getDate(d)) ?? 0}
                        y={(d) => yScaleBrush(getTotalDeployed(d)) ?? 0} // Base context area on total deployed
                        yScale={yScaleBrush}
                        strokeWidth={0.5}
                        stroke={brushAreaColor}
                        fill="url(#combined-brush-gradient)"
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
                    <Brush
                        xScale={xScaleContext}
                        yScale={yScaleBrush}
                        width={xMax}
                        height={yMaxBrush}
                        margin={brushChartMargin}
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
                    top={tooltipTop} // Coordinates are already relative to SVG top-left
                    left={tooltipLeft} // which is same as wrapper div top-left
                    style={tooltipStyles}
                >
                    {/* Add hierarchy and color glyphs */}
                    {(() => {
                        const startDate = getDate(tooltipData);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 6);
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

                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                                    <div style={{ width: `10px`, height: `10px`, backgroundColor: totalColor, borderRadius: '50%', marginRight: '5px' }}></div>
                                    <strong>Total:</strong>
                                    <span style={{ marginLeft: '5px' }}>{getTotalDeployed(tooltipData)}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                                    <div style={{ width: `10px`, height: `10px`, backgroundColor: anchorColor, borderRadius: '50%', marginRight: '5px' }}></div>
                                    <strong>Anchor:</strong>
                                    <span style={{ marginLeft: '5px' }}>{getAnchorDeployed(tooltipData)}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: `10px`, height: `10px`, backgroundColor: percentColor, borderRadius: '50%', marginRight: '5px' }}></div>
                                    <strong>% Anchor:</strong>
                                    <span style={{ marginLeft: '5px' }}>{getPercentAnchor(tooltipData)}%</span>
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
const CombinedWeeklyChart = ({
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

    // Basic Modal Styles (Match WeeklyDeployedChart)
    const customModalStyles = {
        content: {
            top: '50%', left: '50%', right: 'auto', bottom: 'auto',
            marginRight: '-50%', transform: 'translate(-50%, -50%)',
            width: '90vw', height: '70vh',
            padding: '15px',
            border: '1px solid #ccc', borderRadius: '8px', display: 'flex',
            flexDirection: 'column', backgroundColor: '#fff'
        },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000 },
    };
    const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
    const modalChartContainerStyle = { flexGrow: 1, overflow: 'hidden', position: 'relative' };
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
        { label: 'Total Deployed', color: totalColor },
        { label: 'Deployed w/ Anchor', color: anchorColor },
        { label: '% Deployed w/ Anchor', color: percentColor },
    ];

    return (
        // Outer div remains standard widget
        <div className={styles.chartWidget}>
            {/* Header */}
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Weekly Deployment Analysis</h3>
                {/* Button opens LOCAL modal */}
                <button onClick={openLocalModal} className={styles.expandButton}>
                    <FiMaximize2 />
                </button>
            </div>

            {/* Chart Area (Normal view) */}
            <div style={{ height: 300 }}>
                <ParentSize>
                    {({ width, height }) => (
                        <CombinedWeeklyChartInternal
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
                                    borderRadius: '50%',
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
                contentLabel="Expanded Combined Weekly Chart"
            // Ensure app element is set!
            >
                {/* Modal Header */}
                <div style={modalHeaderStyle}>
                    <h3 className={styles.chartTitle} style={{ borderBottom: 'none', marginBottom: 0 }}>Weekly Deployment Analysis (Expanded)</h3>
                    <button onClick={closeLocalModal} className={styles.expandButton} style={{ fontSize: '1.2rem' }}>
                        <FiX />
                    </button>
                </div>

                {/* Modal Chart Container - Use ParentSize HERE */}
                <div style={modalChartContainerStyle}>
                    <ParentSize>
                        {({ width, height }) => (
                            <CombinedWeeklyChartInternal
                                data={data}
                                width={width}
                                height={height}
                                margin={chartMargin}
                                mutedSeries={mutedSeries} // Pass muted state if needed
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

export default CombinedWeeklyChart;