import Image from 'next/image';

interface Props {
    IconFront: boolean;
    WithButton: boolean;
    ButtonText: string;
    InputElement?: JSX.Element;
}

const Searchfield = ({ IconFront = false, WithButton = false, ButtonText = '', InputElement }: Props) => {
    return (
        <form className="flex flex-row gap-x-2">
            {InputElement && <div className="w-full">{InputElement}</div>}
            {!InputElement &&
                <div className="flex flex-row flex-1 outline outline-2 outline-slate-200 rounded-lg h-12 w-80">
                    {IconFront &&
                        (<div className="px-2 my-auto">
                            <Image src="/asserts/main/search.svg" alt="searchSvg" width="14" height="15" />
                        </div>)}
                    <input
                        className=" font-normal text-grey-darkest font-bold w-full px-2 outline-none text-gray-600"
                        type="text" placeholder="Search" />

                    {!IconFront && (<div className="px-2 my-auto">
                            <Image src="/asserts/main/search.svg" alt="searchSvg" unoptimized={true} width="14" height="15" />
                        </div>)}
                </div>
            }
            {WithButton && <button type='button' className="bg-blue-500 text-white  rounded-lg text-sm h-11 text-center w-24 h-12">{ButtonText}</button>}
        </form>
    )
}

export default Searchfield;