import Head from "next/head";
import Link from "next/link";
import Header from "../components/header";
import {FiChevronRight} from "react-fi";
import SideNav from "../components/side-nav";
import Button from "../components/button";
import {useEffect, useState} from "react";
import LiveAdsChart from "../components/live-ads-chart";
import FullPageLoader from "../components/full-page-loader";
import Image from "next/image";

export default function Dashboard(props) {
    const [overview, setOverview] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const fetchOverview = async () => {
        setLoading(true);
        const options = {
            headers: {
                "X-KATHA-ADS-CLIENT-KEY": props.user.authKey,
                "X-KATHA-ADS-USER-EMAIL": props.user.userEmailAddress,
            }
        };
        let result = await fetch("https://api-in.katha.today/api/v1/k_ads/clients/overview", options);
        result = await result.json();
        setOverview(result.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOverview();
    }, []);

    return (<div className="h-screen flex flex-col">
        <Head>
            <title>Dashboard - Katha Ads</title>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <Header
            user={props.user}
            signOut={props.signOut}
            settings={props.settings}
            updateSettings={props.updateSettings}
        />

        <div className="md:flex grow overflow-auto bg-gratify">
            <SideNav settings={props.settings}/>

            <div className="grow">
                <div className="container px-4 md:px-8 py-8">
                    {loading && <FullPageLoader/>}

                    {!loading && <div className="hidden md:flex">
                        <div className="ml-2 my-auto text-2xl">
                            <span className="text-xl">👋</span> Hello {props.user.name}<span
                            className="text-accent"></span>
                            <div className="text-xs text-lts">{props.user.userEmailAddress}</div>
                        </div>
                        <div className="grow"></div>
                        <div className="flex my-auto space-x-4">
                            <Link href={"/create-campaign"}>
                                <Button
                                    text="New Campaign"
                                    iconPosition="right"
                                />
                            </Link>
                            <Link href={"/campaigns"}>
                                <Button
                                    text="New Ad"
                                    iconPosition="right"
                                />
                            </Link>
                        </div>
                    </div>}

                    {!loading && !!overview && !!overview.running_ads && overview.running_ads.length > 0 &&
                        <div className="mt-4 bg-lbp p-4 w-[100%] rounded shadow-md">
                            <LiveAdsChart runningAds={overview.running_ads}/>
                        </div>}


                    {!loading && !!overview &&
                        <div className="mt-4 bg-lbp p-4 w-full rounded hidden md:block shadow-md">
                            <div className="bg-lbp rounded md:flex items-center overflow-auto">

                                <table className="w-full text-sm text-left table-auto whitespace-nowrap">
                                    <thead className="text-lts">
                                    <tr className="">
                                        <th className="p-2">Title</th>
                                        <th className="p-2"></th>
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2">Reach</th>
                                        <th className="p-2">Clicks</th>
                                        <th className="p-2">CTR(%)</th>
                                        <th className="p-2 text-right"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {overview.ads.map((ad, adIndex) => (
                                        <tr
                                            className="border-t border-lbr dark:border-dbr hover:bg-lbs hover:dark:bg-dbs"
                                            key={adIndex}
                                        >
                                            <td className="px-2 py-1">
                                                {ad.name.length > 55 ? ad.name.substring(0, 55) + '...' : ad.name}
                                            </td>
                                            <td className="px-2 py-1 text-dts text-xs">
                                                {
                                                    ad.platform === 'unizone' &&
                                                    <span className="h-6 flex">
                                                        <Image
                                                            src="./images/wa_status.png"
                                                            height={0}
                                                            width={0}
                                                            alt=""
                                                            className="h-5 w-5 my-auto grayscale"
                                                        />
                                                        <div className="ml-1 my-auto">WA Status</div>
                                                    </span>
                                                }
                                                {
                                                    ad.platform != 'unizone' &&
                                                    <span className="h-6 flex">
                                                        <Image
                                                            src="./images/wa_group.png"
                                                            height={0}
                                                            width={0}
                                                            alt=""
                                                            className="h-5 w-5 my-auto grayscale"
                                                        />
                                                        <div className="ml-1 my-auto">WA Group</div>
                                                    </span>
                                                }
                                            </td>
                                            <td className="px-2 py-1">{ad.date}</td>
                                            <td className="px-2 py-1">
                                                {ad.status === "under_content_review" && (
                                                    <span className="text-warning flex">Under Review{" "}
                                                        <FiChevronRight className="mx-2 my-auto" size={"1.2rem"}/>{" "}
                                                        <span className="text-dts">Running</span>
                                                </span>
                                                )}
                                                {ad.status === "paused" && (
                                                    <span className="text-warning flex">Running{" "}
                                                        <FiChevronRight className="mx-2 my-auto" size={"1.2rem"}/>{" "}
                                                        <span className="text-dts">Placement Completed</span>
                                                </span>
                                                )}
                                                {ad.status === "running" && (
                                                    <span className="text-accent flex">Running{" "}
                                                        <FiChevronRight className="mx-2 my-auto" size={"1.2rem"}/>{" "}
                                                        <span className="text-dts">Placement Completed</span>
                                                </span>
                                                )}
                                                {ad.status === "rejected" && (
                                                    <span className="text-danger">Rejected</span>
                                                )}
                                                {ad.platform === "adnet" && ad.status === "completed" &&
                                                    <span className="text-success">Completed</span>
                                                }
                                                {ad.platform === "unizone" && ad.status === "completed" && (
                                                    <span className="text-success flex">Placement Completed{" "}
                                                        <FiChevronRight className="mx-2 my-auto" size={"1.2rem"}/>{" "}
                                                        <span className="text-dts">Completed</span>
                                                    </span>
                                                )}
                                                {ad.status === "finalized" &&
                                                    <span className="text-success">Completed</span>}
                                            </td>
                                            <td className="px-2 py-1">
                                                {new Intl.NumberFormat("en-IN", {
                                                    notation: "compact", compactDisplay: "short", currency: "INR",
                                                })
                                                    .format(ad.reach)
                                                    .replace("T", "K")}
                                            </td>
                                            <td className="px-2 py-1">{ad.clicks}</td>
                                            <td className="px-2 py-1">{ad.ctr}</td>
                                            <td className="px-2 py-1 text-right">
                                                {ad.platform === 'unizone' &&
                                                    <Link href={{
                                                        pathname: "/ad-insights",
                                                        query: {ad_uid: ad.record_uid}
                                                    }}>
                                                        <div
                                                            className="text-center active:text-dts rounded-sm flex cursor-pointer text-accent">
                                                            <div className="grow"></div>
                                                            <div className="my-auto">Details</div>
                                                            <FiChevronRight className="ml-0.5 my-auto" size="1rem"/>
                                                            <div className="grow"></div>
                                                        </div>
                                                    </Link>}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    </div>);
}
