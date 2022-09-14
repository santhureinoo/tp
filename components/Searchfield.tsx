import Image from 'next/image';
import React from 'react';

interface Props {
    IconFront: boolean;
    WithButton: boolean;
    ButtonText: string;
    InputElement?: JSX.Element;
    data: any[][];
    setFilteredData: (data: any[][]) => void;
}

const Searchfield = ({ IconFront = false, WithButton = false, ButtonText = '', InputElement, data, setFilteredData }: Props) => {
    const [text, setText] = React.useState("");
    const onChange = (value: string) => {
        console.log(value);
        setText(value);
        if (value !== '') {
            const filtered = data.filter(e => {
                return e.some(entry =>
                    entry.toString().includes(value))
            });
            setFilteredData(filtered);

        } else {
            setFilteredData(data);
        }

    }

    return (
        <div className="flex flex-row gap-x-2 h-[37px]">
            {InputElement && <div className="w-full">{InputElement}</div>}
            {!InputElement &&
                <div className="flex flex-row flex-1 items-center p-2 outline outline-2 outline-slate-200 focus-within:outline-black rounded-lg h-12 w-80">
                    {IconFront &&
                        <Image src="/asserts/main/search.svg" alt="searchSvg" unoptimized={true} width="25" height="25" />}
                    <input
                        onChange={(event) => {
                            onChange(event.target.value);
                        }}
                        className=" font-normal text-grey-darkest font-bold w-full px-2 outline-none text-gray-600"
                        type="text" value={text} placeholder="Search" />

                    {!IconFront && <Image src="/asserts/main/search.svg" alt="searchSvg" unoptimized={true} width="25" height="25" />}
                </div>
            }
            {WithButton && <button type='button' className="bg-blue-500 text-white  rounded-lg text-sm h-11 text-center w-24 h-12">{ButtonText}</button>}
        </div>
    )
}

export default Searchfield;