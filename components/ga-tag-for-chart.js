import Image from "next/image";

export default function GaTagForChart(props) {
    return (
        <div className="flex bg-[#ffe7d8] text-warning px-2 rounded py-0.5">
            <Image
                src="./images/google-analytics.png"
                height={0}
                width={0}
                alt=""
                className="h-3 w-3 my-auto"
            />
            <div className="ml-1 my-auto text-xs">GA</div>
        </div>
    );
}