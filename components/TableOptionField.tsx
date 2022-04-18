import { v4 as uuidv4 } from 'uuid';
import CustomizedInput from './CustomizedInput';

interface Props {
    label : string;
    data : string[];
}
const TableOptionField = ({label,data} : Props) => {
    return (
        <div key={uuidv4()} className="flex items-baseline gap-x-2 font-medium text-gray-400">
            <span key={uuidv4()} className="text-sm">{label}</span>
            <div className="h-full">
                <CustomizedInput textColor='text-gray-400' hideDropDownPrefixIcon={true} inputType="select" value={data[0]} dropDownData={data} />
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