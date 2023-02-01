import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DropdownProps } from '../common/types';
import { useDropdown } from '../hooks/UseDropdown';
import Scrollbar from 'smooth-scrollbar';

interface Props {
    data?: Array<string | DropdownProps>;
    selected: string;
    textColor?: string;
    hideBorder?: boolean;
    inputType: 'dropdown' | 'autocomplete';
    hidePrefixIcons: boolean;
    extraIcon?: JSX.Element;
    customCSS?: string;
    setSelected(selected: string): void;
}

const CustomizedDropDown = ({ customCSS, data, selected, extraIcon, hideBorder = false, textColor = 'text-black', inputType, setSelected, hidePrefixIcons = false }: Props): React.ReactElement => {
    // const [openOutletList, setOpenOutletList] = React.useState(false);
    const [dropdownRef, isOpen, setIsOpen] = useDropdown(false, () => { });
    const menuDropdown = React.useRef<HTMLDivElement | null>(null);
    const [disabled, setDisabled] = React.useState(false)
    const [inner, setInner] = React.useState(false)
    const timeout = 150;

    // Scrollbar.detachStyle();

    React.useEffect(() => {
        if (isOpen) {
            menuDropdown.current !== null && Scrollbar.init(menuDropdown.current as HTMLElement);
            // Scrollbar.attachStyle();
            setInner(true);
        } else {
            menuDropdown.current !== null && Scrollbar.destroy(menuDropdown.current as HTMLElement);
            // Scrollbar.detachStyle();
            setDisabled(true);

            setTimeout(() => {
                setDisabled(false)
                setInner(false)
            }, timeout + 10);
        }
    }, [isOpen])

    const selectedDisplayValue = React.useMemo(() => {
        if (data) {
            const selectedValue = data.find(dat => {
                if (typeof dat === 'string') {
                    return dat === selected;
                } else {
                    return dat.key === selected;
                }
            });
            if (selectedValue) {
                return typeof selectedValue === 'string' ? selectedValue : selectedValue.value;
            } else {
                return "";
            }
        } else {
            return "";
        }
    }, [selected, data]);

    const items = React.useMemo(() => {
        if (data) {
            return data.map((dat) => {
                if (typeof dat === 'string') {
                    return (
                        <li key={uuidv4()} onClick={(e: any) => {
                            setSelected(dat);
                            setIsOpen(!isOpen);
                        }}>
                            <a href="#" className={`text-sm overflow-hidden hover:bg-gray-100 ${textColor} block px-4 py-2`}>{dat}</a>
                        </li>
                    )
                } else {
                    return (
                        <li key={uuidv4()} onClick={(e: any) => {
                            setSelected(dat.key);
                            setIsOpen(!isOpen);
                        }}>
                            <a href="#" className={`text-sm overflow-hidden hover:bg-gray-100 ${textColor} block px-4 py-2`}>{dat.value}</a>
                        </li>
                    )
                }
            });
        } else {
            return <></>
        }
    }, [data]);

    const getInputElem = () => {
        if (inputType === 'autocomplete') {
            return (<input type="text" className="grow w-full outline-none" placeholder="Search" />);
        } else {
            return (<div className="cursor-pointer grow w-full outline-none overflow-hidden">{selectedDisplayValue}</div>)
        }
    }

    return (
        <div ref={dropdownRef} className={`relative outline-none ${hideBorder ? '' : 'border-2'} rounded-lg ${isOpen ? 'focus-within:border focus-within:border-black' : ''} `}>
            <div className={customCSS ? `${textColor} ${customCSS} rounded-lg items-center` : `w-full min-w-[128px] ${textColor} font-medium rounded-lg text-sm px-4 py-2.5 items-center`}>
                <div onClick={(e) => { setIsOpen(!isOpen); }} className="flex w-full gap-x-2">
                    {!hidePrefixIcons && <svg className="text-slate-400 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>}
                    {getInputElem()}
                    <div className="flex items-center gap-x-2">
                        {extraIcon}
                        <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faChevronDown} />
                    </div>

                </div>
            </div>
            <div ref={menuDropdown} className={`${isOpen ? 'absolute' : 'hidden-important'} top-7 max-h-48 overflow-y-auto right-0 min-w-[176px] w-full bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4`}>
                <ul className="py-1" aria-labelledby="dropdown">
                    {items}
                </ul>
            </div>
        </div>


        // <div className="relative inline-block text-left">
        //     <div>
        //         <button onClick={(e) => { setIsOpen(!isOpen); }} type="button" className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100" id="menu-button" aria-expanded="true" aria-haspopup="true">
        //             Options
        //             <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        //                 <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        //             </svg>
        //         </button>
        //     </div>
        //     <div className={`${isOpen ? 'absolute' : 'hidden'}  right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
        //         <div className="py-1" role="none">
        //             <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-0">Account settings</a>
        //             <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-1">Support</a>
        //             <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-2">License</a>
        //             <form method="POST" action="#" role="none">
        //                 <button type="submit" className="text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem" tabIndex={-1} id="menu-item-3">Sign out</button>
        //             </form>
        //         </div>
        //     </div>
        // </div>
    )
}

export default CustomizedDropDown;