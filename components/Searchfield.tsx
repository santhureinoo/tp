import Image from 'next/image';

interface Props {
    IconFront: boolean;
    WithButton: boolean;
    ButtonText: string;
    InputElement?: JSX.Element;
}

const Searchfield = ({ IconFront = false, WithButton = false, ButtonText = '', InputElement }: Props) => {
    return (
        <form className="flex flex-row gap-x-2 h-[37px]">
            {InputElement && <div className="w-full">{InputElement}</div>}
            {!InputElement &&
                <div className="flex flex-row flex-1 items-center p-2 outline outline-2 outline-slate-200 focus-within:outline-black rounded-lg h-12 w-80">
                    {IconFront &&
                        <Image src="/asserts/main/search.svg" alt="searchSvg" unoptimized={true} width="25" height="25" />}
                    <input
                        className=" font-normal text-grey-darkest font-bold w-full px-2 outline-none text-gray-600"
                        type="text" placeholder="Search" />

                    {!IconFront && <Image src="/asserts/main/search.svg" alt="searchSvg" unoptimized={true} width="25" height="25" />}
                </div>
            }
            {WithButton && <button type='button' className="bg-blue-500 text-white  rounded-lg text-sm h-11 text-center w-24 h-12">{ButtonText}</button>}
        </form>
    )
}

export default Searchfield;