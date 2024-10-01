import Image from "next/image";
import { FiArrowLeft, FiMoreVertical } from "react-fi";

export default function WhatsappPreview(props) {
  // Format plain content (https://stackoverflow.com/questions/64996987/whatsapp-text-format-convert-into-html-format)
  let contentHtml = props.data.content
    .replace(/(?:\*)([^*<\n]+)(?:\*)/g, "<strong>$1</strong>")
    .replace(/(?:_)([^_<\n]+)(?:_)/g, "<i>$1</i>")
    .replace(/(?:~)([^~<\n]+)(?:~)/g, "<s>$1</s>")
    .replace(/(?:```)([^```<\n]+)(?:```)/g, "<tt>$1</tt>");

  // Replace links with anchor tags (https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript)
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  contentHtml = contentHtml.replace(urlRegex, function (url) {
    return '<a class="text-[#53bdeb]" href="' + url + '">' + url + "</a>";
  });

  return (
    <div className="bg-[#efeae2] flex flex-col bg-[url('/images/whatsapp-chat-bg.png')] bg-cover bg-center min-h-[32rem]"
         style={{width: '25vw', height: '50vw', borderRadius: '0.5rem'}}>
      <div className="bg-[#009588] p-2 flex items-center text-[#fff]" style={{borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem'}}>
        <span className="mr-2">
          <FiArrowLeft />
        </span>
        <span className="relative rounded-full mr-2 h-10 w-10 overflow-hidden">
          <Image
            alt=""
            src="./images/katha_logo.webp"
            fill
            className="object-contain object-center"
          />
        </span>
        <span className="flex flex-col grow">
          <span className="font-bold">AdNet Partner Group</span>
          <span className="text-dtp text-xs">online</span>
        </span>
        <span className="ml-4">
          <FiMoreVertical />
        </span>
      </div>
      <div className="m-4 bg-[#fff] text-[#111b21] p-2 flex flex-col rounded-r rounded-b shadow-sm w-5/6 relative text-sm leading-relaxed break-words">
        <span className="h-0 w-0 border-l-8 border-l-transparent border-t-8 border-t-[#fff] absolute top-0 -left-[8px]"></span>
        <div className="font-bold mx-2 mb-2 text-[#009588]">Katha Ads</div>
        <div className="bg-[#f5f6f6] rounded overflow-hidden mb-2">
          {props.data.media_link && (
            <Image
              alt=""
              src={props.data.media_link}
              height="0"
              width="0"
              className="w-full h-auto object-cover object-center"
            />
          )}
          <div className="p-2 flex flex-col">
            <div className="text-[#111b21de] font-bold text-base">
              {props.data.previewTitle}
            </div>
            <div className="text-[#111b21c7] text-sm">{props.data.previewDescription}</div>
            <div className="text-[#111b214d] text-sm">s.exactlink.co</div>
          </div>
        </div>
        <div
            className="mx-2 whitespace-pre-wrap line-clamp-6"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
        ></div>
        <div className="mt-2 text-xs text-right text-[#667781]">4:09 pm</div>
      </div>
    </div>
  );
}
