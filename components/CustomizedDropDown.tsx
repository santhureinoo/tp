import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DropdownProps } from '../common/types';
import { useDropdown } from '../hooks/UseDropdown';

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
    const [disabled, setDisabled] = React.useState(false)
    const [inner, setInner] = React.useState(false)
    const timeout = 150

    React.useEffect(() => {
        if (isOpen) {
            setInner(true)
        } else {
            setDisabled(true)
            setTimeout(() => {
                setDisabled(false)
                setInner(false)
            }, timeout + 10)
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
                            alert('working');
                            setIsOpen(!isOpen);
                        }}>
                            <a href="#" className={`text-sm overflow-hidden hover:bg-gray-100 ${textColor} block px-4 py-2`}>{dat}</a>
                        </li>
                    )
                } else {
                    return (
                        <li key={uuidv4()} onClick={(e: any) => {
                            setSelected(dat.key);
                            alert('working in key');
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
            <div className={customCSS ? `${textColor} ${customCSS} rounded-lg items-center` : `w-full ${textColor} font-medium rounded-lg text-sm px-4 py-2.5 items-center`}>
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
            <div className={`${isOpen ? 'absolute' : 'hidden'} top-7 right-0 w-full bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4`}>
                <ul className="py-1" aria-labelledby="dropdown">
                    {items}
                </ul>
            </div>
        </div>
    )
}

export default CustomizedDropDown;