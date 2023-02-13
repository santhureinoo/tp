import CustomizedInput from "./CustomizedInput"
import React from 'react';
import ContactList from "./ContactList";
import { dummyContactList, dummySummaryEquipmentTableData } from "../common/constant";
import SummaryTable from "./SummaryTable";
import FileUpload from "./FileUpload";
import Searchfield from "./Searchfield";
import CustomizedDropDown from "./CustomizedDropDown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { outlet_device_ac_input, outlet_device_ac_inputFields, outlet_device_ex_fa_ac_input, outlet_device_ex_fa_input } from "../types/datatype";
import { gql, useLazyQuery, useMutation, useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import rfdc from 'rfdc';
import { DropdownProps } from "../common/types";
import moment from "moment";
const cloneDeep = rfdc();


interface Props {
    openEquipmentEdit: boolean;
    setOpenEquipmentEdit(openEquipmentEdit: boolean): void;
    eqpt?: outlet_device_ex_fa_ac_input;
    setEqpt: (eqpt: outlet_device_ex_fa_input) => void;
    selectedCustomerID: string;
    selectedOutletID: string;
    afterOperation?: () => void;
}

const OutletEdit = ({ openEquipmentEdit, setOpenEquipmentEdit, eqpt, afterOperation, setEqpt, selectedCustomerID, selectedOutletID }: Props) => {
    const [uploadedFile, setUploadedFile] = React.useState<File>();
    const [currentSelectedCustomerID, setCurrentSelectedCustomerID] = React.useState(selectedCustomerID);
    const [currentSelectedOutletID, setCurrentSelectedOutletID] = React.useState(selectedOutletID);
    const [currentEqpt, setCurrentEqpt] = React.useState<outlet_device_ex_fa_ac_input>({
        name: "",
        outlet_id: -1,
        od_device_input_id: -1,
        outlet_date: "",
        device_type: "ex",
        device_num: "",
        vfd_kW: "",
        display_baseline_kW: "",
        display_low_kW: "",
        dmm_baseline_kW: "",
        dmm_low_kW: "",
        ac_baseline_kW: "",
        ac_factor_a: "",
        caltr_type: "",
        last_update: "",
        eqpt_serial_no: "",
        eqpt_manufacturer: "",
        live_date: "",
        eqpt_model: "",
        eqpt_photo: "",
    });

    const getCustomersQuery = gql`
    query Customers {
      customers {
        customer_id
        name
      }
    }`;

    const getOutletsQuery = gql`
    query Outlets($where: OutletWhereInput) {
      outlets(where: $where) {
        outlet_id
        name
      }
    }
    `;

    const mutateFaEqptQuery = gql`mutation CreateOneOutlet_device_ex_fa_input($data: Outlet_device_ex_fa_inputCreateInput!) {
        createOneOutlet_device_ex_fa_input(data: $data) {
          outlet_id
          od_device_input_id
          name
          outlet_date
          device_type
          device_num
          vfd_kW
          display_baseline_kW
          display_low_kW
          dmm_baseline_kW
          dmm_low_kW
          caltr_type
          last_update
          eqpt_serial_no
          eqpt_manufacturer
          live_date
          eqpt_model
          eqpt_photo
        }
      }`;

    const mutateAcEqptQuery = gql`mutation CreateOneOutlet_device_ac_input($data: Outlet_device_ac_inputCreateInput!) {
        createOneOutlet_device_ac_input(data: $data) {
          outlet_id
          od_device_input_id
          name
          outlet_date
          device_num
          last_update
          eqpt_serial_no
          eqpt_manufacturer
          live_date
          eqpt_model
          eqpt_photo
        }
      }`;

    const mutateFaUpdateEqptQuery = gql`
    mutation UpdateOneOutlet_device_ex_fa_input($data: Outlet_device_ex_fa_inputUpdateInput!, $where: Outlet_device_ex_fa_inputWhereUniqueInput!) {
        updateOneOutlet_device_ex_fa_input(data: $data, where: $where) {
          od_device_input_id
          name
        }
      }
    `;

    const mutateAcUpdateEqptQuery = gql`
    mutation UpdateOneOutlet_device_ac_input($data: Outlet_device_ac_inputUpdateInput!, $where: Outlet_device_ac_inputWhereUniqueInput!) {
        updateOneOutlet_device_ac_input(data: $data, where: $where) {
          od_device_input_id
          name
        }
      }
    `;

    const getAcEqptQuery = gql`
    query Outlet_device_ac_input_LEEE($where: Outlet_device_ac_inputWhereUniqueInput!) {
        outlet_device_ac_input(where: $where) {
          outlet_id
          od_device_input_id
          outlet_date
          device_num
          ac_baseline_kW
          ac_factor_a
          name
          last_update
          eqpt_serial_no
          eqpt_manufacturer
          live_date
          eqpt_model
          eqpt_photo
        }
      }`;

    const getEqptQuery = gql`
    query Outlet_device_ex_fa_input($where: Outlet_device_ex_fa_inputWhereUniqueInput!) {
        outlet_device_ex_fa_input(where: $where) {
          outlet_id
          od_device_input_id
          name
          outlet_date
          device_type
          device_num
          vfd_kW
          display_baseline_kW
          display_low_kW
          dmm_baseline_kW
          dmm_low_kW
          caltr_type
          last_update
          eqpt_serial_no
          eqpt_manufacturer
          live_date
          eqpt_model
          eqpt_photo
        }
      }`;

    const getOutletsVariable = React.useMemo(() => {
        return {
            "variables": {
                "where":
                {
                    "customer": {
                        "is": {
                            "customer_id": {
                                "equals": currentSelectedCustomerID ? parseInt(currentSelectedCustomerID) : -1
                            }
                        }
                    }
                }
            }
        }
    }, [currentSelectedCustomerID]);

    const getEqptVariable = {
        "variables": {
            "where": {
                "od_device_input_id": eqpt?.od_device_input_id || "",
            }
        }
    }


    const outletsResult = useQuery(getOutletsQuery, getOutletsVariable);
    const customersResult = useQuery(getCustomersQuery);
    const ExFaeqptResult = useLazyQuery(getEqptQuery, getEqptVariable);
    const AcEqptResult = useLazyQuery(getAcEqptQuery, getEqptVariable);
    const updateFaEqptResult = useMutation(mutateFaUpdateEqptQuery);
    const updateAcEqptResult = useMutation(mutateAcUpdateEqptQuery);
    const [createFaMutationQuery] = useMutation(mutateFaEqptQuery);
    const [createAcMutationQuery] = useMutation(mutateAcEqptQuery);

    const customerDropdown: DropdownProps[] = React.useMemo(() => {
        if (customersResult.data && customersResult.data.customers.length > 0) {
            setCurrentSelectedCustomerID(customersResult.data.customers[0].customer_id)
            return customersResult.data.customers.map((cust: any) => {
                return { key: cust.customer_id, value: cust.name }
            })
        } else {
            return [];
        }
    }, [customersResult.data]);

    const outletDropdown: DropdownProps[] = React.useMemo(() => {
        if (outletsResult.data && outletsResult.data.outlets.length > 0) {
            setCurrentSelectedOutletID(outletsResult.data.outlets[0].outlet_id)
            return outletsResult.data.outlets.map((outlet: any) => {
                return { key: outlet.outlet_id, value: outlet.name };
            })
        } else {
            return [];
        }
    }, [outletsResult.data]);

    React.useEffect(() => {
        setCurrentSelectedCustomerID(selectedCustomerID)
    }, [selectedCustomerID]);

    React.useEffect(() => {
        setCurrentSelectedOutletID(selectedOutletID)
    }, [selectedOutletID]);

    React.useEffect(() => {
        if (eqpt) {
            if (eqpt.device_type && eqpt.device_type !== 'ac') {
                ExFaeqptResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then((res) => {
                    if (res.data && res.data.outlet_device_ex_fa_input) {
                        setCurrentEqpt(res.data.outlet_device_ex_fa_input);
                    }
                    else {
                        setCurrentEqpt({
                            name: "",
                            outlet_id: -1,
                            od_device_input_id: -1,
                            outlet_date: moment().format("DD/MM/YYYY"),
                            device_type: "ex",
                            device_num: "",
                            vfd_kW: "",
                            display_baseline_kW: "",
                            display_low_kW: "",
                            dmm_baseline_kW: "",
                            ac_baseline_kW: "",
                            ac_factor_a: "",
                            dmm_low_kW: "",
                            caltr_type: "",
                            last_update: "",
                            eqpt_serial_no: "",
                            eqpt_manufacturer: "",
                            live_date: "",
                            eqpt_model: "",
                            eqpt_photo: "",
                        });
                    }
                });
            } else {
                AcEqptResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then((res) => {
                    if (res.data && res.data.outlet_device_ac_input) {
                        const currentobj = res.data.outlet_device_ac_input as outlet_device_ex_fa_ac_input;
                        currentobj.device_type = 'ac';
                        setCurrentEqpt(currentobj);
                    }
                    else {
                        setCurrentEqpt({
                            name: "",
                            outlet_id: -1,
                            od_device_input_id: -1,
                            outlet_date: moment().format("DD/MM/YYYY"),
                            device_type: "ex",
                            device_num: "",
                            vfd_kW: "",
                            display_baseline_kW: "",
                            display_low_kW: "",
                            dmm_baseline_kW: "",
                            ac_baseline_kW: "",
                            ac_factor_a: "",
                            dmm_low_kW: "",
                            caltr_type: "",
                            last_update: "",
                            eqpt_serial_no: "",
                            eqpt_manufacturer: "",
                            live_date: "",
                            eqpt_model: "",
                            eqpt_photo: "",
                        });
                    }
                });
            }
        } else {
            setCurrentEqpt({
                name: "",
                outlet_id: -1,
                od_device_input_id: -1,
                outlet_date: moment().format("DD/MM/YYYY"),
                device_type: "ex",
                device_num: "",
                vfd_kW: "",
                display_baseline_kW: "",
                display_low_kW: "",
                dmm_baseline_kW: "",
                ac_baseline_kW: "",
                ac_factor_a: "",
                dmm_low_kW: "",
                caltr_type: "",
                last_update: "",
                eqpt_serial_no: "",
                eqpt_manufacturer: "",
                live_date: "",
                eqpt_model: "",
                eqpt_photo: "",
            });
        }
    }, [eqpt]);

    const eqptType = React.useMemo(() => {
        if (currentEqpt.od_device_input_id !== -1) {
            if (currentEqpt.device_type === 'ac') {
                return [{ key: 'ac', value: 'Aircon' }]
            } else {
                return [{ key: 'ex', value: 'Exhaust' }, { key: 'fa', value: 'Fresh Air' }]
            }
        } else {
            return [{ key: 'ex', value: 'Exhaust' }, { key: 'fa', value: 'Fresh Air' }, { key: 'ac', value: 'Aircon' }];
        }

    }, [currentEqpt.od_device_input_id])

    const boldAndNormalLabel = (boldText: string, normalText: string) => {
        return (
            <React.Fragment>
                <b>{boldText}</b>
                <span>{normalText}</span>
            </React.Fragment>
        )
    }

    const onChange = (value: any, attributeName: string) => {
        const cloned_current_eqpt: outlet_device_ex_fa_ac_input = cloneDeep(currentEqpt);
        cloned_current_eqpt[attributeName] = value;
        setCurrentEqpt(cloned_current_eqpt);
    }

    const getDataToFill = React.useMemo(() => {
        if (currentEqpt.device_type !== 'ac') {
            return {
                "name": {
                    "set": currentEqpt.name
                },
                "outlet_date": {
                    "set": moment().format("DD/MM/YYYY")
                },
                "device_type": {
                    "set": currentEqpt.device_type
                },
                "device_num": {
                    "set": currentEqpt.device_num
                },
                "vfd_kW": {
                    "set": currentEqpt.vfd_kW
                },
                "display_baseline_kW": {
                    "set": currentEqpt.display_baseline_kW
                },
                "display_low_kW": {
                    "set": currentEqpt.display_low_kW
                },
                "dmm_baseline_kW": {
                    "set": currentEqpt.dmm_baseline_kW
                },
                "dmm_low_kW": {
                    "set": currentEqpt.dmm_low_kW
                },
                "caltr_type": {
                    "set": currentEqpt.caltr_type
                },
                "last_update": {
                    "set": currentEqpt.last_update
                },
                "eqpt_serial_no": {
                    "set": currentEqpt.eqpt_serial_no
                },
                "eqpt_manufacturer": {
                    "set": currentEqpt.eqpt_manufacturer
                },
                "eqpt_photo": {
                    "set": currentEqpt.eqpt_photo
                },
                "live_date": {
                    "set": currentEqpt.live_date
                },
                "eqpt_model": {
                    "set": currentEqpt.eqpt_model
                },
                "outlet": {
                    "connect": {
                        "outlet_id": currentSelectedOutletID
                    }
                }
            };
        } else {
            return {
                "name": {
                    "set": currentEqpt.name
                },
                "outlet_date": {
                    "set": moment().format("DD/MM/YYYY")
                },
                "device_num": {
                    "set": currentEqpt.device_num
                },
                "last_update": {
                    "set": currentEqpt.last_update
                },
                "eqpt_serial_no": {
                    "set": currentEqpt.eqpt_serial_no
                },
                "eqpt_manufacturer": {
                    "set": currentEqpt.eqpt_manufacturer
                },
                "eqpt_photo": {
                    "set": currentEqpt.eqpt_photo
                },
                "live_date": {
                    "set": currentEqpt.live_date
                },
                "eqpt_model": {
                    "set": currentEqpt.eqpt_model
                },
                "ac_baseline_kW": {
                    "set": currentEqpt.ac_baseline_kW
                },
                "ac_factor_a": {
                    "set": currentEqpt.ac_factor_a
                },
                "outlet": {
                    "connect": {
                        "outlet_id": currentSelectedOutletID
                    }
                }
            }
        }
    }, [currentEqpt, currentSelectedOutletID]);

    const onClick = (event: any) => {
        if (currentEqpt.od_device_input_id === -1) {
            const cloned_current_eqpt = cloneDeep(currentEqpt);
            cloned_current_eqpt["outlet"] = {
                "connect": {
                    "outlet_id": currentSelectedOutletID
                }
            }
            const { od_device_input_id, outlet_id, ...cloned_current_eqpt_without_outlet_id } = cloned_current_eqpt;
            if (cloned_current_eqpt.device_type === 'ac') {
                const { vfd_kW, display_low_kW, dmm_low_kW, caltr_type, device_type, display_baseline_kW, dmm_baseline_kW, ...filtered_cloned_current_eqpt } = cloned_current_eqpt_without_outlet_id;
                const MUTATE_VARIABLES = {
                    variables: {
                        "data": filtered_cloned_current_eqpt
                    }
                };
                createAcMutationQuery(MUTATE_VARIABLES).then((val) => { afterOperation && afterOperation(); setOpenEquipmentEdit(false); });
            } else {
                const { ac_baseline_kW, ac_factor_a, ...filtered_cloned_current_eqpt } = cloned_current_eqpt_without_outlet_id;
                const MUTATE_VARIABLES = {
                    variables: {
                        "data": filtered_cloned_current_eqpt
                    }
                };
                createFaMutationQuery(MUTATE_VARIABLES).then((val) => { afterOperation && afterOperation(); setOpenEquipmentEdit(false); });
            }

            setCurrentEqpt({
                name: "",
                outlet_id: -1,
                od_device_input_id: -1,
                outlet_date: moment().format("DD/MM/YYYY"),
                device_type: "ex",
                device_num: "",
                vfd_kW: "",
                display_baseline_kW: "",
                display_low_kW: "",
                dmm_baseline_kW: "",
                ac_baseline_kW: "",
                ac_factor_a: "",
                dmm_low_kW: "",
                caltr_type: "",
                last_update: "",
                eqpt_serial_no: "",
                eqpt_manufacturer: "",
                live_date: "",
                eqpt_model: "",
                eqpt_photo: "",
            });

        } else {
            const updateEqptVariable = {
                "variables": {
                    "where": {
                        "od_device_input_id": currentEqpt.od_device_input_id,
                    },
                    "data": getDataToFill,
                }
            };
            if (currentEqpt.device_type === 'ac') {
                updateAcEqptResult[0](updateEqptVariable).then(() => { afterOperation && afterOperation(); setOpenEquipmentEdit(false); });
            } else {
                updateFaEqptResult[0](updateEqptVariable).then(() => { afterOperation && afterOperation(); setOpenEquipmentEdit(false); });
            }

        }

    }

    return (
        <React.Fragment>
            <div className="flex justify-end">
                <button onClick={(e) => { setOpenEquipmentEdit(!openEquipmentEdit) }} className={`w-8 h-8`} type='button'>
                    <FontAwesomeIcon style={{ fontSize: '2em', cursor: 'pointer' }} icon={faCircleXmark} />
                </button>
            </div>
            <div className="edit-space-divider">
                <div className="edit-sub-container">
                    <div className="flex justify-between">
                        <h2><b>Equipment</b> <br /> Information</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                        <CustomizedInput hideDropDownPrefixIcon={true} label={"Customer"} inputType="select" value={currentSelectedCustomerID} dropDownData={customerDropdown} onChange={(val: any) => { setCurrentSelectedCustomerID(val); }} />
                        <CustomizedInput hideDropDownPrefixIcon={true} label={"Outlet"} inputType="select" value={currentSelectedOutletID} dropDownData={outletDropdown} onChange={(val: any) => { setCurrentSelectedOutletID(val); }} />
                    </div>
                </div>
                <div className="edit-sub-container">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                        <CustomizedInput label={"Equipment ID"} inputType="text" value={currentEqpt.device_num} onChange={(val: any) => { onChange(val, 'device_num') }} />
                        <CustomizedInput hideDropDownPrefixIcon={true} label={"Equipment Type"} inputType="select" value={currentEqpt.device_type} dropDownData={eqptType} onChange={(val: any) => { onChange(val, 'device_type') }} />
                        <CustomizedInput label={"Equipment Name"} inputType="text" value={currentEqpt.name} onChange={(val: any) => { onChange(val, 'name') }} />
                        <CustomizedInput label={"Equipment SerialNo."} inputType="text" value={currentEqpt.eqpt_serial_no} onChange={(val: any) => { onChange(val, 'eqpt_serial_no') }} />
                        <CustomizedInput label={"Equipment Manufacturer"} inputType="text" value={currentEqpt.eqpt_manufacturer} onChange={(val: any) => { onChange(val, 'eqpt_manufacturer') }} />
                        <CustomizedInput label={"Live Date"} inputType="text" value={currentEqpt.live_date} onChange={(val: any) => { onChange(val, 'live_date') }} />
                        <CustomizedInput label={"Equipment Model"} inputType="text" value={currentEqpt.eqpt_model} onChange={(val: any) => { onChange(val, 'eqpt_model') }} />
                        <FileUpload uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
                        {
                            currentEqpt.device_type === 'ac' &&
                            <React.Fragment>
                                <CustomizedInput label={boldAndNormalLabel("AC Baseline", "(kW)")} inputType="text" value={currentEqpt.ac_baseline_kW || ""} onChange={(val: any) => { onChange(val, 'ac_baseline_kW') }} />
                                <CustomizedInput label={boldAndNormalLabel("AC Factor a", "(Basic, Advanced)")} inputType="text" value={currentEqpt.ac_factor_a || ""} onChange={(val: any) => { onChange(val, 'ac_factor_a') }} />
                            </React.Fragment>
                        }
                        {
                            currentEqpt.device_type !== 'ac' &&
                            <React.Fragment>
                                <CustomizedInput label={boldAndNormalLabel("Ex VFD", "(kW)")} inputType="text" value={currentEqpt.vfd_kW} onChange={(val: any) => { onChange(val, 'vfd_kW') }} />
                                <CustomizedInput label={boldAndNormalLabel("Ex DMM", " Low (kW)")} inputType="text" value={currentEqpt.dmm_low_kW} onChange={(val: any) => { onChange(val, 'dmm_low_kW') }} />
                                <CustomizedInput label={boldAndNormalLabel("Ex Display", " Baseline (kW)")} inputType="text" value={currentEqpt.display_baseline_kW} onChange={(val: any) => { onChange(val, 'display_baseline_kW') }} />
                                <CustomizedInput label={boldAndNormalLabel("Ex Display", " Low (kW)")} inputType="text" value={currentEqpt.display_low_kW} onChange={(val: any) => { onChange(val, 'display_low_kW') }} />
                                <CustomizedInput label={boldAndNormalLabel("Ex DMM", " Baseline (kW)")} inputType="text" value={currentEqpt.dmm_baseline_kW} onChange={(val: any) => { onChange(val, 'dmm_baseline_kW') }} />
                                <CustomizedInput label={boldAndNormalLabel("Ex", " Caltr. Type (Norm, Perm Low)")} inputType="text" value={currentEqpt.caltr_type} onChange={(val: any) => { onChange(val, 'caltr_type') }} />
                            </React.Fragment>
                        }

                    </div>
                </div>
                {/* <div className="edit-sub-container">
                    <div className="grid grid-cols-3 gap-x-2 ">
                        {/* <CustomizedInput label={"Baseline"} inputType="textWithPostfix" postFix={'kW'} value={""} />
                        <CustomizedInput label={"Usage - low"} inputType="textWithPostfix" postFix={'kWH'} value={""} />
                        <CustomizedInput label={"Usage - High"} inputType="textWithPostfix" postFix={'kWH'} value={""} />
                        <div className="col-span-3">
                            
                        </div>
                    </div>
                </div> */}
                {/* <div className="edit-sub-container">
                    <div className="flex justify-between">
                        <h2><b>Device</b></h2>
                        <h2><b>(5)</b></h2>
                    </div>
                    <div className="grid grid-cols-1 items-center">
                        <Searchfield IconFront={false} WithButton={true} InputElement={getSearchinput()} ButtonText={"Retrieve from Emily"} />
                        <div className="w-full overflow-auto max-h-summaryTableHeight">
                            <SummaryTable headers={['Device ID', 'Type', 'Name', 'Status', '']} data={dummySummaryEquipmentTableData} />
                        </div>
                    </div>
                </div> */}
                <div className="flex flex-row gap-x-3 justify-between">
                    <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Reset</button>
                    <button type='button' onClick={onClick} className="bg-blue-500 text-white rounded-lg w-full text-sm h-11 text-center">Save</button>
                </div>
            </div>

        </React.Fragment>
    )
}

export default OutletEdit;