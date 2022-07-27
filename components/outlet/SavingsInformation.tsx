import CustomizedInput from "../CustomizedInput"
import React from 'react';
import { dummyContactList, dummySavingEditData, dummySavingEditHeaders, dummySummaryOutletTableData, dummySummaryTableData } from "../../common/constant";
import SummaryTable from "../SummaryTable";

const SavingsInformation = () => {
    return (
        <React.Fragment>
            <div className="edit-sub-container">
                <div className="grid grid-cols-2 gap-x-6 gap-y-6 pb-6">
                    <CustomizedInput label={"% of Share of Savings"} inputType="text" value={""} />
                    <CustomizedInput label={"Tariff Month"} inputType="text" value={""} />
                    <CustomizedInput label={"Last Available Tariff"} inputType="text" value={""} />
                </div>
            </div>
            <div className="edit-sub-container">
                <div className="flex justify-between">
                    <h2><b>Equipment</b></h2>
                </div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-6">
                    <CustomizedInput label={"No. of EX in Outlet"} inputType="text" value={""} />
                    <CustomizedInput label={"No. of EX installed"} inputType="text" value={""} />
                    <div className={"row-span-3"}>
                        <CustomizedInput textAreaRows={9} label={"Remarks"} inputType="textarea" value={""} />
                    </div>
                    <CustomizedInput label={"No. of FA in Outlet"} inputType="text" value={""} />
                    <CustomizedInput label={"No. of FA installed"} inputType="text" value={""} />
                    <CustomizedInput label={"No. of AC in Outlet"} inputType="text" value={""} />
                    <CustomizedInput label={"No. of AC installed"} inputType="text" value={""} />
                </div>
            </div>
            <div className="edit-sub-container gap-y-6">
                <div className="flex justify-between">
                    <h2><b>Energy Baseline & Schedule</b></h2>
                </div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-6">
                    <CustomizedInput label={<React.Fragment><b>KE. Eqpt. </b><span>Energy Baseline</span></React.Fragment>} inputType="text" value={""} />
                    <CustomizedInput label={<React.Fragment><b>AC. Eqpt. </b><span>Energy Baseline</span></React.Fragment>} inputType="text" value={""} />
                    <CustomizedInput label={<React.Fragment><b>ACMV. Eqpt. </b><span>Energy Baseline</span></React.Fragment>} inputType="text" value={""} />
                </div>
                <div className="w-full overflow-auto max-h-summaryOutletSavingsHeights">
                    <SummaryTable headers={dummySavingEditHeaders} data={dummySavingEditData} />
                </div>
                <CustomizedInput textAreaRows={3} label={<React.Fragment><b>Remarks</b><span> on Opening Hours</span></React.Fragment>} inputType="textarea" value={""} />

            </div>
            <div className="flex flex-row gap-x-3 justify-between">
                <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Reset</button>
                <button type='button' className="bg-blue-500 text-white rounded-lg w-full text-sm h-11 text-center">Save</button>
            </div>
        </React.Fragment>
    )
}

export default SavingsInformation;