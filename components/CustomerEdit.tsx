import CustomizedInput from "./CustomizedInput"
import React from 'react';
import Searchfield from "./Searchfield";
import SummaryTable from "./SummaryTable";
import ContactList from "./ContactList";
import { dummyContactList, dummySummaryTableData } from "../common/constant";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleXmark } from '@fortawesome/free-regular-svg-icons';


interface Props {
    openCustomerEdit: boolean;
    setOpenCustomerEdit(setCE: boolean): void;
}

const CustomerEdit = ({ openCustomerEdit, setOpenCustomerEdit }: Props) => {

    const [contactList, setContactList] = React.useState(dummyContactList);
    return (
        <div className={` edit-container ${openCustomerEdit ? "translate-x-0 " : "translate-x-full"}`}>
            <div className="flex justify-end">
                <button onClick={(e) => { setOpenCustomerEdit(!openCustomerEdit) }} className={`w-8 h-8`} type='button'>
                    <FontAwesomeIcon style={{ fontSize: '2em', cursor: 'pointer' }} icon={faCircleXmark} />
                </button>
            </div>
            <div className="edit-space-divider">
                <div className="space-x-3 space-y-3">
                    <div>
                        <h2><b>Customer</b> <br /> Information</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 pb-6">
                        <CustomizedInput label={"Customer ID"} inputType="text" value={""} />
                        <CustomizedInput label={"Customer Name"} inputType="text" value={""} />
                        <CustomizedInput label={"Country"} inputType="text" value={""} />
                        <CustomizedInput label={"City"} inputType="text" value={""} />
                        <CustomizedInput label={"Current Adress"} inputType="text" value={""} />
                        <CustomizedInput label={"Postal Code"} inputType="text" value={""} />
                    </div>
                </div>
                <div className="edit-sub-container">
                    <div className="flex">
                        <h2><b>Person In Charge</b><br /> Information</h2>
                    </div>
                    <ContactList contactList={contactList} setContactList={setContactList} />
                </div>
                <div className="edit-sub-container">
                    <div className="flex justify-between">
                        <h2><b>Outlet</b><br />Assignment</h2>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-x-1">
                        <Searchfield IconFront={true} WithButton={true} ButtonText={"Search"} />
                        <div className="w-full overflow-auto max-h-summaryTableHeight">
                            <SummaryTable headers={['ID', 'Name', 'Equipment', '']} data={dummySummaryTableData} />
                        </div>
                        <div className="flex justify-end">
                            <span onClick={e => {
                            }} className="cursor-pointer text-sm text-sky-400">Add Outlet Data</span>
                        </div>

                    </div>
                </div>
                <div className="flex flex-row gap-x-3 justify-between">
                    <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Reset</button>
                    <button type='button' className="bg-blue-500 text-white rounded-lg w-full text-sm h-11 text-center">Save</button>
                </div>
            </div>

        </div>
    )
}

export default CustomerEdit;