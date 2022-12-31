import { ButtonProps } from "../common/types";
import PillButton from "./PillButton";
import Image from 'next/image';

interface Props {
    titleChar: string;
    subTitle: string;
    texts: string[];
    disabled: boolean;
    buttons: ButtonProps[];
    setOnVerify: (verify: boolean) => void;
    onVerify: boolean;
    isUploading: boolean;
    nonButtons?: React.ReactElement[];
}
const ReportStep = ({ titleChar, subTitle, texts, buttons, disabled, isUploading = false, nonButtons = [], onVerify, setOnVerify }: Props): React.ReactElement => {

    return <div className="relative flex flex-col border-2 border-black border-dotted rounded-lg overflow-hidden bg-white">

        {disabled && <div className="opacity-50 absolute bottom-0 left-0 h-full w-full backdrop-blur-sm bg-[#F0F0F0]">

        </div>}
        <div className="grid grid-cols-5">
            <div className="flex flex-row items-center p-8 sm:px-4 sm:h-full col-span-2">
                <p className="text-7xl font-thin rounded-full px-6">{titleChar}</p>
                <div className="flex flex-col  p-6 text-gray-600">
                    <div className="flex flex-row text-sm">
                        <p className="flex items-center text-gray-500">
                            <span className="font-semibold mr-2 text-xs uppercase">{subTitle}</span>
                        </p>
                    </div>
                    {texts.map((text, index) => {
                        return <div key={'frag ' + index} className="flex flex-row text-sm">
                            <p className="flex items-center  text-gray-500">
                                <span>{text}</span>
                            </p>
                        </div>
                    })}

                </div>
            </div>
            <div className="flex flex-row items-center p-8 sm:px-4 sm:h-full gap-x-4 col-span-2">
                {nonButtons.map(comp => {
                    return comp
                })}
                {buttons.map((button, index) => {
                    return <PillButton key={'frag ' + index} onClick={button.onClick} disabled={button.disable || isUploading} className={`${button.css} w-40 h-10`} text={button.text}></PillButton>
                })}
            </div>
            <div className="flex flex-row items-center p-8 sm:px-4 sm:h-full gap-x-2 justify-center">
                <span>Verified?</span>
                <Image onClick={() => { setOnVerify(!onVerify) }} alt="confirmSvg" src={`/asserts/main/${onVerify ? 'verified' : 'unverified'}.svg`} width="24" height="24" />
            </div>
        </div>
    </div>;
}

export default ReportStep;