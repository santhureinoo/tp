import CustomizedInput from "../CustomizedInput"
import React from 'react';
import { dummyContactList, dummySavingEditData, dummySavingEditHeaders, dummySummaryOutletTableData, dummySummaryTableData } from "../../common/constant";
import SummaryTable from "../SummaryTable";
import { outlet, outlet_month, outlet_month_shifts } from "../../types/datatype";
import { gql, useQuery } from "@apollo/client";
import rfdc from 'rfdc';
const cloneDeep = rfdc();

interface Props {
    outlet: outlet;
    setOutlet: (outlet: outlet) => void;
}


const SavingsInformation = ({ outlet, setOutlet, }: Props) => {

    // const getOutletMonthQuery = gql`
    // query Outlet_month($where: Outlet_monthWhereUniqueInput!) {
    //     outlet_month(where: $where) {
    //       outlet_outlet_id
    //       percent_share_of_savings
    //       last_avail_tariff
    //       tariff_month
    //       no_of_ex_in_outlet
    //       no_of_fa_in_outlet
    //       no_of_ac_in_outlet
    //       no_of_ex_installed
    //       no_of_fa_installed
    //       no_of_ac_installed
    //       remarks_on_eqpt_in_outlet_or_installed
    //       remarks_on_overall_outlet
    //       outlet_date
    //     }
    //   }
    // `;

    // const getOutletMonthVariable = {
    //     'variables': {
    //         "where": {
    //             "outlet_outlet_id_outlet_date": {
    //                 "outlet_outlet_id": outlet.outlet_id,
    //                 "outlet_date": "0",
    //             }
    //         }
    //     }
    // }

    // const outletMonthResult = useQuery(getOutletMonthQuery, getOutletMonthVariable);

    // React.useEffect(() => {
    //     if (outletMonthResult.data && outletMonthResult.data.outlet_month) {
    //         setOutletMonth(outletMonthResult.data.outlet_month);
    //     }
    // }, [outletMonthResult.data]);

    const onShiftChange = (value: string, day_of_week: string, shift_num: number, attributeName: string) => {
        const cloned_outlet = cloneDeep(outlet);
        if (cloned_outlet.outlet_month_shifts) {
            const selectedShift = cloned_outlet.outlet_month_shifts.find(sh => sh.day_of_week === day_of_week && sh.shift_num === shift_num);
            if (selectedShift) {
                selectedShift[attributeName] = value;
            }
        }
        setOutlet(cloned_outlet);
    }

    const onRemarkOPHoursChange = (value: any) => {
        const cloned_outlet = cloneDeep(outlet);
        if (cloned_outlet.outlet_month_shifts) {
            cloned_outlet.outlet_month_shifts.forEach(shift => {
                shift.remarks_on_op_hours = value;
            })
            setOutlet(cloned_outlet);
        }
    }

    const onChange = (value: any, attributeName: string) => {
        const clonedOutlet: outlet = cloneDeep(outlet);
        if (clonedOutlet.outlet_month && clonedOutlet.outlet_month.length > 0) {
            clonedOutlet.outlet_month[0][attributeName] = value;
            setOutlet(clonedOutlet);
        }

    }

    const onLiveDateChange = (value: any, attributeName: string) => {
        const clonedOutlet: outlet = cloneDeep(outlet);
        if (clonedOutlet.outlet_device_live_date && clonedOutlet.outlet_device_live_date.length > 0) {
            clonedOutlet.outlet_device_live_date[0][attributeName] = value;
            setOutlet(clonedOutlet);
        }

    }


    return (
        <React.Fragment>
            <div className="edit-sub-container">
                <div className="grid grid-cols-2 gap-x-6 gap-y-6 pb-6">
                    <CustomizedInput label={"% of Share of Savings"} inputType="text" onChange={(value: string) => onChange(value, 'percent_share_of_savings')} value={outlet.outlet_month && outlet.outlet_month[0].percent_share_of_savings || ""} />
                    <CustomizedInput label={"Tariff Month"} inputType="text" onChange={(value: string) => onChange(value, 'tariff_month')} value={outlet.outlet_month && outlet.outlet_month[0].tariff_month || ""} />
                    <CustomizedInput label={"Last Available Tariff"} inputType="text" onChange={(value: string) => onChange(value, 'last_avail_tariff')} value={outlet.outlet_month && outlet.outlet_month[0].last_avail_tariff || ""} />
                </div>
            </div>
            <div className="edit-sub-container">
                <div className="flex justify-between">
                    <h2><b>KE & AC Live Date</b></h2>
                </div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-6">
                    <CustomizedInput label={"Ke. live date"} inputType="text" onChange={(value: string) => onLiveDateChange(value, 'ke_live_date')} value={outlet.outlet_device_live_date && outlet.outlet_device_live_date[0].ke_live_date ? outlet.outlet_device_live_date && outlet.outlet_device_live_date[0].ke_live_date.toString() : ""} />
                    <CustomizedInput label={"Ac. live date"} inputType="text" onChange={(value: string) => onLiveDateChange(value, 'ac_live_date')} value={outlet.outlet_device_live_date && outlet.outlet_device_live_date[0].ac_live_date ? outlet.outlet_device_live_date && outlet.outlet_device_live_date[0].ac_live_date.toString() : ""} />
                </div>
            </div>
            <div className="edit-sub-container">
                <div className="flex justify-between">
                    <h2><b>Equipment</b></h2>
                </div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-6">
                    <CustomizedInput label={"No. of EX in Outlet"} inputType="number" onChange={(value: string) => onChange(parseInt(value), 'no_of_ex_in_outlet')} value={outlet.outlet_month && outlet.outlet_month[0].no_of_ex_in_outlet ? outlet.outlet_month && outlet.outlet_month[0].no_of_ex_in_outlet.toString() : ""} />
                    <CustomizedInput label={"No. of EX installed"} inputType="number" onChange={(value: string) => onChange(parseInt(value), 'no_of_ex_installed')} value={outlet.outlet_month && outlet.outlet_month[0].no_of_ex_installed ? outlet.outlet_month && outlet.outlet_month[0].no_of_ex_installed.toString() : ""} />
                    <div className={"row-span-3"}>
                        <CustomizedInput textAreaRows={9} label={"Remarks"} inputType="textarea" onChange={(value: string) => onChange(value, 'remarks_on_eqpt_in_outlet_or_installed')} value={outlet.outlet_month && outlet.outlet_month[0].remarks_on_eqpt_in_outlet_or_installed ? outlet.outlet_month && outlet.outlet_month[0].remarks_on_eqpt_in_outlet_or_installed : ""} />
                    </div>
                    <CustomizedInput label={"No. of FA in Outlet"} inputType="number" onChange={(value: string) => onChange(parseInt(value), 'no_of_fa_in_outlet')} value={outlet.outlet_month && outlet.outlet_month[0].no_of_fa_in_outlet ? outlet.outlet_month && outlet.outlet_month[0].no_of_fa_in_outlet.toString() : ""} />
                    <CustomizedInput label={"No. of FA installed"} inputType="number" onChange={(value: string) => onChange(parseInt(value), 'no_of_fa_installed')} value={outlet.outlet_month && outlet.outlet_month[0].no_of_fa_installed ? outlet.outlet_month && outlet.outlet_month[0].no_of_fa_installed.toString() : ""} />
                    <CustomizedInput label={"No. of AC in Outlet"} inputType="number" onChange={(value: string) => onChange(parseInt(value), 'no_of_ac_in_outlet')} value={outlet.outlet_month && outlet.outlet_month[0].no_of_ac_in_outlet ? outlet.outlet_month && outlet.outlet_month[0].no_of_ac_in_outlet.toString() : ""} />
                    <CustomizedInput label={"No. of AC installed"} inputType="number" onChange={(value: string) => onChange(parseInt(value), 'no_of_ac_installed')} value={outlet.outlet_month && outlet.outlet_month[0].no_of_ac_installed ? outlet.outlet_month && outlet.outlet_month[0].no_of_ac_installed.toString() : ""} />
                </div>
            </div>
            <div className="edit-sub-container gap-y-6">
                <div className="flex justify-between">
                    <h2><b>Energy Baseline & Schedule</b></h2>
                </div>
                {/* <div className="grid grid-cols-3 gap-x-6 gap-y-6">
                    <CustomizedInput label={<React.Fragment><b>KE. Eqpt. </b><span>Energy Baseline</span></React.Fragment>} inputType="text" value={""} />
                    <CustomizedInput label={<React.Fragment><b>AC. Eqpt. </b><span>Energy Baseline</span></React.Fragment>} inputType="text" value={""} />
                    <CustomizedInput label={<React.Fragment><b>ACMV. Eqpt. </b><span>Energy Baseline</span></React.Fragment>} inputType="text" value={""} />
                </div> */}
                <div className="w-full overflow-auto max-h-summaryOutletSavingsHeights">
                    <SummaryTable headers={dummySavingEditHeaders} data={[
                        {
                            "Day": "Mon.",
                            "1a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'monday', 1, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'monday' && sf.shift_num === 1)?.startTime || ""} />,
                            "1b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'monday', 1, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'monday' && sf.shift_num === 1)?.endTime || ""} />,
                            "2a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'monday', 2, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'monday' && sf.shift_num === 2)?.startTime || ""} />,
                            "2b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'monday', 2, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'monday' && sf.shift_num === 2)?.endTime || ""} />,
                        },
                        {
                            "Day": "Tue.",
                            "1a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'tuesday', 1, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'tuesday' && sf.shift_num === 1)?.startTime || ""} />,
                            "1b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'tuesday', 1, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'tuesday' && sf.shift_num === 1)?.endTime || ""} />,
                            "2a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'tuesday', 2, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'tuesday' && sf.shift_num === 2)?.startTime || ""} />,
                            "2b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'tuesday', 2, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'tuesday' && sf.shift_num === 2)?.endTime || ""} />,
                        },
                        {
                            "Day": "Wed.",
                            "1a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'wednesday', 1, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'wednesday' && sf.shift_num === 1)?.startTime || ""} />,
                            "1b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'wednesday', 1, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'wednesday' && sf.shift_num === 1)?.endTime || ""} />,
                            "2a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'wednesday', 2, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'wednesday' && sf.shift_num === 2)?.startTime || ""} />,
                            "2b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'wednesday', 2, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'wednesday' && sf.shift_num === 2)?.endTime || ""} />,
                        },
                        {
                            "Day": "Thu.",
                            "1a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'thursday', 1, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'thursday' && sf.shift_num === 1)?.startTime || ""} />,
                            "1b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'thursday', 1, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'thursday' && sf.shift_num === 1)?.endTime || ""} />,
                            "2a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'thursday', 2, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'thursday' && sf.shift_num === 2)?.startTime || ""} />,
                            "2b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'thursday', 2, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'thursday' && sf.shift_num === 2)?.endTime || ""} />,
                        },
                        {
                            "Day": "Fri.",
                            "1a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'friday', 1, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'friday' && sf.shift_num === 1)?.startTime || ""} />,
                            "1b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'friday', 1, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'friday' && sf.shift_num === 1)?.endTime || ""} />,
                            "2a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'friday', 2, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'friday' && sf.shift_num === 2)?.startTime || ""} />,
                            "2b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'friday', 2, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'friday' && sf.shift_num === 2)?.endTime || ""} />,
                        },
                        {
                            "Day": "Sat.",
                            "1a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'saturday', 1, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'saturday' && sf.shift_num === 1)?.startTime || ""} />,
                            "1b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'saturday', 1, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'saturday' && sf.shift_num === 1)?.endTime || ""} />,
                            "2a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'saturday', 2, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'saturday' && sf.shift_num === 2)?.startTime || ""} />,
                            "2b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'saturday', 2, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'saturday' && sf.shift_num === 2)?.endTime || ""} />,
                        },
                        {
                            "Day": "Sun.",
                            "1a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'sunday', 1, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'sunday' && sf.shift_num === 1)?.startTime || ""} />,
                            "1b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'sunday', 1, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'sunday' && sf.shift_num === 1)?.endTime || ""} />,
                            "2a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'sunday', 2, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'sunday' && sf.shift_num === 2)?.startTime || ""} />,
                            "2b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'sunday', 2, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'sunday' && sf.shift_num === 2)?.endTime || ""} />,
                        },
                        {
                            "Day": "Holiday.",
                            "1a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'holiday', 1, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'holiday' && sf.shift_num === 1)?.startTime || ""} />,
                            "1b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'holiday', 1, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'holiday' && sf.shift_num === 1)?.endTime || ""} />,
                            "2a": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'holiday', 2, 'startTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'holiday' && sf.shift_num === 2)?.startTime || ""} />,
                            "2b": <CustomizedInput inputType="text" onChange={(value) => { onShiftChange(value, 'holiday', 2, 'endTime') }} value={outlet.outlet_month_shifts?.find(sf => sf.day_of_week === 'holiday' && sf.shift_num === 2)?.endTime || ""} />,
                        },
                    ]} />
                </div>
                <CustomizedInput textAreaRows={3} label={<React.Fragment><b>Remarks</b><span> on Opening Hours</span></React.Fragment>} inputType="textarea" value={outlet.outlet_month_shifts && outlet.outlet_month_shifts.length ? outlet.outlet_month_shifts[0].remarks_on_op_hours : ""} onChange={val => onRemarkOPHoursChange(val)} />

            </div>
        </React.Fragment>
    )
}

export default SavingsInformation;