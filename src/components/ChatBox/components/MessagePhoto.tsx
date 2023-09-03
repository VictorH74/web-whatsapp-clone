import { EmptyUserImgIcon } from "@/components/global/IconPresets";
import Image from "next/image";

interface Props {
  imgSrc?: string;
}

export default function MessagePhoto(props: Props) {
  return (
    <>
      {props.imgSrc ? (
        <Image
          width={30}
          height={30}
          className="absolute left-[-34px] top-0 rounded-full"
          src={props.imgSrc}
          alt="sender-photo"
        />
      ) : (
        <EmptyUserImgIcon clssName="absolute left-[-34px] top-0" size={30} />
      )}
    </>
  );
}
