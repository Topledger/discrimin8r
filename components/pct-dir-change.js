import {FiArrowDown, FiArrowUp} from "react-fi";

export default function PctDirChange(props) {
    return (
        <div
            className={`flex w-fit rounded px-2 text-sm my-auto ${props.pct_change >= 0 ? 'bg-bgsuccess text-success' : 'bg-bgdanger text-danger'}`}>
            <div className="my-auto">{
                props.pct_change >= 0 ?
                    <FiArrowUp size={"1rem"}/>
                    :
                    <FiArrowDown size={"1rem"}/>
            }</div>
            <div className="my-auto">
                {props.pct_change.toString().replace('-', '')}%
            </div>
        </div>
    );
}
