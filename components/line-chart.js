import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function LineChart(props) {
    const data = {
        labels: props.labels,
        datasets: [
            {
                legend: 'asd',
                fill: false,
                lineTension: 0.2,
                backgroundColor: '#fff',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 0,
                pointRadius: 1,
                pointHitRadius: 15,
                data: props.dataPoints
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {legend: {display: false}},
        scales: {
            x: {display: true, grid: {color: '#fff'}},
            y: {display: false}
        }
    };

    return (
        <Line id="" data={data} options={options}/>
    );
}