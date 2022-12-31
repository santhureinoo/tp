import Image from "next/image";
import { ButtonProps } from "../common/types";

interface Props {
    options: ButtonProps[];
}

const DropdownMenu = ({ options }: Props) => {
    return (
        <div className="block z-10">
            <div className="bg-white border border-gray-300 rounded-lg flex flex-col py-1 px-1 text-black shadow-lg">
                {options.map((option, index) => {
                    return <div key={'frag ' + index} onClick={e => option.onClick && option.onClick()} className={`flex hover:bg-gray-100 py-1 px-2 rounded ${option.css}`}>
                        <div className="space-x-2">
                            {/* <Image src="/asserts/main/edit.svg" alt="editSvg" width="15" height="15" /> */}
                            <span>{option.text}</span>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default DropdownMenu;