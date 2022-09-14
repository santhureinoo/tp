import CustomizedInput from "../components/CustomizedInput";
import PillButton from "../components/PillButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import TwoTitlesHeader from "../components/TwoTitlesHeader";
import { outlet_month_shifts } from "../types/datatype";

export const DummyCustomerDataRow = {
    CID: 'Cust-105864',
    NAM: 'KFC Indonesia',
    PIC: 'Andrew Shovlin',
    PIP: '+62878859036',
    OUT: '3',
    EQU: '5',
}

export const DummyEquipmentDataRow = {
    EID: 'EQ-2405',
    CUS: 'KFC Indonesia',
    OUT: 'KFC Gunung Sahari',
    ETY: 'Exhaust 1',
    ENA: 'Exhaust 1',
    VAO: '20/10/2021 18:56',
}

export const DummyOutletDataRow = {
    OID: 'Out-29405',
    CUS: 'KFC indonesia',
    ONE: 'KFC Jakata Pusat',
    TRE: '$12.05',
    DOT: '20/11/2021',
    SOS: (<div className="flex flex-row gap-x-6 items-center justify-between"><span>3%</span><PillButton className={"bg-green-300 w-24 h-8"} text={"Live"} /></div>)
}

export const DummyBillingDataRow = {
    IID: 'Set-2095860',
    CUS: 'KFC Holding Indonesia',
    PER: 'Sep, 2022',
    OUT: '5',
    TSF: '$485.09',
    TSS: '$250',
    TSK: (<div className="flex flex-row gap-x-6 items-center justify-between"><span>470</span><PillButton className={"bg-green-300 text-green-500 w-40 h-8"} text={"Invoice Extracted"} /></div>),
    STA: 'Extracted',
}

export const dummyContactList = [
    {
        ContactPerson: 'Andrew Showlin',
        Position: 'Finance Manager',
        EmailAddress: 'andrew@gmail.com',
        PhoneNumber: '+628788719580',
    },
    {
        ContactPerson: 'Andrew Showlin',
        Position: 'Finance Manager',
        EmailAddress: 'andrew@gmail.com',
        PhoneNumber: '+628788719580',
    },
    {
        ContactPerson: 'Andrew Showlin',
        Position: 'Finance Manager',
        EmailAddress: 'andrew@gmail.com',
        PhoneNumber: '+628788719580',
    }
];

export const dummySavingEditHeaders = [
    <b>Day</b>,
    <TwoTitlesHeader mainTitle="1a" subTitle="(Time 24:00, NA)" />,
    <TwoTitlesHeader mainTitle="1b" subTitle="(Time 24:00, NA)" />,
    <TwoTitlesHeader mainTitle="2a" subTitle="(Time 24:00, NA)" />,
    <TwoTitlesHeader mainTitle="1b" subTitle="(Time 24:00, NA)" />
]

