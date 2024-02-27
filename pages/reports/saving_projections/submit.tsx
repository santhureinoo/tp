import { Image } from "antd";
import { NextPage } from "next";
import React from "react";
import SavingProjectionBox from "../../../components/report/SavingProjectionBox";
import { useRouter } from "next/router";

const section = (title: string, body: string) => {
    return <div>
        <h2 className="text-tp-blue">{title}</h2>
        <p>{body}</p>
    </div>
}

const outletInformation = (a: any, b: any, c: any) => <div className='flex gap-x-12'>
    <div className="flex flex-col">
        {section('Country', a)}
        {section('Postal Code', b)}
    </div>
    {section('Street address', c)}
</div>

const operationInformation = (data: any) => <div className="flex flex-col">
    <div className="flex gap-x-24 justify-start">
        {section('Type of Restaurant/Dining', data.outlet.restaurant_type)}
        {section('Operating hours per week', data.outlet.operating_hours)}
        {section('Energy Tariff', "$" + data.outlet.tariff)}
        {section('Total Outlets', data.outlet.total_outlets)}
    </div>
    <hr className="h-px my-8 bg-tp-blue border-0 mx-36" />
    <div className="flex gap-x-24 justify-start">
        {section('Number of Kitchen Exhausts', data.outlet.exhaust_number)}
        {section('Kitchen Exhaust Capacity', data.outlet.exhaust_width)}
    </div>
    <hr className="h-px my-8 bg-tp-blue border-0 mx-36" />
    <div className="flex gap-x-24 justify-start">
        {section('Number of Air-cons', data.outlet.ac_number)}
        {section('Type of Air-con', data.outlet.ac_type)}
        {section('Controller Type', data.outlet.ac_controller)}
    </div>
    <hr className="h-px my-8 bg-tp-blue border-0 mx-36" />
    <div className="flex gap-x-24 justify-start">
        {section('Number of Fridges', data.outlet.fridge_number)}
        {section('Type of Fridge', data.outlet.fridge_type)}
    </div>
</div>

const Submit: NextPage = () => {
    const router = useRouter();
    const { data } = router.query;
    if (data) {
        const reqData = JSON.parse(decodeURIComponent(data as string));
        console.log(reqData);

        return <React.Fragment>
            <div className="h-screen">
                <h2 className="text-custom-lg4 text-stack-bar-inner text-center my-8">Details Received</h2>
                <SavingProjectionBox title={'Outlet Information'} body={outletInformation(reqData.outlet.country, reqData.outlet.postal_code, reqData.outlet.street_address)}></SavingProjectionBox>
                <SavingProjectionBox title={'Operation Information'} body={operationInformation(reqData)}></SavingProjectionBox>
            </div>
        </React.Fragment>
    }
    else {
        return <></>
    }
}

export default Submit;