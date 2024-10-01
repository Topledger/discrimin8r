import Image from "next/image";

export default function HorizontalDistributionChart(props) {
    const indexColors = {
        0: "#58be46",
        1: "#00ADB5",
        2: "#fbbd05",
        3: "#a957e0",
        4: "#f87a44",
        5: "#2c68a0",
        6: "#989898",
    };

    return (
        <div className="mt-4 bg-lbp dark:bg-dbp p-4 md:w-1/2 rounded shadow-md">
            <div className="text-sm text-lts dark:text-dts flex items-center">
                <div className="grow">
                    {props.title}
                    <br/>
                    <span className="opacity-70">{props.description}</span>
                </div>
                <div>{props.tag}</div>
            </div>
            <div className={`flex flex-col mt-4 ${props.scrollStyle}`}>
                {Object.entries(props.distribution).map((x, index) => {
                    return (
                        <>
                            <div
                                key={`dist-${props.title}-${index}`}
                                className="flex items-center py-1 text-md"
                            >
                                <div className="grow">
                  <span>
                    {x[0].length > 45 ? x[0].substring(0, 45) + "..." : x[0]}
                  </span>
                                </div>
                                <div className="font-semibold text-accent">{x[1]} %</div>
                            </div>
                            <div className="mb-4 bg-lbs dark:bg-dbs h-2 w-full rounded">
                                <div
                                    className="bg-accent h-2 w-64 rounded"
                                    style={{
                                        width: `${x[1]}%`,
                                        background:
                                            indexColors[index % Object.entries(indexColors).length],
                                    }}
                                ></div>
                            </div>
                        </>
                    );
                })}
            </div>
        </div>
    );
}
