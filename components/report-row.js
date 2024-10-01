import {FiClock, FiDownloadCloud} from "react-fi";
import {downloadReport} from "../services/utils";
import Link from "next/link";

export default function ReportRow(props) {
    function renderTargetingRow(key, values) {
        if (!!values && values.length > 0) {
            key = key.replaceAll("_", " ").toUpperCase();
            let valuesArr = values;
            if (typeof (values) == 'string') {
                valuesArr = [values]
            }
            return (<>
                <div className="flex flex-col rounded text-xs"
                     style={{background: '#02adb538', color: '#006f74', padding: '0.2rem 0.5rem', margin: '0.2rem 0'}}>
                    <div className="opacity-70 mb-0 mt-1">{key}</div>
                    <div className="capitalize">{valuesArr.join(', ')}</div>
                </div>
            </>);
        } else {
            return (<></>);
        }
    }

    function getReport(recordId, type) {
        downloadReport(props.user.authKey, recordId, type);
    }

    const generateTestPreview = async (uid) => {
        const options = {method: 'POST', headers: {"X-KATHA-ADS-CLIENT-KEY": props.user.authKey}};
        const url = `https://api-in.katha.today/api/v1/k_ads/clients/ad/${uid}/test`;
        let result = await fetch(url, options);
        result = await result.json();
        if (result.success && !!result.data) {
            window.open(result.data, "_blank");
        } else {
            alert(result.error)
        }
    }

    const renderStatus = (status) => {
        let background = undefined;
        let color = undefined;
        let label = undefined;
        if (status === 'under_content_review') {
            background = '#fff5db';
            color = '#513a00';
            label = 'In Review';
        } else if (status === 'running') {
            background = '#ccffcc';
            color = '#006604';
            label = 'Running';
        } else if (status === 'rejected') {
            background = '#ffcaca';
            color = '#510000';
            label = 'Rejected';
        } else if (status === 'completed') {
            background = '#006604';
            color = 'white';
            label = 'Completed';
        }

        return (
            <>
                <span className="text-sm uppercase px-2 inline-block w-fit"
                      style={{
                          background: background, color: color, borderRadius: '0.5rem'
                      }}>
                    {label}
                </span>
                {status === 'under_content_review' &&
                    <div
                        className="uppercase text-sm mt-2 w-fit rounded text-[#006604] px-2 bg-[#ccffcc] hover:cursor-pointer border"
                        onClick={() => generateTestPreview(props.record_uid)}
                    >
                        Test
                    </div>}
                {status === 'under_content_review' && <Link
                    href={{
                        pathname: '/create-ad', query: {
                            campaign_id: props.campaign.id,
                            ad_uid: props.record_uid,
                            ad_requested_impressions: props.reach,
                            ad_title: props.name,
                            ad_target_link: props.targetLink,
                            ad_media_type: props.media.type.includes('image') ? 'image' : 'video',
                            ad_link_pretext: props.linkPretext,
                            ad_preview_title: props.previewTitle,
                            ad_media_path: props.media.path
                        }
                    }}
                >
                    <div
                        className="uppercase border text-sm mt-2 w-fit rounded text-[#006f74] px-2 bg-[#02adb538]">Edit
                    </div>
                </Link>}
            </>
        );
    }

    return (
        <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-lbs">
            <th scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {props.xIndex + 1}
            </th>
            <td className="px-6 py-4 overflow-hidden truncate w-2">{props.date}</td>
            <td className="px-6 py-4">
                {renderStatus(props.status)}
            </td>
            <td className="px-6 py-4 truncate">
                {!!props.campaign && !!props.campaign.id && <div className="flex flex-row">
                    <div style={{lineHeight: '1rem'}}>{props.campaign.name}</div>
                </div>}
            </td>
            <td className="px-6 py-4 truncate w-2">{props.name}</td>
            <td className="px-6 py-4 text-ellipsis overflow-hidden max-w-sm">
                {props.media && props.media.path && <div>
                    {props.media.type.includes('image') && <img style={{height: '80px'}} src={props.media.path}/>}
                    {props.media.type.includes('video') &&
                        <video style={{height: '80px'}} muted={true} autoPlay={true} loop={true}
                               src={props.media.path}/>}
                </div>}
            </td>
            <td className="px-6 py-4 text-ellipsis max-w-2xl"
                style={{minWidth: '20rem'}}>{Object.keys(props.targeting).map((key) => renderTargetingRow(key, props.targeting[key]))}</td>
            <td className="px-6 py-4">{props.reach}</td>
            <td className="px-6 py-4">{props.status !== 'completed' ? '-' : props.clicks}</td>
            <td className="px-6 py-4">{props.status !== 'completed' ? '-' : props.ctr}</td>
            <td className="px-6 py-4">{props.avgEngagementRating > 0 ? props.avgEngagementRating : '-'}</td>
            <td className="px-6 py-4" style={{minWidth: '20rem'}}>
                {props.status === 'running' && <span
                    className="font-medium w-64 flex opacity-70"
                    style={{lineHeight: '1.5rem'}}>
                            <FiClock height="1rem" style={{margin: 'auto 0.25rem auto 0'}}/>Will be available after Ad Completion
                        </span>}
                {props.status === 'completed' &&
                    <>
                        {!!props.campaign && !!props.campaign.id && <span
                            className="font-medium w-64 text-accent dark:text-blue-500 hover:underline cursor-pointer flex"
                            style={{lineHeight: '1.5rem'}}
                            onClick={(e) => getReport(props.campaign.id, 'campaign')}>
                            <FiDownloadCloud height="1rem" style={{margin: 'auto 0.25rem auto 0'}}/>Download Campaign Report
                        </span>}
                        <span
                            className="font-medium w-64 text-accent dark:text-blue-500 hover:underline cursor-pointer flex"
                            style={{lineHeight: '1.5rem'}}
                            onClick={(e) => getReport(props.record_uid, props.platform)}>
                            <FiDownloadCloud height="1rem" style={{margin: 'auto 0.25rem auto 0'}}/>Download Ad Report
                        </span>
                    </>
                }
            </td>
            <td className="px-6 py-4 text-ellipsis overflow-hidden max-w-sm">{props.targetLink}</td>
        </tr>
    );
}