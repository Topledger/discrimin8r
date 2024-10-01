import Image from "next/image";
import { FiArrowLeft } from "react-fi";

export default function WhatsappImageStatusPreview(props) {
  return (
    <div className="bg-accent py-4 text-dtp min-h-[80vh] rounded">
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

      <div className="p-8">
        <div className="bg-lbs rounded overflow-hidden">
          {props.mediaPath && (
            <Image
              src={props.mediaPath}
              height="0"
              width="0"
              alt=""
              className="w-full h-auto object-cover object-center"
            />
          )}
          <div className="p-2 flex flex-col">
            <div className="text-[#111b21de] line-clamp-2">
              {props.previewTitle}
            </div>
            <div className="text-[#111b21c7] text-xs">Unizone . Ravi Shankar</div>
            <div className="text-[#111b214d] text-xs">katha-ads.com</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center text-2xl mb-16 px-4">
        <span>{props.linkPretext}&nbsp;</span>
        <span className="bg-dbr rounded-full px-2">s.unizone.one/xxxxxx</span>
      </div>
    </div>
  );
}
