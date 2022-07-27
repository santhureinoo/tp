import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    data?: string[];
    selected: string;
    textColor?: string;
    inputType: 'dropdown' | 'autocomplete';
    hidePrefixIcons: boolean;
    extraIcon?: JSX.Element;
    setSelected(selected: string): void;
}

const CustomizedDropDown = ({ data, selected, extraIcon, textColor = 'text-black', inputType, setSelected, hidePrefixIcons = false }: Props): React.ReactElement => {
    const [openOutletList, setOpenOutletList] = React.useState(false);

    const getInputElem = () => {
        if (inputType === 'autocomplete') {
            return (<input type="text" className="grow w-full outline-none" placeholder="Search" />);
        } else {
            return (<div tabIndex={0} onBlur={(e) => setOpenOutletList(false)} onClick={(e) => { setOpenOutletList(!openOutletList) }} className="cursor-pointer grow w-full outline-none overflow-hidden">{selected}</div>)
        }
    }

    return (
        <div className={`relative outline-none border-2 rounded-lg ${openOutletList ? 'focus-within:border focus-within:border-black' : ''} `}>
            <div className={`w-full ${textColor} font-medium rounded-lg text-sm px-4 py-2.5  items-center`}>
                <div className="flex w-full gap-x-2">
                    {!hidePrefixIcons && <svg className="text-slate-400 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>}
                    {getInputElem()}
                    <div tabIndex={0} onBlur={(e) => setOpenOutletList(false)}  onClick={(e) => { setOpenOutletList(!openOutletList) }} className="flex items-center gap-x-2">
                        {extraIcon}
                        <FontAwesomeIcon style={{cursor:'pointer' }} icon={faChevronDown} />
                    </div>

                </div>
            </div>
            <div className={`${openOutletList ? 'absolute' : 'hidden'} top-7 right-0 w-full bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4`}>
                <ul className="py-1" aria-labelledby="dropdown">
                    {data && data.map((dat, ind) => {
                        return (
                            <li key={uuidv4()} onClick={(e: any) => {
                                setSelected(dat);
                                setOpenOutletList(!openOutletList);
                            }}>
                                <a href="#" className={`text-sm overflow-hidden hover:bg-gray-100 ${textColor} block px-4 py-2`}>{dat}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default CustomizedDropDown;