import React, {useEffect, useState} from "react"
import {Map, Overlay, ZoomControl} from "pigeon-maps"

export default function MapChart(props) {
    const [center, setCenter] = useState([10.826238, 76.794781]);
    const [zoom, setZoom] = useState(6);
    const [anchors, setAnchors] = useState([]);

    useEffect(() => {
        let result = [];

        props.geolocationsData.forEach((x) => {
            let dimension = 6;

            if (x.pct_users > 66) {
                dimension = 50;
            } else if (x.pct_users > 20) {
                dimension = 45;
            } else if (x.pct_users > 10) {
                dimension = 35;
            } else if (x.pct_users > 5) {
                dimension = 25;
            }
            else if (x.pct_users < 1) {
                dimension = 20;
            }

            result.push({
                location: x.location,
                pctUsers: x.pct_users,
                dimension: dimension,
                position: x.position
            });
        });
        setAnchors(result);
    }, [props.geolocationsData]);

    function mapTiler(x, y, z, dpr) {
        return `https://a.basemaps.cartocdn.com/light_all/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png`
    }

    return (
        <div className="mt-4 bg-lbp dark:bg-dbp p-4 rounded shadow-md">
            <div className="text-sm text-lts dark:text-dts flex items-center">
                <div className="grow">
                    Locations - Map View
                </div>
                <div>{props.tag}</div>
            </div>
            <div className="flex flex-row flex-wrap mt-4">
                <Map height={`40vh`}  width={`55vw`} defaultCenter={center} defaultZoom={zoom} minZoom={5} maxZoom={10}
                     provider={mapTiler}
                     metaWheelZoom={true}
                     boxClassname="">
                    {anchors.map((x, index) => {
                        return (
                            <Overlay key={`overlay-${index}`} anchor={x.position} offset={[0, 80]}>
                                <div
                                    className="w-fit rounded-sm mb-4 bg-white border text-lts border-dts px-2 text-left transition-all duration-200 opacity-0"
                                    style={{zIndex: 1000}}
                                    id={`map-marker-tooltip-${index}`}>
                                    <span className="text-sm uppercase">{x.location}</span>
                                    <br/>
                                    <div className="text-lg">{x.pctUsers} %</div>
                                </div>
                                <div
                                    className="bg-accent rounded-full opacity-50 ripple hover:cursor-pointer z-10 hover:opacity-70"
                                    style={{
                                        height: `${x.dimension}px`,
                                        width: `${x.dimension}px`
                                    }}
                                    onMouseOver={() => {
                                        document.getElementById(`map-marker-tooltip-${index}`).style.opacity = 100;
                                    }}
                                    onMouseOut={() => {
                                        document.getElementById(`map-marker-tooltip-${index}`).style.opacity = 0;
                                    }}
                                />
                            </Overlay>
                        )
                    })}
                    <ZoomControl/>
                </Map>
            </div>
        </div>
    );
}