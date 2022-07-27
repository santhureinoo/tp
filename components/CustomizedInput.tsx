    import React from 'react';
    import CustomizedDropDown from './CustomizedDropDown';

    interface Props {
        inputType: 'text' | 'mail' | 'number' | 'date' | 'textWithPostfix' | 'textarea' | 'select' | 'autocomplete' | 'selectWithPostfix';
        label?: any;
        textColor?: string;
        value: string;
        dropDownData? : string[];
        hideDropDownPrefixIcon?: boolean;
        extraDropDownIcon?: JSX.Element;
        postFix?: string;
        required?: boolean;
        errorField?: boolean;
        textAreaRows?: number;
    }

    const CustomizedInput = ({inputType, label, textColor = 'text-black',textAreaRows = 4, required = false, value, dropDownData, postFix = "", hideDropDownPrefixIcon = false, extraDropDownIcon } : Props) => {

        const validateInput = () => {
            if (required && !value) {
                return 'this field cannot be left empty.';
            } else {
                return undefined;
            }
        
        }

        const InputElem = () => {
            let elem;
            switch (inputType) {
                case 'text':
                case 'mail':
                case 'number':
                case 'date':
                    elem = <input type={inputType} className={`outline-none px-6 py-3 border-2 focus:border focus:border-black rounded-lg h-11 w-full ${!validateInput() ? '' : 'border-red-200'}`} />
                    break;
                case 'textWithPostfix':
                    elem = <div className="flex flex-row w-auto border-2 rounded-lg items-center focus-within:border focus-within:border-black">
                        <input type="text" className="outline-none overflow-hidden  px-6 py-3  h-11 w-9/12" />
                        <span className="m-2 text-sm text-center text-gray-300 w-3/12 ">{postFix}</span>
                    </div>
                    break;
                case 'textarea':
                    elem = <textarea id="message" rows={textAreaRows} className="block p-2.5 w-full rounded-lg border border-gray-300 " placeholder="Your message..."></textarea>; 
                    break;
                case 'autocomplete':
                    elem = <CustomizedDropDown extraIcon={extraDropDownIcon} inputType={'autocomplete'} hidePrefixIcons={hideDropDownPrefixIcon} data={dropDownData} selected={value} setSelected={function (selected: string): void {
                         } }/>
                    break;
                default:
                    elem = <CustomizedDropDown extraIcon={extraDropDownIcon} textColor={textColor} inputType={'dropdown'} hidePrefixIcons={hideDropDownPrefixIcon} data={dropDownData} selected={value} setSelected={function (selected: string): void {
                    } }/>
                    break;
            }
            return elem;
        }

        return (
            <div className={textColor}>
                {label && <span className="block pl-2 pb-1 text-xs text-slate-400">{label}</span>}
                {InputElem()}
                <span className='text-sm text-red-500'>{validateInput()}</span>
            </div>
        )
    }

    export default CustomizedInput;