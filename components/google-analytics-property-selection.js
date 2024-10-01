import {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import Button from "./button";
import {FiLink2} from "react-fi";

export default function GoogleAnalyticsPropertySelection(props) {
    const [propertySummaries, setPropertySummaries] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);

    useEffect(() => {
        let result = [];
        props.accountSummaries.forEach((x) => {
            (x.propertySummaries || []).forEach((y) => {
                result.push({
                    accountName: x.displayName,
                    propertyId: y.property.replace('properties/', ''),
                    propertyName: y.displayName
                })
            });
        });
        setPropertySummaries(result);
    }, [props.accountSummaries]);

    async function saveGaPropertyId() {
        const options = {
            method: "POST", headers: {
                "X-KATHA-ADS-CLIENT-KEY": props.user.authKey, "Content-Type": "application/json",
            }, body: JSON.stringify({property_id: selectedProperty}),
        };
        let response = await fetch("https://api-in.katha.today/api/v1/k_ads/clients/ga/property-id", options);
        props.closeGoogleAccountPropertySelection();
    }

    return (<Transition appear show as={Fragment}>
        <Dialog
            as="div"
            className="relative z-50"
            onClose={props.closeGoogleAccountPropertySelection}
        >
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black/50"/>
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                            className="w-full max-w-xl transform overflow-hidden rounded bg-lbp dark:bg-dbp p-8 text-left align-middle shadow transition-all flex flex-col">
                            <div className="text-xl md:text-2xl font-bold mb-6 text-center">
                                Pick the desired Google Analytics property for connection
                            </div>
                            <div className="w-full h-64 overflow-scroll">
                                {propertySummaries.map((x) => {
                                    return <div key={`property-${x.propertyId}`}
                                                className={`my-1 border-2 hover:cursor-pointer rounded px-4 py-2 flex ${selectedProperty == x.propertyId ? 'border-accent text-darkaccent' : 'border-dtp'}`}
                                                onClick={() => {
                                                    setSelectedProperty(x.propertyId)
                                                }}>
                                        <div>
                                            {x.accountName}
                                            <br/>
                                            <span className="text-sm opacity-70 -mt-2">{x.propertyId}</span>
                                        </div>
                                        <div className="grow"></div>
                                        <div className="my-auto">{x.propertyName}</div>

                                    </div>
                                })}
                            </div>

                            <div className={`grow mx-auto mt-4 ${!!selectedProperty ? '' : 'grayscale'}`}
                                 onClick={() => saveGaPropertyId()}>
                                <Button text="Continue" icon={<FiLink2/>}/>
                            </div>

                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>);
}
