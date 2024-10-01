import {Pie} from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function DoughnutChart(props) {
    const data = {
        labels: props.labels,

        datasets: [
            {
                cutout: '60%',
                circumference: 270,
                rotation: 225,
                borderRadius: 5,
                backgroundColor: ["#58be46", "#00ADB5", "#fbbd05", "#a957e0", "#f87a44", "#989898", "#2c68a0"],
                pointBackgroundColor: "#ffffff",
                borderJoinStyle: 'round',
                pointBorderWidth: 1,
                borderWidth: 4,
                pointHoverRadius: 5,
                borderColor: '#fff',
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgb(255,255,255)',
                pointHoverBorderWidth: 0,
                pointRadius: 1,
                hoverOffset: 2,
                pointHitRadius: 15,
                data: props.dataPoints
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {legend: {display: true, position: 'right'}},
        scales: {
            x: {display: false},
            y: {display: false}
        }
    };

    return (
        <Pie data={data} options={options}/>
    );
}