export const dummySavingEditData = [
    {
        "Day": "Mon.",
        "1a": <CustomizedInput inputType="text" value={""} />,
        "1b": <CustomizedInput inputType="text" value={""} />,
        "2a": <CustomizedInput inputType="text" value={""} />,
        "2b": <CustomizedInput inputType="text" value={""} />,
    },
    {
        "Day": "Tue.",
        "1a": <CustomizedInput inputType="text" value={""} />,
        "1b": <CustomizedInput inputType="text" value={""} />,
        "2a": <CustomizedInput inputType="text" value={""} />,
        "2b": <CustomizedInput inputType="text" value={""} />,
    },
    {
        "Day": "Wed.",
        "1a": <CustomizedInput inputType="text" value={""} />,
        "1b": <CustomizedInput inputType="text" value={""} />,
        "2a": <CustomizedInput inputType="text" value={""} />,
        "2b": <CustomizedInput inputType="text" value={""} />,
    },
    {
        "Day": "Thu.",
        "1a": <CustomizedInput inputType="text" value={""} />,
        "1b": <CustomizedInput inputType="text" value={""} />,
        "2a": <CustomizedInput inputType="text" value={""} />,
        "2b": <CustomizedInput inputType="text" value={""} />,
    },
    {
        "Day": "Fri.",
        "1a": <CustomizedInput inputType="text" value={""} />,
        "1b": <CustomizedInput inputType="text" value={""} />,
        "2a": <CustomizedInput inputType="text" value={""} />,
        "2b": <CustomizedInput inputType="text" value={""} />,
    },
    {
        "Day": "Sat.",
        "1a": <CustomizedInput inputType="text" value={""} />,
        "1b": <CustomizedInput inputType="text" value={""} />,
        "2a": <CustomizedInput inputType="text" value={""} />,
        "2b": <CustomizedInput inputType="text" value={""} />,
    },
    {
        "Day": "Sun.",
        "1a": <CustomizedInput inputType="text" value={""} />,
        "1b": <CustomizedInput inputType="text" value={""} />,
        "2a": <CustomizedInput inputType="text" value={""} />,
        "2b": <CustomizedInput inputType="text" value={""} />,
    },
    {
        "Day": "Holiday.",
        "1a": <CustomizedInput inputType="text" value={""} />,
        "1b": <CustomizedInput inputType="text" value={""} />,
        "2a": <CustomizedInput inputType="text" value={""} />,
        "2b": <CustomizedInput inputType="text" value={""} />,
    },
]


