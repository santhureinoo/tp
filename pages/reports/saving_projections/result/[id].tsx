import { Image } from "antd";
import { NextPage } from "next";
import React from "react";
import SavingProjectionBox from "../../../../components/report/SavingProjectionBox";

const section = (title: any, body: string) => {
    return <div>
        <h2 className="text-stack-bar-inner text-custom-lg4">{title}</h2>
        <p className="text-tp-orange">{body}</p>
    </div>
}

const outletSavingsPerAnnum = <div className='flex justify-around'>
    {section('$120,000', 'Cost Savings')}
    {section(<span>{'9999,999'}<sub className="text-sm">kWh</sub></span>, 'Energy Savings')}
</div>

const outletSavingsOverEquipmentLifetime = <div className='flex justify-around'>
    {section('$120,000', 'Cost Savings')}
    {section(<span>{'9999,999'}<sub className="text-sm">kWh</sub></span>, 'Energy Savings')}
</div>

const groupSavingsOverEquipmentLifetime = <div className="flex flex-col gap-y-10">
    <div className='flex justify-around'>
        {section('$120,000', 'Cost Savings')}
        {section(<span>{'9999,999'}<sub className="text-sm">kWh</sub></span>, 'Energy Savings')}
    </div>
    <div className='flex justify-around'>
        {section('$120,000', 'Cost Savings')}
        {section(<span>{'9999,999'}<sub className="text-sm">kWh</sub></span>, 'Energy Savings')}
    </div>
    <div className='flex justify-around'>
        {section(<span>{'9999,999'}<sub className="text-sm">kWh</sub></span>, 'Energy Savings')}
    </div>
</div>

const Report: NextPage = () => {
    return <React.Fragment>
        <div className="h-screen">
            <h2 className="text-custom-lg3 text-stack-bar-inner text-center">Projection</h2>
            <SavingProjectionBox title={'Outlet Savings Per Annum'} body={outletSavingsPerAnnum}></SavingProjectionBox>
            <SavingProjectionBox title={'Outlet Savings Over Equipment Lifetime'} body={outletSavingsOverEquipmentLifetime}></SavingProjectionBox>
            <SavingProjectionBox title={'Group Savings Over Equipment Lifetime'} body={groupSavingsOverEquipmentLifetime}></SavingProjectionBox>
        </div>

    </React.Fragment>
}

export default Report;