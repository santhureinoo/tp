import CustomizedInput from "../CustomizedInput"
import React from 'react';
import ContactList from "../ContactList";
import { outlet, outlet_person_in_charge } from "../../types/datatype";
import rfdc from 'rfdc';
import { gql, useQuery } from "@apollo/client";
const cloneDeep = rfdc();

interface Props {
    outlet: outlet;
    setOutlet: (outlet: outlet) => void;
    customers: any[];
}

const OutletInformation = ({ outlet, setOutlet, customers }: Props) => {
    const onChange = (value: any, attributeName: string) => {
        const cloned_outlet: outlet = cloneDeep(outlet);
        cloned_outlet[attributeName] = value;
        setOutlet(cloned_outlet);
    }

    const onPicChange = (selectedPIC: outlet_person_in_charge[]) => {
        const cloned_outlet: outlet = cloneDeep(outlet);
        cloned_outlet.outlet_person_in_charges = selectedPIC;
        setOutlet(cloned_outlet);
    }

    const customerElem = React.useMemo(() => {
       return <CustomizedInput label={"Business"} inputType="select" value={outlet.customer_id.toString()} dropDownData={customers} onChange={(value: string) => onChange(parseInt(value), 'customer_id')} />
    },[outlet, customers])

    return (
        <React.Fragment>
            <div className="edit-sub-container">
                <div className="grid grid-cols-2 gap-x-4 pb-6">
                    {customerElem}
                    <CustomizedInput label={"Status"} hideDropDownPrefixIcon={true} inputType="select" value={outlet.outlet_status} onChange={(value: string) => onChange(value, 'outlet_status')} dropDownData={['Live', 'Not Live']} />
                    <CustomizedInput label={"Type"} hideDropDownPrefixIcon={true} inputType="select" value={outlet.outlet_type} onChange={(value: string) => onChange(value, 'outlet_type')} dropDownData={['Restaurant', 'Station']} />
                </div>
            </div>
            <div className="edit-sub-container">
                <div className="flex justify-between">
                    <h2><b>General</b></h2>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                    <CustomizedInput label={"Outlet ID"} inputType="text" value={outlet.outlet_id !== -1 ? outlet.outlet_id.toString() : " "} />
                    <CustomizedInput label={"Outlet Name"} inputType="text" value={outlet.name} onChange={val => onChange(val, 'name')} />
                    <div className={"col-span-2"}>
                        <CustomizedInput label={"Outlet Address"} inputType="textarea" value={outlet.outlet_address} onChange={val => onChange(val, 'outlet_address')} />
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
                <ContactList contactType="Outlet" contactList={outlet.outlet_person_in_charges || []} setContactList={onPicChange} />
            </div>
            {/* <div className="flex flex-row gap-x-3 justify-between">
                <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Reset</button>
                <button type='button' className="bg-blue-500 text-white rounded-lg w-full text-sm h-11 text-center">Save</button>
            </div> */}
        </React.Fragment>
    )
}

export default OutletInformation;