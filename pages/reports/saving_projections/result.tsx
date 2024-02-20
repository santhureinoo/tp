import { Image } from "antd";
import { NextPage } from "next";
import React from "react";
import SavingProjectionBox from "../../../components/report/SavingProjectionBox";
import { useRouter } from "next/router";
import { formatCurrency } from "../../../common/helper";

const section = (title: any, body: string, footer?: string, imagesrc?: any) => {
    return <div className="flex flex-col items-center">
        {imagesrc && <img className="float-right w-28 h-28 object-scale-down" src={imagesrc} />}
        <h2 className="text-stack-bar-inner text-custom-lg4">{title}</h2>
        <p className="text-tp-orange">{body}</p>
        <p className="text-tp-orange text-custom-sm">{footer}</p>
    </div>
}

const outletSavingsPerAnnum = (a: string, b: string) => <div className='flex justify-around'>
    {section('$' + formatCurrency(parseInt(a)), 'Cost Savings')}
    {section(<span>{formatCurrency(parseInt(b))}<sub className="text-sm">kWh</sub></span>, 'Energy Savings')}
</div>

const outletSavingsOverEquipmentLifetime = (a: string, b: string) => <div className='flex justify-around'>
    {section('$' + formatCurrency(parseInt(a)), 'Cost Savings')}
    {section(<span>{formatCurrency(parseInt(b))}<sub className="text-sm">kWh</sub></span>, 'Energy Savings')}
</div>

const groupSavingsOverEquipmentLifetime = (groupSavings: any) => <div className="flex flex-col gap-y-10">
    <div className='flex justify-around'>
        {section('$' + formatCurrency(parseInt(groupSavings.costSavings)), 'Cost Savings')}
        {section(<span>{formatCurrency(parseInt(groupSavings.energySavings))}<sub className="text-sm">kWh</sub></span>, 'Energy Savings')}
    </div>
    <div className='flex justify-around'>
        {section(formatCurrency(parseInt(groupSavings.mealsServed)), 'Meals Served', `Equivalent to operating ${groupSavings.noOfServiceDays} more days.`, '/asserts/reports/icon_open.png')}
        {section(<span>{formatCurrency(parseInt(groupSavings.kgOfCO2))}<sub className="text-sm">kWh</sub></span>, 'kg of CO2', `Equivalent to driving ${groupSavings.noOfCarsDrivenForAYear} cars for one year`, '/asserts/reports/icon_aeroplane.png')}
    </div>
    <div className='flex justify-around'>
        {section(<span>{formatCurrency(parseInt(groupSavings.treesPlanted))}<sub className="text-sm">kWh</sub></span>, 'Trees Planted', `Equivalent to ${groupSavings.noOfSoccerFields} soccer fields`, '/asserts/reports/icon_forest.png')}
    </div>
</div>

const Report: NextPage = () => {
    const router = useRouter();
    const { data } = router.query;
    if (data) {
        const reqData = JSON.parse(decodeURIComponent(data as string));
        console.log(reqData);
        return <React.Fragment>
            <div className="h-screen">
                <h2 className="text-custom-lg3 text-stack-bar-inner text-center my-8">Projection</h2>
                <SavingProjectionBox title={'Outlet Savings Per Annum'} body={outletSavingsPerAnnum(reqData.outletSavings.perAnnum.costSavings, reqData.outletSavings.perAnnum.energySavings)}></SavingProjectionBox>
                <SavingProjectionBox title={'Outlet Savings Over Equipment Lifetime'} body={outletSavingsOverEquipmentLifetime(reqData.outletSavings.overEquipmentLifetime.costSavings, reqData.outletSavings.overEquipmentLifetime.energySavings)}></SavingProjectionBox>
                <SavingProjectionBox title={'Group Savings Over Equipment Lifetime'} body={groupSavingsOverEquipmentLifetime(reqData.groupSavings)}></SavingProjectionBox>
                <span className="mx-10">Figures represented in this report are estimates and may differ from the actual savings generated.</span>
                <div className="flex flex-col mx-10 mt-4 mb-12 text-stack-bar-inner font-custom-sm1">
                    <span>{reqData.contact.sales_contact}</span>
                    <span>{reqData.contact.email}</span>
                </div>
            </div>
        </React.Fragment>
    } else {
        return <></>
    }

}

export default Report;