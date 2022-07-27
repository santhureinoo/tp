import CustomizedInput from "../CustomizedInput"
import React from 'react';
import ContactList from "../ContactList";
import { dummyContactList, dummySummaryOutletTableData } from "../../common/constant";

const OutletInformation = () => {
    const [contactList, setContactList] = React.useState(dummyContactList);
    return (
        <React.Fragment>
            <div className="edit-sub-container">
                <div className="grid grid-cols-2 gap-x-4 pb-6">
                    <CustomizedInput label={"Business"} inputType="select" value={"KFC Indonesia"} dropDownData={['KFC Indonesia', 'FKC Indonesia']} />
                    <CustomizedInput label={"Status"} hideDropDownPrefixIcon={true} inputType="select" value={"Live"} dropDownData={['Live', 'Pending']} />
                    <CustomizedInput label={"Type"} hideDropDownPrefixIcon={true} inputType="select" value={"Live"} dropDownData={['Restaurant', 'Station']} />
                </div>
            </div>
            <div className="edit-sub-container">
                <div className="flex justify-between">
                    <h2><b>General</b></h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                    <CustomizedInput label={"Outlet ID"} inputType="text" value={""} />
                    {/* <CustomizedInput hideDropDownPrefixIcon={true} label={"Type"} inputType="select" value="FastFood" dropDownData={["FastFood", "Test", "Test"]} /> */}
                    <CustomizedInput label={"Outlet Name"} inputType="text" value={""} />
                    <div className={"col-span-2"}>
                        <CustomizedInput label={"Outlet Address"} inputType="textarea" value={""} />
                    </div>

                </div>
                {/* <div className="grid grid-cols-4 gap-x-6 gap-y-6">
                        <CustomizedInput hideDropDownPrefixIcon={true} extraDropDownIcon={<FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faDollarSign} />} label={"Tariff  Rate"} inputType="autocomplete" value={"0.08"} dropDownData={["0.08", "0.09", "0.1"]} />
                        <CustomizedInput hideDropDownPrefixIcon={true} extraDropDownIcon={<FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faDollarSign} />} label={"Max Tariff"} inputType="autocomplete" value="FastFood" dropDownData={["FastFood", "Test", "Test"]} />
                        <CustomizedInput label={"Latitude"} inputType="text" value={"6.586904-"} />
                        <CustomizedInput label={"Longitude"} inputType="text" value={"6.586904-"} />
                        <div className="col-span-2">
                            <CustomizedInput hideDropDownPrefixIcon={true} label={"Date of Tariff"} inputType="date" value={"22-02-2022"} dropDownData={["22-02-2022", "22-02-2022", "22-02-2022"]} />
                        </div>
                        <CustomizedInput label={"Share of Savings"} inputType="textWithPostfix" postFix="%" value={"6.586904-"} />
                        <CustomizedInput label={"A.I. Start Date"} inputType="text" value={"22-02-2022"} />
                    </div> */}
            </div>
            <div className="edit-sub-container">
                <div className="flex">
                    <h2><b>Person In Charge</b><br /> Information</h2>
                </div>
                <ContactList contactList={contactList} setContactList={setContactList} />
            </div>
            {/* <div className="edit-sub-container">
                    <div className="flex justify-between">
                        <h2><b>Quantity</b></h2>
                        <div className="w-[45%]">
                            <CustomizedInput textColor="text-gray-400" hideDropDownPrefixIcon={true} inputType="select" value="Type of Equipment" dropDownData={["Type of Equipment", "Type of Equipment", "Type of Equipment"]} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 items-center">
                        {/* <div className="w-full overflow-auto max-h-summaryTableHeight">
                            <SummaryTable headers={['Equipment ID', 'Type', 'Name', '']} data={dummySummaryOutletTableData} />
                        </div>
                        <div className="flex justify-end">
                            <span onClick={e => {

                            }} className="cursor-pointer text-sm text-sky-400">Add Equipment Data</span>
                        </div> 
                        <div className="flex flex-col rounded-lg text-xs text-slate-400 justify-center w-full h-32 bg-slate-200">
                            <span className="text-center">No Device Data is <br />available for this outlet</span>
                        </div>
                    </div>
                </div> */}
            <div className="flex flex-row gap-x-3 justify-between">
                <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Reset</button>
                <button type='button' className="bg-blue-500 text-white rounded-lg w-full text-sm h-11 text-center">Save</button>
            </div>
        </React.Fragment>
    )
}

export default OutletInformation;