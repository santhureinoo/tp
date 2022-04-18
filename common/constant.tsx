import CustomizedInput from "../components/CustomizedInput";
import PillButton from "../components/PillButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

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
    SOS: (<div className="flex flex-row bg-slate-900 gap-x-6 items-center justify-between"><span>3%</span><PillButton className={"bg-green-300 w-24 h-8"} text={"Live"}/></div>)
}

export const DummyBillingDataRow = {
    IID: 'Set-2095860',
    CUS: 'KFC Holding Indonesia',
    PER: 'Sep, 2022',
    OUT: '5',
    TSF: '$485.09',
    TSS: '$250',
    TSK: (<div className="flex flex-row bg-slate-900 gap-x-6 items-center justify-between"><span>470</span><PillButton className={"bg-green-300 w-40 h-8"} text={"Invoice Extracted"}/></div>)
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

export const dummySummaryTableData = [
    {
        "ID": "Outlet-295BO",
        "Name": "Tang City MCD",
        "Equipment": "10",
        "ChkBox":  <FontAwesomeIcon style={{ fontSize: '2em', color:'#E8F2FF' }} icon={faCircle} />
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
        "ChkBox":  <FontAwesomeIcon style={{ fontSize: '2em', color:'#E8F2FF' }} icon={faCircle} />
    },
    {
        "ID": "Outlet-295BO",
        "Name": "Tang City MCD",
        "Equipment": "10",
        "ChkBox":  <FontAwesomeIcon style={{ fontSize: '2em', color:'#E8F2FF' }} icon={faCircle} />
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
        "ServiceFee":'$29.59',
    },
    {
        "OutletName": "KFC Jakarta 1",
        "LAT": "$0.249",
        "EEB": "9.09kw",
        "EUsage": '3000kWh/2670kWh',
        "Savings": "$40/250kWh",
        "ServiceFee":'$29.59',
    },
    {
        "OutletName": "KFC Jakarta 1",
        "LAT": "$0.249",
        "EEB": "9.09kw",
        "EUsage": '3000kWh/2670kWh',
        "Savings": "$40/250kWh",
        "ServiceFee":'$29.59',
    },
]