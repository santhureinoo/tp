import { dummySummaryBillingTableData, dummySummaryOutletTableData } from "../common/constant";
import CustomizedInput from "./CustomizedInput";
import PillButton from "./PillButton";
import SummaryTable from "./SummaryTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';


interface Props {
    openUserEdit: boolean;
    setOpenUserEdit(openUserEdit: boolean): void;
}

const UserEdit = ({ openUserEdit, setOpenUserEdit }: Props) => {
    return (
        <div className={` edit-container ${openUserEdit ? "translate-x-0 " : "translate-x-full"}`}>
            <div className="flex justify-end">
                <button onClick={(e) => { setOpenUserEdit(!openUserEdit) }} className={`w-8 h-8`} type='button'>
                    <FontAwesomeIcon style={{ fontSize: '2em', cursor: 'pointer' }} icon={faCircleXmark} />
                </button>
            </div>
            <div className="edit-space-divider">
                <div className="text-lg pb-6 space-y-4">
                    <h2><b>User</b> <br /> Information</h2>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 pb-6">
                        <div className="col-span-2">
                            <CustomizedInput label={"Category"} inputType="select" value={"Administrator"} dropDownData={['Administrator', 'Customer']} />
                        </div>
                        <CustomizedInput label={"User ID"} inputType="text" value={""} />
                        <CustomizedInput label={"Phone Number"} inputType="text" value={""} />
                        <CustomizedInput label={"Username"} inputType="text" value={""} />
                        <CustomizedInput label={"Password"} inputType="text" value={""} />
                        <CustomizedInput label={"Email"} inputType="text" value={""} />
                        <CustomizedInput label={"Position"} inputType="text" value={""} />
                    </div>
                </div>
                <div className="edit-sub-container">
                    <CustomizedInput label={"Customer"} inputType="autocomplete" value={"Administrator"} dropDownData={['Administrator', 'Customer']} />
                </div>
                <div className="edit-sub-container">
                    <CustomizedInput label={"Outlet"} inputType="autocomplete" value={"Administrator"} dropDownData={['Administrator', 'Customer']} />
                </div>
            </div>
            <div className="flex flex-row gap-x-3 justify-between">
                <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Reset</button>
                <button type='button' className="bg-blue-500 text-white rounded-lg w-full text-sm h-11 text-center">Save</button>
            </div>
        </div>
    )
}

export default UserEdit;