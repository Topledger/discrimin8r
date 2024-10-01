export default function VerticalDistributionChart(props) {
    const indexColors = {
        0: '#58be46',
        1: '#00ADB5',
        2: '#fbbd05',
        3: '#a957e0',
        4: '#f87a44',
        5: '#2c68a0',
        6: '#989898'
    }

    return (
        <div className="mt-4 bg-lbp dark:bg-dbp p-4 md:w-1/3 rounded">
            <div className="text-sm text-lts dark:text-dts flex items-center">
                <div className="grow">
                    {props.title}
                    <br/>
                    <span className="opacity-70">{props.description}</span>
                </div>
            </div>
            <div className="flex flex-row mt-8 space-10">
                <div className="grow"></div>
                {Object.entries(props.distribution).map((x, index) => {
                    return (
                        <div key={`dist-${props.title}-${index}`} className="mx-8 items-center">
                            <div className="-mt-2 mb-4 bg-dtt h-80 w-16 rounded relative">
                                <div
                                    className="bg-accent h-80 w-16 rounded absolute bottom-0"
                                    style={{
                                        height: `${x[1] * 2}%`,
                                        background: indexColors[(index % Object.entries(indexColors).length)]
                                    }}>
                                    <div className="text-center text-sm text-white font-semibold">{x[1]}%</div>
                                </div>
                            </div>

                            <div className="flex flex-col py-2 text-sm text-center font-semibold">
                                {x[0].split(' ')[0]}
                            </div>
                        </div>
                    )
                })}
                <div className="grow"></div>
            </div>
        </div>
    );
}