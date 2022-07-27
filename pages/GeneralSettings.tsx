import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import CustomerEdit from '../components/CustomerEdit'
import { DummyCustomerDataRow } from '../common/constant'
import CustomizedInput from '../components/CustomizedInput';

const GeneralSettings: NextPage = () => {
    const [openCustomerEdit, setOpenCustomerEdit] = React.useState(false);

    function getDummyCustomerData(): any[] {
        const dummyArr = [];
        for (var i = 0; i < 17; i++) {
            dummyArr.push(DummyCustomerDataRow);
        }
        return dummyArr;
    }

    return (
        <React.Fragment>
            <div className="flex flex-col gap-y-2">
                <div className="drop-shadow-lg rounded-lg p-4 bg-white">
                    <CustomizedInput label={"Outlet ID"} inputType="text" value={""} />
                </div>
                <div className="drop-shadow-lg rounded-lg p-4 bg-white">
                    <div className="edit-sub-container">
                        <div className="flex justify-between">
                            <h2><b>Kitchen</b><br /> Exhaust</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <CustomizedInput label={"KE Factor 1.1"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 1.2"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 1.f"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 2.1"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 2.2"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 2.f"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 3.1"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 3.2"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 3.f"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 4.1"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 4.2"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 4.f"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 5.1"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 5.2"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 5.f"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 6.1"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 6.2"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 6.f"} inputType="text" value={""} />
                            <CustomizedInput label={"KE Factor 7.f"} inputType="text" value={""} />
                        </div>
                    </div>
                </div>
                <div className="drop-shadow-lg rounded-lg p-4 bg-white grid grid-cols-3 gap-2">
                    <div className="flex justify-between">
                        <h2><b>Air</b><br />Conditioning</h2>
                    </div>
                    <CustomizedInput label={"AC Factor P"} inputType="text" value={""} />
                    <CustomizedInput label={"AC Factor M"} inputType="text" value={""} />
                </div>
            </div>
        </React.Fragment >
    )
}

GeneralSettings.getInitialProps = async () => {
    const title = 'General Settings';
    return { title };
};


export default GeneralSettings
