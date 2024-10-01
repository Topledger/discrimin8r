import {useEffect, useState} from "react";
import PieChart from "./pie-chart";

export default function GendersChart(props) {
    const [dataPoints, setDataPoints] = useState([]);
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        let _labels = [];
        let _dataPoints = []
        Object.entries(props.distribution).forEach((x) => {
            _dataPoints.push(x[1]);
            _labels.push(`${x[0]} • ${x[1]}%`)
        });
        setDataPoints(_dataPoints);
        setLabels(_labels);
    }, []);

    return (
        <div className="mt-4 bg-lbp w-1/2 p-4 w-full rounded select-none shadow-md">
            <div className="text-sm text-lts dark:text-dts flex items-center">
                <div className="grow">
                    Genders
                </div>
                <div>{props.tag}</div>
            </div>
            <div className="mt-4 w-full h-[40vh]"><PieChart title="" dataPoints={dataPoints} labels={labels}/></div>
        </div>
    );
}
