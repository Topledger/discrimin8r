import LineChart from "./line-chart";

export default function HourlyActivityChart(props) {
    const hours = [
        "12AM",
        "1AM",
        "2AM",
        "3AM",
        "4AM",
        "5AM",
        "6AM",
        "7AM",
        "8AM",
        "9AM",
        "10AM",
        "11AM",
        "12PM",
        "1PM",
        "2PM",
        "3PM",
        "4PM",
        "5PM",
        "6PM",
        "7PM",
        "8PM",
        "9PM",
        "10PM",
        "11PM",
    ];

    return (
        <div className="mt-4 bg-lbp dark:bg-dbp p-4 w-full rounded select-none shadow-md">
            <div className="text-sm text-lts dark:text-dts flex items-center">
                <div className="grow">
                    {props.title}
                </div>
                <div>{props.tag}</div>
            </div>
            <div className="mt-4 w-full flex">
                <div className="w-[80vw] h-[25vh]">
                    <LineChart title="" dataPoints={Object.values(props.distribution)} labels={hours}/>
                </div>
            </div>
        </div>
    );
}
