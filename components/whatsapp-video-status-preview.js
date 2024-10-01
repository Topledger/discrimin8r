import Image from "next/image";
import { FiArrowLeft } from "react-fi";

export default function WhatsappVideoStatusPreview(props) {
  return (
    <div className="bg-dbs py-4 text-dtp relative rounded">
      <div className="absolute top-4 z-10 w-full">
        <div className="flex">
          <span className="bg-lbp h-[1.5px] w-1/3"></span>
          <span className="bg-dbr h-[1.5px] w-2/3"></span>
        </div>
        <div className="px-4 py-2 flex items-center">
          <FiArrowLeft />
          <Image
            height={0}
            width={0}
            alt=""
            className="ml-2 h-10 w-10 rounded-full"
            src="https://storage.katha.today/XGyru2r6ogCe3zdwxHqrLwmo"
          />
          <div className="ml-2">
            <div className="font-semibold">My Status</div>
            <div className="text-xs">Yesterday, 9:27 am</div>
          </div>
        </div>
      </div>

      <div className="flex items-center w-full min-h-[80vh]">
        <video
          className="w-full h-auto"
          loop
          muted
          autoPlay
          controls=""
          src={props.mediaPath}
        />
      </div>
      <div className="absolute bottom-8 z-10 w-full flex flex-wrap items-center justify-center px-4">
        <span>{props.linkPretext}&nbsp;</span>
        <span>s.unizone.one/xxxxxx</span>
      </div>
    </div>
  );
}