export const defaultOutletMonthShifts: outlet_month_shifts[] = [
    {
        day_of_week: 'monday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 1,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
    {
        day_of_week: 'monday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 2,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
    {
        day_of_week: 'tuesday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 1,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
    {
        day_of_week: 'tuesday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 2,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
    {
        day_of_week: 'wednesday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 1,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
    {
        day_of_week: 'wednesday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 2,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
    {
        day_of_week: 'thursday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 1,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
    {
        day_of_week: 'thursday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 2,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
    {
        day_of_week: 'friday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 1,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },  {
        day_of_week: 'friday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 2,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
    {
        day_of_week: 'holiday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 1,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
    {
        day_of_week: 'holiday',
        outlet_date: '',
        outlet_id: -1,
        shift_num: 2,
        startTime: '',
        endTime: '',
        remarks_on_op_hours: '',
    },
]


export const dummySummaryTableData = [
    {
        "ID": "Outlet-295BO",
        "Name": "Tang City MCD",
        "Equipment": "10",
        "ChkBox": <FontAwesomeIcon style={{ fontSize: '2em', color: '#E8F2FF' }} icon={faCircle} />
    },
    {
        "ID": "Outlet-295BO",
        "Name": "Tang City MCD",
        "Equipment": "10",
        "ChkBox": <FontAwesomeIcon style={{ fontSize: '2em', color: 'Dodgerblue' }} icon={faCircleCheck} />
    },
    {
        "ID": "Outlet-295BO",
        "Name": "Tang City MCD",
        "Equipment": "10",
        "ChkBox": <FontAwesomeIcon style={{ fontSize: '2em', color: 'Dodgerblue' }} icon={faCircleCheck} />
    },
    {
        "ID": "Outlet-295BO",
        "Name": "Tang City MCD",
        "Equipment": "10",
        "ChkBox": <FontAwesomeIcon style={{ fontSize: '2em', color: '#E8F2FF' }} icon={faCircle} />
    },
    {
        "ID": "Outlet-295BO",
        "Name": "Tang City MCD",
        "Equipment": "10",
        "ChkBox": <FontAwesomeIcon style={{ fontSize: '2em', color: '#E8F2FF' }} icon={faCircle} />
    },
]


export const dummySummaryEquipmentTableData = [
    {
        "ID": "Outlet-295BO",
        "Type": "VFD 1",
        "Name": "Tang City MCD",
        "Status": "Active",
        "ChkBox": <FontAwesomeIcon style={{ fontSize: '2em', color: 'Tomato' }} icon={faXmarkCircle} />
    },
    {
        "ID": "Outlet-295BO",
        "Type": "VFD 1",
        "Name": "Tang City MCD",
        "Status": "Active",
        "ChkBox": <FontAwesomeIcon style={{ fontSize: '2em', color: 'Dodgerblue' }} icon={faCircleCheck} />
    },
]


export const dummySummaryOutletTableData = [
    {
        "EquipmentID": "Outlet-295BO",
        "Type": "Tang City MCD",
        "Name": "10",
        "CaltrType": <CustomizedInput hideDropDownPrefixIcon={true} inputType="select" value="FastFood" dropDownData={["FastFood", "Test", "Test"]} />
    },
    {
        "EquipmentID": "Outlet-295BO",
        "Type": "Tang City MCD",
        "Name": "10",
        "CaltrType": <CustomizedInput hideDropDownPrefixIcon={true} inputType="select" value="FastFood" dropDownData={["FastFood", "Test", "Test"]} />
    },
    {
        "EquipmentID": "Outlet-295BO",
        "Type": "Tang City MCD",
        "Name": "10",
        "CaltrType": <CustomizedInput hideDropDownPrefixIcon={true} inputType="select" value="FastFood" dropDownData={["FastFood", "Test", "Test"]} />
    },
    {
        "EquipmentID": "Outlet-295BO",
        "Type": "Tang City MCD",
        "Name": "10",
        "CaltrType": <CustomizedInput hideDropDownPrefixIcon={true} inputType="select" value="FastFood" dropDownData={["FastFood", "Test", "Test"]} />
    },
    {
        "EquipmentID": "Outlet-295BO",
        "Type": "Tang City MCD",
        "Name": "10",
        "CaltrType": <CustomizedInput hideDropDownPrefixIcon={true} inputType="select" value="FastFood" dropDownData={["FastFood", "Test", "Test"]} />
    },
]

export const dummySummaryBillingTableData = [
    {
        "OutletName": "KFC Jakarta 1",
        "LAT": "$0.249",
        "EEB": "9.09kw",
        "EUsage": '3000kWh/2670kWh',
        "Savings": "$40/250kWh",
        "ServiceFee": '$29.59',
    },
    {
        "OutletName": "KFC Jakarta 1",
        "LAT": "$0.249",
        "EEB": "9.09kw",
        "EUsage": '3000kWh/2670kWh',
        "Savings": "$40/250kWh",
        "ServiceFee": '$29.59',
    },
    {
        "OutletName": "KFC Jakarta 1",
        "LAT": "$0.249",
        "EEB": "9.09kw",
        "EUsage": '3000kWh/2670kWh',
        "Savings": "$40/250kWh",
        "ServiceFee": '$29.59',
    },
    {
        "OutletName": "KFC Jakarta 1",
        "LAT": "$0.249",
        "EEB": "9.09kw",
        "EUsage": '3000kWh/2670kWh',
        "Savings": "$40/250kWh",
        "ServiceFee": '$29.59',
    },
    {
        "OutletName": "KFC Jakarta 1",
        "LAT": "$0.249",
        "EEB": "9.09kw",
        "EUsage": '3000kWh/2670kWh',
        "Savings": "$40/250kWh",
        "ServiceFee": '$29.59',
    },
    {
        "OutletName": "KFC Jakarta 1",
        "LAT": "$0.249",
        "EEB": "9.09kw",
        "EUsage": '3000kWh/2670kWh',
        "Savings": "$40/250kWh",
        "ServiceFee": '$29.59',
    },
    {
        "OutletName": "KFC Jakarta 1",
        "LAT": "$0.249",
        "EEB": "9.09kw",
        "EUsage": '3000kWh/2670kWh',
        "Savings": "$40/250kWh",
        "ServiceFee": '$29.59',
    },

]