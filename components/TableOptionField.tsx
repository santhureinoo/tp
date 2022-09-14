import { v4 as uuidv4 } from 'uuid';
import { DropdownProps } from '../common/types';
import CustomizedInput from './CustomizedInput';

interface Props {
    label : string;
    data : DropdownProps[] | string[];
    selectedValue?: string;
    onChange?: (selected: string) => void;
}
const TableOptionField = ({label,data, onChange, selectedValue} : Props) => {
    return (
        <div key={uuidv4()} className="flex items-baseline gap-x-2 font-medium text-gray-400">
            <span key={uuidv4()} className="text-sm">{label}</span>
            <div className="h-full">
                <CustomizedInput textColor='text-gray-400' onChange={onChange} hideDropDownPrefixIcon={true} inputType="select" value={selectedValue ? selectedValue : ""} dropDownData={data} />
            </div>
            
            {/* <select key={uuidv4()} className="border-2 rounded-lg h-full p-2 outline-none">
                {data.map((item, idx) => {
                    return (<option key={uuidv4()}>{item}</option>)
                })}
            </select> */}
        </div>
    )
}

export default TableOptionField;