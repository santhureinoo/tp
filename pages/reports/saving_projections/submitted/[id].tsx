import { Image } from "antd";
import { NextPage } from "next";
import React from "react";
import SavingProjectionBox from "../../../../components/report/SavingProjectionBox";

const section = (title: string, body: string) => {
    return <div>
        <h2 className="text-tp-blue">{title}</h2>
        <p>{body}</p>
    </div>
}

const outletInformation = <div className='flex gap-x-12'>
    <div className="flex flex-col">
        {section('Country', 'Singapore')}
        {section('Postal Code', '7777777')}
    </div>
    {section('Street address', 'Lorem Street, Lorem Street, Lorem Street Lorem Street, Lorem Street, Lorem Street Lorem Street, Lorem Street, Lorem Street')}
</div>

const operationInformation = <div className="flex flex-col">
    <div className="flex gap-x-12">
        {section('Type of Restaurant/Dining','Food Court / Coffeeshop')}
    </div>
    <div className="flex gap-x-12"></div>
    <div className="flex gap-x-12"></div>
    <div className="flex gap-x-12"></div>
</div>

const Report: NextPage = () => {
    return <React.Fragment>
        <div className="h-screen">
            <h2 className="text-custom-lg3 text-stack-bar-inner text-center">Details Received</h2>
            <SavingProjectionBox title={'Outlet Information'} body={outletInformation}></SavingProjectionBox>
            <SavingProjectionBox title={'Operation Information'} body={operationInformation}></SavingProjectionBox>
        </div>

    </React.Fragment>
}

export default Report;