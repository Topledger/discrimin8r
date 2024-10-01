import {FiDownloadCloud} from "react-fi";
import {downloadReport} from "../services/utils";
import Link from "next/link";

export default function CampaignRow(props) {
    function getReport(recordId, type) {
        downloadReport(props.user.authKey, recordId, type);
    }

    return (
        <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-lbs">
            <th scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {props.xIndex + 1}
            </th>
            <td className="px-6 py-4 overflow-hidden truncate w-2">
                <div>{props.name}</div>
                {props.category &&
                    <div className="bg-[#02adb538] text-[#006f74] rounded mt-1 w-fit px-2 py-0">{props.category}</div>}
            </td>
            <td className="px-6 py-4 text-accent hover:underline hover:cursor-pointer overflow-hidden truncate w-2">
                <Link href={{pathname: '/create-ad', query: {campaign_id: props.id}}}>
                    Create New Ad
                </Link>
            </td>
            <td className="px-6 py-4">{props.objective}</td>
            <td className="px-6 py-4">{props.impressions}</td>
            <td className="px-6 py-4 text-right">{props.adnetAdsCount + props.unizoneAdsCount}</td>
            <td className="px-6 py-4">
                {(props.adnetAdsCount + props.unizoneAdsCount) > 0 && <span
                    className="font-medium w-64 text-accent dark:text-blue-500 hover:underline cursor-pointer flex"
                    style={{lineHeight: '1.5rem'}}
                    onClick={(e) => getReport(props.id, 'campaign')}>
                    <FiDownloadCloud height="1rem" style={{margin: 'auto 0.25rem auto 0'}}/>Download Campaign Report
                </span>}
            </td>
        </tr>
    );
}