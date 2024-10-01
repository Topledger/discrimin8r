import {FiEye} from "react-fi";
import Button from "./button";
import Link from "next/link";

export default function LatestPlacementsChart(props) {
    return (
        <div className="mt-4 bg-lbp dark:bg-dbp p-4 md:w-1/2 rounded relative shadow-md">
            <div className="text-sm text-lts dark:text-dts flex items-center">
                <div className="grow">
                    Latest Placements
                </div>
                <div>{props.tag}</div>
            </div>
            <div className="z-0 flex flex-col mt-4">
                {props.placements.length > 0 &&
                    props.placements.slice(0, 6).map((x, index) => {
                        return (
                            <div
                                key={`dist-${props.title}-${index}`}
                                className="flex items-center pb-4 rounded cursor-default relative text-sm"
                            >
                                <div className="flex-grow">
                                    {x.generated_id}
                                    <div className="flex uppercase text-xs">
                                        <div className="bg-dtp text-lts w-fit px-1 rounded-sm">{x.date}</div>
                                        <div className="ml-2 bg-dtp text-lts w-fit px-1 rounded-sm">{x.time}</div>
                                        {!!x.district && <div
                                            className="ml-2 bg-dtp text-lts w-fit px-1 rounded-sm">{x.district}</div>}
                                    </div>
                                </div>
                                <div className="uppercase text-right flex">
                                    {x.impressions}
                                    <FiEye
                                        className="my-auto ml-2 text-lts dark:text-dts"
                                        size={"0.8rem"}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className="z-20 -mt-2 relative text-center">
                <Link
                    href={{
                        pathname: "/ad-placements",
                        query: {
                            ad_uid: props.uid,
                            ad_requested_impressions: props.reach,
                            ad_title: props.name,
                            ad_media_type: props.media.type.includes("image") ? "image" : "video",
                            ad_media_path: props.media.path
                        },
                    }}>
                    <Button text="View all"/>
                </Link>
            </div>
            <div className="z-10 absolute bottom-1 left-1 w-[98%] h-48"
                 style={{background: 'linear-gradient(0deg, white, transparent)'}}>
            </div>
        </div>
    );
}
