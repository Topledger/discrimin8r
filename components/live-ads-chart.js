export default function LiveAdsChart(props) {
    const indexColors = {
        0: "#58be46"
    };

    return (
        <div className="bg-lbp dark:bg-dbp">
            <div className="text-sm text-lts dark:text-dts flex items-center">
                <div className="grow">
                    Active Ads
                </div>
                <div className="bg-danger px-2 rounded-sm text-white text-xs">LIVE</div>
            </div>
            <div className="flex flex-col mt-4">
                {props.runningAds.slice(0, 4).map((x, index) => {
                    return (
                        <>
                            <div
                                key={`dist-${props.title}-${index}`}
                                className="flex items-center text-md rounded-t"
                            >
                                <div>
                                    {x.media.type.includes('image') &&
                                        <img className="rounded" style={{height: '50px', width: '50px'}}
                                             src={x.media.path}/>}
                                    {x.media.type.includes('video') &&
                                        <video className="rounded" style={{height: '50px', width: '50px'}} muted={true}
                                               autoPlay={true}
                                               loop={true} src={x.media.path}/>}
                                </div>
                                <div className="ml-2 grow mb-1">
                                    <div>{x.title}</div>
                                    <div className="text-lts text-sm">CTR: {x.ctr}%</div>
                                </div>
                                <div className="font-semibold text-lts text-right">
                                    <span className="text-accent">{x.reach_done} %</span>
                                    <br/>
                                    <span
                                        className="text-sm">of {x.requested_impressions.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                            <div className="mt-2 mb-8 bg-lbs dark:bg-dbs h-2 w-full rounded">
                                <div
                                    className="bg-accent h-2 w-64 rounded"
                                    style={{
                                        width: `${x.reach_done}%`,
                                        background:
                                            indexColors[index % Object.entries(indexColors).length],
                                    }}
                                ></div>
                            </div>
                        </>
                    );
                })}
            </div>


            {/*<div className="w-1/4 flex">*/}
            {/*    {props.runningAds[currentAdIndex].media.type.includes('image') &&*/}
            {/*        <img style={{height: '80px'}} src={props.runningAds[currentAdIndex].media.path}/>}*/}
            {/*    {props.runningAds[currentAdIndex].media.type.includes('video') &&*/}
            {/*        <video style={{height: '80px'}} muted={true} autoPlay={true}*/}
            {/*               loop={true} src={props.runningAds[currentAdIndex].media.path}/>}*/}

            {/*    <div>Requested Impressions</div>*/}
            {/*    /!*ad.reach.toLocaleString("en-IN")*!/*/}
            {/*    {props.runningAds[currentAdIndex].requested_impressions.toLocaleString("en-IN")}*/}
            {/*</div>*/}
            {/*</div>*/}
        </div>
    );
}
