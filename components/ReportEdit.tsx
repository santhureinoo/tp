import { dummySummaryBillingTableData, dummySummaryOutletTableData } from "../common/constant";
import PillButton from "./PillButton";
import SummaryTable from "./SummaryTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { first_intermediary_table, group, outlet, reports, results, secondary_intermediary_table } from "../types/datatype";
import React from "react";
import { gql, useLazyQuery, useMutation, WatchQueryFetchPolicy } from "@apollo/client";
import DropdownMenu from "./DropdownMenu";
import { useRouter } from 'next/router';
import { useDropdown } from '../hooks/UseDropdown';
import axios from "axios";
import { convertMonthName, downloadFile, numberWithCommas } from "../common/helper";
import moment from "moment";
import { Oval } from "react-loader-spinner";
import { Button, Modal, Table } from "flowbite-react";
import CustomizedDropDown from "./CustomizedDropDown";
import { cloneDeep } from "@apollo/client/utilities";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

interface Props {
    openReportEdit: boolean;
    afterOperation?: () => void;
    customerType: 'Group' | 'Outlet';
    selectedID: number;
    selectedOutletID?: number;
    selectedCustomerID?: number;
    month: string;
    year: string;
    result?: results;
    setOpenReportEdit(openReportEdit: boolean): void;
}

const ReportEdit = ({ openReportEdit, setOpenReportEdit, selectedID, selectedOutletID, selectedCustomerID, result, month, year, afterOperation, customerType }: Props) => {
    const [dropdownRef, openDownloadReport, setOpenDownloadReport] = useDropdown(false, () => { });
    const [currentReport, setCurrentReport] = React.useState<reports>();
    const [currentGroup, setCurrentGroup] = React.useState<group>();
    const [loading, setLoading] = React.useState(false);
    const [disableSave, setDisableSave] = React.useState(true);
    const [updateIntermediaryLoading, setUpdateIntermediaryLoading] = React.useState(false);
    const [updateRecalLoading, setUpdateRecallLoading] = React.useState(false);
    const [openEditPopup, setOpenEditPopup] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedSubTitle, setSelectedSubTitle] = React.useState(0);
    const [recalculateDays, setRecalculateDays] = React.useState<string[]>([]);
    const [firstIntermediaryList, setFirstIntermediaryList] = React.useState<first_intermediary_table[]>([]);
    const [secondIntermediaryList, setSecondIntermediaryList] = React.useState<secondary_intermediary_table[]>([]);
    const [firstOriginIntermediaryList, setFirstOriginIntermediaryList] = React.useState<first_intermediary_table[]>([]);
    const [secondOriginIntermediaryList, setSecondOriginIntermediaryList] = React.useState<secondary_intermediary_table[]>([]);

    const modalItems = ["Savings Performance", "Eqpt. Energy Baseline"];
    const router = useRouter();

    const getFirstIntermediaryVariable = {
        "variables": {
            ...(month !== 'All' && year !== 'All') && {
                "where": {
                    "outlet_month_year": {
                        "equals": month + '/' + year
                    },
                    "outlet_id": {
                        "equals": selectedOutletID
                    }
                }
            }

        }
    }

    const getFirstIntermediaryQuery = gql`
    query First_intermediary_tables($where: First_intermediary_tableWhereInput) {
        first_intermediary_tables(where: $where) {
          outlet_month_year
          day_of_month
          all_eqpt_without_TP_kWh
          all_eqpt_with_TP_kWh
          ke_without_TP_kWh
          ke_with_TP_kWh
          ac_without_TP_kWh
          ac_with_TP_kWh
          total_savings_kWh
          outlet_id
        }
      }`


    const getSecondIntermediaryVariable = {
        "variables": {
            ...(month !== 'All' && year !== 'All') && {
                "where": {
                    "outlet_month_year": {
                        "equals": month + '/' + year
                    },
                    "outlet_id": {
                        "equals": selectedOutletID
                    }
                }
            }

        }
    }

    const getSecondIntermediaryQuery = gql`
    query Secondary_intermediary_tables($where: Secondary_intermediary_tableWhereInput) {
        secondary_intermediary_tables(where: $where) {
          acmv_without_TP_kWh
          acmv_baseline_kW
          time
          day_of_month
          outlet_month_year
          outlet_id
        }
      }`

    const getGroupBYIDVariable = React.useMemo(() => {
        return {
            "variables": {
                "where": {
                    ...(month !== 'All') && {
                        "month": {
                            "equals": month
                        }
                    },
                    ...(year !== 'All') && {
                        "year": {
                            "equals": year
                        }
                    },

                },
                "findFirstGroupWhere2": {
                    "group_id": {
                        "equals": selectedID
                    },
                },
                ...(month !== 'All' && year !== 'All') && {
                    "resultWhere": {
                        "outlet_date": {
                            "contains": year
                        }
                    }
                },

            },
            'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
        };
    }, [selectedID, month, year]);

    const getGroupByIDQUery = gql`
    query FindFirstGroup($where: ReportsWhereInput, $findFirstGroupWhere2: GroupWhereInput, $resultWhere: ResultsWhereInput) {
        findFirstGroup(where: $findFirstGroupWhere2) {
          group_name
          group_id
          customers {
            name
            outlet {
                results(where: $resultWhere) {
                    outlet_eqpt_energy_usage_with_TP_month_expenses
                    outlet_eqpt_energy_usage_with_TP_month_kW
                    outlet_eqpt_energy_usage_without_TP_month_expenses
                    outlet_eqpt_energy_usage_without_TP_month_kW
                    outlet_measured_savings_percent
                    outlet_measured_savings_kWh
                    outlet_measured_savings_expenses
                    outlet_date
                    tp_sales_expenses
                    co2_savings_kg
                }
            }
        }
          reports(where: $where) {
            last_avail_tariff
            outlet_measured_savings_expenses
            outlet_measured_savings_kWh
            outlet_measured_savings_percent
            month
            year
          }
        }
      }`;

    const getReportByIDVariable = {
        "variables": {
            "where": {
                "id": {
                    "equals": selectedID
                },
                // ...(month !== 'All') && {
                //     "month": {
                //         "equals": month
                //     }
                // },
                // ...(year !== 'All') && {
                //     "year": {
                //         "equals": year
                //     }
                // },
                // ...(selectedCustomerID) && {
                //     "customer_ids": {
                //         "contains": selectedCustomerID.toString()
                //     }
                // },
            },
            "customersWhere2": {
                "customer_id": {
                    "equals": selectedCustomerID || 0
                }
            },
            "outletWhere2": {
                "outlet_id": {
                    "equals": selectedOutletID || 0
                }
            },
            ...(month !== 'All' && year !== 'All') && {
                "resultWhere": {
                    "outlet_date": {
                        "contains": month + '/' + year
                    }
                }
            }

        },
    }

    const getGroupQuery = gql`
    query FindManyReports($where: ReportsWhereInput, $resultsWhere2: ResultsWhereInput) {
        findManyReports(where: $where) {
          group {
            group_name
            customers {
              outlet {
                name
                outlet_id
                results(where: $resultsWhere2) {
                  outlet_measured_savings_percent
                  outlet_measured_savings_kWh
                  outlet_measured_savings_expenses
                  outlet_eqpt_energy_usage_with_TP_month_expenses
                  outlet_eqpt_energy_usage_with_TP_month_kW
                  outlet_eqpt_energy_usage_without_TP_month_expenses
                  outlet_eqpt_energy_usage_without_TP_month_kW
                  savings_tariff_expenses
                  co2_savings_kg
                  tp_sales_expenses
                  outlet_date
                }
              }
            }
          }
        }
      }`;

    const getReportByIdQuery = gql`
    query FindFirstReports($where: ReportsWhereInput, $customersWhere2: CustomerWhereInput,$resultWhere: ResultsWhereInput, $outletWhere2: OutletWhereInput) {
        findFirstReports(where: $where) {
            report_id
            group {
                customers(where: $customersWhere2) {
                    name
                    outlet(where: $outletWhere2) {
                        outlet_id
                        name
                        outlet_address
                        results(where: $resultWhere) {
                            outlet_eqpt_energy_usage_with_TP_month_expenses
                            outlet_eqpt_energy_usage_with_TP_month_kW
                            outlet_eqpt_energy_usage_without_TP_month_expenses
                            outlet_eqpt_energy_usage_without_TP_month_kW
                            outlet_measured_savings_expenses
                            outlet_measured_savings_kWh
                            outlet_measured_savings_percent
                            co2_savings_kg
                            savings_tariff_expenses
                          acmv_25percent_benchmark_comparison_kWh
                          acmv_25percent_benchmark_comparison_expenses
                          acmv_10percent_benchmark_comparison_kWh
                          acmv_10percent_benchmark_comparison_expenses
                          ke_and_ac_25percent_benchmark_comparison_kWh
                          ke_and_ac_25percent_benchmark_comparison_expenses
                          ke_and_ac_10percent_benchmark_comparison_kWh
                          ke_and_ac_10percent_benchmark_comparison_expenses
                          ac_measured_savings_kWh
                          ke_measured_savings_kWh
                          ke_eqpt_energy_baseline_avg_hourly_kW
                          ac_eqpt_energy_baseline_avg_hourly_kW
                          ke_eqpt_energy_baseline_avg_hourly_as_date
                          acmv_eqpt_energy_baseline_avg_hourly_kW
                          ac_eqpt_energy_baseline_avg_hourly_as_date
                          acmv_eqpt_energy_baseline_avg_hourly_as_date
                          acmv_measured_savings_kWh
                          outlet_date
                        }
                        outlet_device_ac_input {
                            ac_baseline_kW
                        }
                        outlet_device_ex_fa_input {
                            display_baseline_kW
                            device_type
                        }
                    }
                }
            }
          last_avail_tariff
          year
          month
        }
      }`;

    const updateOneFirstIntermediaryQuery = gql`
      mutation UpdateOneFirst_intermediary_table($data: First_intermediary_tableUpdateInput!, $where: First_intermediary_tableWhereUniqueInput!) {
        updateOneFirst_intermediary_table(data: $data, where: $where) {
          outlet_id
          outlet_month_year
          day_of_month
        }
      }`

    const updateOneSecondIntermediaryQuery = gql`
    mutation UpdateOneSecondary_intermediary_table($data: Secondary_intermediary_tableUpdateInput!, $where: Secondary_intermediary_tableWhereUniqueInput!) {
        updateOneSecondary_intermediary_table(data: $data, where: $where) {
          outlet_month_year
          day_of_month
          outlet_id
        }
      }`

    const getReportByID = useLazyQuery(getReportByIdQuery, getReportByIDVariable);
    const getGroupByID = useLazyQuery(getGroupByIDQUery, getGroupBYIDVariable);
    const getGroupResult = useLazyQuery(getGroupQuery);
    const getFirstIntermediary = useLazyQuery(getFirstIntermediaryQuery, getFirstIntermediaryVariable);
    const getSecondIntermediary = useLazyQuery(getSecondIntermediaryQuery, getSecondIntermediaryVariable);
    const updateOneFirstIntermediary = useMutation(updateOneFirstIntermediaryQuery);
    const updateOneSecondIntermediary = useMutation(updateOneSecondIntermediaryQuery);

    React.useEffect(() => {
        if (openReportEdit && selectedID) {
            setLoading(true);
            if (customerType === 'Outlet') {
                getReportByID[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
                    if (res && res.data && res.data.findFirstReports) {
                        setCurrentReport(res.data.findFirstReports);
                    }
                }).finally(() => {
                    setLoading(false);
                })
            } else {
                getGroupByID[0]().then(res => {
                    if (res && res.data && res.data.findFirstGroup) {
                        setCurrentGroup(res.data.findFirstGroup);
                    }
                }
                ).finally(() => {
                    setLoading(false);
                })
            }
        }

    }, [customerType, openReportEdit, selectedID]);

    React.useEffect(() => {
        if (openEditPopup) {
            // if (selectedSubTitle === 0) {
            getFirstIntermediary[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(result => {
                if (result && result.data.first_intermediary_tables) {
                    setFirstIntermediaryList(result.data.first_intermediary_tables.map((item: first_intermediary_table) => {
                        item.all_eqpt_with_TP_kWh = Math.round(Number(item.all_eqpt_with_TP_kWh)).toString();
                        item.all_eqpt_without_TP_kWh = Math.round(Number(item.all_eqpt_without_TP_kWh)).toString();
                        return item;
                    }));

                    setFirstOriginIntermediaryList(result.data.first_intermediary_tables.map((item: first_intermediary_table) => {
                        item.all_eqpt_with_TP_kWh = Math.round(Number(item.all_eqpt_with_TP_kWh)).toString();
                        item.all_eqpt_without_TP_kWh = Math.round(Number(item.all_eqpt_without_TP_kWh)).toString();
                        return item;
                    }));
                }
            })
            // } else {
            getSecondIntermediary[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(result => {
                if (result && result.data.secondary_intermediary_tables) {
                    setSecondIntermediaryList(result.data.secondary_intermediary_tables.map((item: secondary_intermediary_table) => {
                        item.acmv_without_TP_kWh = Math.round(Number(item.acmv_without_TP_kWh)).toString();
                        item.acmv_baseline_kW = Math.round(Number(item.acmv_baseline_kW)).toString();
                        return item
                    }));
                    setSecondOriginIntermediaryList(result.data.secondary_intermediary_tables.map((item: secondary_intermediary_table) => {
                        item.acmv_without_TP_kWh = Math.round(Number(item.acmv_without_TP_kWh)).toString();
                        item.acmv_baseline_kW = Math.round(Number(item.acmv_baseline_kW)).toString();
                        return item
                    }));
                }
            })
            // }
        }

    }, [openEditPopup]);

    const getSummaryTable = React.useMemo(() => {
        let ex_data: any[] = ["Kitchen Exhaust"];
        let fa_data: any[] = ["Fresh Air"];
        let ac_data: any[] = ["ACMV"];
        if (currentReport && currentReport.group && currentReport.group.customers
            && currentReport.group.customers.length > 0 && currentReport.group.customers[0].outlet
            && currentReport.group.customers[0].outlet.length > 0 && currentReport.group.customers[0].outlet[0]) {
            if (currentReport.group.customers[0].outlet[0].results) {
                const result = currentReport.group.customers[0].outlet[0].results;
                let exObj = {
                    qty: 0,
                    tfBM: {
                        energyBase: 0,
                        mesKWH: 0,
                        mesEXP: 0,
                    },
                    tenBM: {
                        mesKWH: 0,
                        mesEXP: 0,
                    }
                };
                let faObj = {
                    qty: 0,
                    tfBM: {
                        energyBase: 0,
                        mesKWH: 0,
                        mesEXP: 0,
                    },
                    tenBM: {
                        mesKWH: 0,
                        mesEXP: 0,
                    }
                };
                let acObj = {
                    qty: 0,
                    tfBM: {
                        energyBase: 0,
                        mesKWH: 0,
                        mesEXP: 0,
                    },
                    tenBM: {
                        mesKWH: 0,
                        mesEXP: 0,
                    }
                };
                result.forEach(res => {
                    exObj.qty += 1;
                    acObj.qty += 1;
                    faObj.qty += 1;

                    // exObj.tenBM.energyBase += Number(res.ke_eqpt_energy_baseline_avg_hourly_kW || '0');
                    // acObj.tenBM.energyBase += Number(res.acmv_eqpt_energy_baseline_avg_hourly_kW || '0');
                    // faObj.tenBM.energyBase += Number(res.ac_eqpt_energy_baseline_avg_hourly_kW || '0');

                    exObj.tenBM.mesKWH += Number(res.ke_and_ac_10percent_benchmark_comparison_kWh || '0');
                    acObj.tenBM.mesKWH += Number(res.acmv_10percent_benchmark_comparison_kWh || '0');
                    faObj.tenBM.mesKWH += Number(res.ke_and_ac_10percent_benchmark_comparison_kWh || '0');

                    exObj.tenBM.mesEXP += Number(res.ke_and_ac_10percent_benchmark_comparison_expenses || '0');
                    acObj.tenBM.mesEXP += Number(res.acmv_10percent_benchmark_comparison_expenses || '0');
                    faObj.tenBM.mesEXP += Number(res.ke_and_ac_10percent_benchmark_comparison_expenses || '0');

                    exObj.tfBM.energyBase += Number(res.ke_eqpt_energy_baseline_avg_hourly_kW || '0');
                    acObj.tfBM.energyBase += Number(res.ke_eqpt_energy_baseline_avg_hourly_kW || '0');
                    faObj.tfBM.energyBase += Number(res.ke_eqpt_energy_baseline_avg_hourly_kW || '0');

                    exObj.tfBM.mesKWH += Number(res.ke_and_ac_25percent_benchmark_comparison_kWh || '0');
                    acObj.tfBM.mesKWH += Number(res.acmv_25percent_benchmark_comparison_kWh || '0');
                    faObj.tfBM.mesKWH += Number(res.ke_and_ac_25percent_benchmark_comparison_kWh || '0');

                    exObj.tfBM.mesEXP += Number(res.ke_and_ac_25percent_benchmark_comparison_expenses || '0');
                    acObj.tfBM.mesEXP += Number(res.acmv_25percent_benchmark_comparison_expenses || '0');
                    faObj.tfBM.mesEXP += Number(res.ke_and_ac_25percent_benchmark_comparison_expenses || '0');
                })

                ex_data = [
                    "Kitchen Exhaust",
                    exObj.qty,
                    `${exObj.tfBM.energyBase}kw`,
                    <div key={'ex_data_first'} className="flex flex-row justify-around">
                        <div className='flex flex-col'>
                            <span>{numberWithCommas(exObj.tfBM.mesKWH)}kWh</span>
                            <span>{numberWithCommas(exObj.tenBM.mesKWH)}kWh</span>
                        </div>
                        <div className='flex flex-col'>
                            <span>${numberWithCommas(exObj.tfBM.mesEXP)}</span>
                            <span>${numberWithCommas(exObj.tenBM.mesEXP)}</span>
                        </div>
                    </div>,
                    <div key={'ex_data_second'} className='flex flex-col'>
                        <span>25%</span>
                        <span>10%</span>
                    </div>
                ];

                ac_data = [
                    "ACMV",
                    acObj.qty,
                    `${acObj.tfBM.energyBase}kw`,
                    <div key={'ac_data_first'} className="flex flex-row justify-around">
                        <div className='flex flex-col'>
                            <span>{numberWithCommas(acObj.tfBM.mesKWH)}kWh</span>
                            <span>{numberWithCommas(acObj.tenBM.mesKWH)}kWh</span>
                        </div>
                        <div className='flex flex-col'>
                            <span>${numberWithCommas(acObj.tfBM.mesEXP)}</span>
                            <span>${numberWithCommas(acObj.tenBM.mesEXP)}</span>
                        </div>
                    </div>,
                    <div key={'ac_data_second'} className='flex flex-col'>
                        <span>25%</span>
                        <span>10%</span>
                    </div>
                ]

                fa_data = [
                    "Fresh Air",
                    faObj.qty,
                    `${faObj.tfBM.energyBase}kw`,
                    <div key={'fa_data_first'} className="flex flex-row justify-around">
                        <div className='flex flex-col'>
                            <span>{numberWithCommas(faObj.tfBM.mesKWH)}kWh</span>
                            <span>{numberWithCommas(faObj.tenBM.mesKWH)}kWh</span>
                        </div>
                        <div className='flex flex-col'>
                            <span>${numberWithCommas(faObj.tfBM.mesEXP)}</span>
                            <span>${numberWithCommas(faObj.tenBM.mesEXP)}</span>
                        </div>
                    </div>,
                    <div key={'fa_data_second'} className='flex flex-col'>
                        <span>25%</span>
                        <span>10%</span>
                    </div>
                ]



                // ac_data.push(currentReport.group.customers[0].outlet[0].outlet_device_ac_input.length.toString());
                // const elemString = currentReport.group.customers[0].outlet[0].outlet_device_ac_input.map((acItem: any, index: number) => {
                //     return <div key={'frag ' + index} className='flex flex-row justify-around gap-x-4'>
                //         <div className='flex flex-col'>
                //             <span>
                //                 97kWh
                //             </span>
                //         </div>
                //         <div className='flex flex-col'>
                //             <span>
                //                 $0.20
                //             </span>
                //         </div>
                //     </div>;
                // });
                // ac_data.push(currentReport.group.customers[0].outlet[0].outlet_device_ac_input.reduce((accum: any, obj: any) => { return accum + Number(obj.ac_baseline_kW || "0") }, 0) + "kw");
                // ac_data.push(elemString);
                // ac_data.push(elemString.length > 0 && "30%");
            }
            // else {
            //     ac_data = [...ac_data, "0", "0kw"];
            // }
            // if (currentReport.group.customers[0].outlet[0].outlet_device_ex_fa_input) {
            //     const exArr = currentReport.group.customers[0].outlet[0].outlet_device_ex_fa_input.filter((eqpt: any) => eqpt.device_type === 'ex');
            //     const elemString = exArr.map((exItem: any, index: any) => {
            //         return <div key={'frag ' + index} className='flex flex-row justify-around gap-x-4' >
            //             <div className='flex flex-col'>
            //                 <span>
            //                     97kWh
            //                 </span>
            //             </div>
            //             <div className='flex flex-col'>
            //                 <span>
            //                     $0.20
            //                 </span>
            //             </div>
            //         </div >;
            //     })
            //     ex_data.push(exArr.length.toString());
            //     ex_data.push(exArr.reduce((accum: any, obj: any) => { return accum + Number(obj.display_baseline_kW || "0") }, 0) + "kw");
            //     ex_data.push(elemString);
            //     ex_data.push(elemString.length > 0 && "30%");
            // } else {
            //     ex_data = [...ex_data, "0", "0kw"];
            // }
            // if (currentReport.group.customers[0].outlet[0].outlet_device_ex_fa_input) {
            //     const faArr = currentReport.group.customers[0].outlet[0].outlet_device_ex_fa_input.filter((eqpt: any) => eqpt.device_type === 'fa');
            //     const elemString = faArr.map((faItem: any, index: any) => {
            //         return <div key={'frag ' + index} className='flex flex-row justify-around gap-x-4'>
            //             <div className='flex flex-col'>
            //                 <span>
            //                     97kWh
            //                 </span>
            //             </div>
            //             <div className='flex flex-col'>
            //                 <span>
            //                     $0.20
            //                 </span>
            //             </div>

            //         </div>;
            //     })
            //     fa_data.push(faArr.length.toString());
            //     fa_data.push(faArr.reduce((accum: any, obj: any) => { return accum + Number(obj.display_baseline_kW || "0") }, 0) + "kw");
            //     fa_data.push(elemString);
            //     fa_data.push(elemString.length > 0 && "30%");
            // } else {
            //     fa_data = [...fa_data, "0", "0kw"];
            // }
        }
        // console.log([
        //     ac_data,
        //     ex_data,
        //     fa_data
        // ])
        return [
            ac_data,
            ex_data,
            fa_data
        ]
    }, [currentReport]);


    const downloadReportItems = React.useMemo(() => {
        if (customerType === 'Group') {
            return [
                {
                    "text": "Group",
                    "onClick": () => {
                        setLoading(true);
                        axios.get(
                            '/api/download',
                            {
                                responseType: 'blob',
                                params: {
                                    type: 'group',
                                    id: selectedID,
                                    month: month,
                                    year: year,
                                }
                            } // !!!
                        ).then((response) => {
                            downloadFile(response.data, `TablePointer Summary Report - ${currentGroup?.group_name} - ${month} ${year}`);
                        }).finally(() => {
                            setLoading(false);
                        })
                    },
                    "css": "",
                },
                {
                    "text": "Group + Annex",
                    "onClick": () => {
                        setLoading(true);
                        getGroupResult[0]({
                            'variables': {
                                "where": {
                                    "group_id": {
                                        "equals": selectedID
                                    },
                                    ...(month && year && month !== 'All' && year !== 'All') && {
                                        "year": {
                                            "equals": year
                                        },
                                        "month": {
                                            "equals": month
                                        }
                                    }

                                },
                                "resultsWhere2": {
                                    ...(month && year && month !== 'All' && year !== 'All') && {
                                        "outlet_date": {
                                            "equals": `${month}/${year}`
                                        }
                                    }

                                }
                            },
                            'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
                        }).then(response => {
                            if (!response.data) {
                                setLoading(false);
                                return;
                            }
                            const outletIds: string[] = [];
                            const reports: reports[] = response.data.findManyReports;
                            const rep = reports[reports.length - 1];
                            if (rep.group && rep.group.customers) {
                                rep.group.customers.forEach(cus => {
                                    if (cus.outlet) {
                                        cus.outlet.forEach(outlet => {
                                            outletIds.push(outlet.outlet_id.toString());
                                        })
                                    }

                                })
                                axios.get(
                                    '/api/download',
                                    {
                                        responseType: 'arraybuffer',
                                        params: {
                                            type: 'group',
                                            id: selectedID,
                                            month: month,
                                            year: year,
                                            outletIds: outletIds
                                        }
                                    } // !!!
                                ).then((response) => {
                                    downloadFile(response.data, `TablePointer Summary Report - ${currentGroup?.group_name} - ${month} ${year}`);
                                }).finally(() => {
                                    setLoading(false);
                                })
                            } else {
                                setLoading(false);
                            }
                        })
                    },
                    "css": "",
                },
            ]
        } else {
            return [
                {
                    "text": "Outlet",
                    "onClick": () => {
                        setLoading(true);
                        axios.get(
                            '/api/download',
                            {
                                responseType: 'arraybuffer',
                                params: {
                                    type: 'outlet',
                                    month: month,
                                    year: year,
                                    id: selectedOutletID,
                                }
                            } // !!!
                        ).then((response) => {
                            if (currentReport && currentReport.group && currentReport.group.customers
                                && currentReport.group.customers.length > 0 && currentReport.group.customers[0].outlet
                                && currentReport.group.customers[0].outlet[0]
                            ) {
                                downloadFile(response.data, `TablePointer Outlet Report - ${currentReport.group.customers[0].outlet[0].name} - ${month} ${year}`);
                            }
                        }).finally(() => {
                            setLoading(false);
                        })

                        // router.push({ pathname: "/api/download", query: { type: 'outlet', id: selectedID } });
                    },
                    "css": "",
                },
            ]
        }
    }, [customerType, selectedID, month, year, currentReport, currentGroup]);

    const updateIntermediary = () => {
        const promiseArr: Promise<any>[] = [];
        const recalDays: string[] = [];
        firstIntermediaryList.forEach((item, index) => {

            const originItem = firstOriginIntermediaryList[index];
            if (originItem.ke_with_TP_kWh !== item.ke_with_TP_kWh ||
                originItem.ke_without_TP_kWh !== item.ke_without_TP_kWh ||
                originItem.ac_with_TP_kWh !== item.ac_with_TP_kWh ||
                originItem.ac_without_TP_kWh !== item.ac_without_TP_kWh) {
                const updateOneFirstIntermediaryVariable = {
                    "variables": {
                        "data": {

                            ...(originItem.ke_with_TP_kWh !== item.ke_with_TP_kWh) && {
                                "ke_with_TP_kWh": {
                                    "set": item.ke_with_TP_kWh
                                },
                            },

                            ...(originItem.ke_without_TP_kWh !== item.ke_without_TP_kWh) && {
                                "ke_without_TP_kWh": {
                                    "set": item.ke_without_TP_kWh
                                },
                            },

                            ...(originItem.ac_without_TP_kWh !== item.ac_without_TP_kWh) && {
                                "ac_without_TP_kWh": {
                                    "set": item.ac_without_TP_kWh
                                },
                            },

                            ...(originItem.ac_with_TP_kWh !== item.ac_with_TP_kWh) && {
                                "ac_with_TP_kWh": {
                                    "set": item.ac_with_TP_kWh
                                },
                            },
                        },
                        "where": {
                            "outlet_month_year_day_of_month_outlet_id": {
                                "outlet_id": item.outlet_id,
                                "outlet_month_year": item.outlet_month_year,
                                "day_of_month": item.day_of_month
                            }
                        }
                    }
                };

                setOpenModal(!openModal);

                recalDays.push(item.day_of_month);
                promiseArr.push(updateOneFirstIntermediary[0](updateOneFirstIntermediaryVariable));
            }

        })

        secondIntermediaryList.forEach((item, index) => {
            const originItem = secondOriginIntermediaryList[index];
            if (originItem.acmv_baseline_kW !== item.acmv_baseline_kW ||
                originItem.acmv_without_TP_kWh !== item.acmv_without_TP_kWh) {
                const updateOneSecondIntermediaryVariable = {
                    "variables": {
                        "data": {
                            ...(originItem.acmv_baseline_kW !== item.acmv_baseline_kW) && {
                                "acmv_baseline_kW": {
                                    "set": item.acmv_baseline_kW
                                },
                            },
                            ...(originItem.acmv_without_TP_kWh !== item.acmv_without_TP_kWh) && {
                                "acmv_without_TP_kWh": {
                                    "set": item.acmv_without_TP_kWh
                                },
                            },
                        },
                        "where": {
                            "outlet_id_outlet_month_year_day_of_month": {
                                "outlet_id": item.outlet_id,
                                "outlet_month_year": item.outlet_month_year,
                                "day_of_month": item.day_of_month
                            }
                        }
                    }
                };
                recalDays.push(item.day_of_month);
                promiseArr.push(updateOneSecondIntermediary[0](updateOneSecondIntermediaryVariable));
            }
        })

        if (promiseArr.length > 0) {
            setUpdateIntermediaryLoading(true);
        }

        Promise.all(promiseArr).then((res) => {
            // setFirstOriginIntermediaryList(firstIntermediaryList);
            // setSecondOriginIntermediaryList(secondIntermediaryList);
            setUpdateIntermediaryLoading(false);
            setOpenEditPopup(false);
            setRecalculateDays(recalDays);
        })

    }

    const groupMeasuredEnergySavings = React.useMemo(() => {
        if (currentGroup && currentGroup.reports) {
            const result = {
                kwh: 0,
                exp: 0,
                percent: 0,
                euwotp_kwh: 0,
                euwotp_exp: 0,
                euwtp_kwh: 0,
                euwtp_exp: 0,
                energy_saving_py: 0,
                co2_saving_py: 0,
            }
            if (currentGroup.customers) {
                currentGroup.customers.forEach(customer => {
                    customer.outlet && customer.outlet.forEach(outlet => {
                        outlet.results && outlet.results.forEach(res => {
                            const outletDate = moment(res.outlet_date, 'DD/MM/YYYY');
                            if (outletDate.month() + 1 === Number(month)) {
                                result.exp += res.outlet_measured_savings_expenses ? Number(res.outlet_measured_savings_expenses) : 0;
                                result.kwh += res.outlet_measured_savings_kWh ? Number(res.outlet_measured_savings_kWh) : 0;
                                result.percent += res.outlet_measured_savings_percent ? Number(res.outlet_measured_savings_percent) : 0;
                                result.euwotp_kwh += res.outlet_eqpt_energy_usage_without_TP_month_kW ? Number(res.outlet_eqpt_energy_usage_without_TP_month_kW) : 0;
                                result.euwotp_exp += res.outlet_eqpt_energy_usage_without_TP_month_expenses ? Number(res.outlet_eqpt_energy_usage_without_TP_month_expenses) : 0;
                                result.euwtp_kwh += res.outlet_eqpt_energy_usage_with_TP_month_kW ? Number(res.outlet_eqpt_energy_usage_with_TP_month_kW) : 0;
                                result.euwtp_exp += res.outlet_eqpt_energy_usage_with_TP_month_expenses ? Number(res.outlet_eqpt_energy_usage_with_TP_month_expenses) : 0;
                            }

                            result.energy_saving_py += res.tp_sales_expenses ? Number(res.tp_sales_expenses) : 0;
                            result.co2_saving_py += res.co2_savings_kg ? Number(res.co2_savings_kg) : 0;
                        })
                    })
                })
            }

            return result;
        } else {
            return undefined;
        }
    }, [currentGroup]);

    const reportMeasuredEnergySavings = React.useMemo(() => {
        if (currentReport?.group?.customers && currentReport?.group?.customers.length > 0) {
            const result = {
                kwh: 0,
                exp: 0,
                percent: 0,
                euwotp_kwh: 0,
                euwotp_exp: 0,
                euwtp_kwh: 0,
                euwtp_exp: 0,
                ste: 0,
                co2: 0,
            }
            currentReport.group.customers.forEach(customer => {
                if (customer.outlet) {
                    customer.outlet.forEach(out => {
                        if (out.results && out.results.length > 0) {
                            out.results.forEach(res => {
                                result.kwh = res.outlet_measured_savings_kWh ? Number(res.outlet_measured_savings_kWh) : 0;
                                result.exp = res.outlet_measured_savings_expenses ? Number(res.outlet_measured_savings_expenses) : 0;
                                result.percent += res.outlet_measured_savings_percent ? Number(res.outlet_measured_savings_percent) : 0;
                                result.euwotp_kwh += res.outlet_eqpt_energy_usage_without_TP_month_kW ? Number(res.outlet_eqpt_energy_usage_without_TP_month_kW) : 0;
                                result.euwotp_exp += res.outlet_eqpt_energy_usage_without_TP_month_expenses ? Number(res.outlet_eqpt_energy_usage_without_TP_month_expenses) : 0;
                                result.euwtp_kwh += res.outlet_eqpt_energy_usage_with_TP_month_kW ? Number(res.outlet_eqpt_energy_usage_with_TP_month_kW) : 0;
                                result.euwtp_exp += res.outlet_eqpt_energy_usage_with_TP_month_expenses ? Number(res.outlet_eqpt_energy_usage_with_TP_month_expenses) : 0;
                                result.ste += res.savings_tariff_expenses ? Number(res.savings_tariff_expenses) : 0;
                                result.co2 += res.co2_savings_kg ? Number(res.co2_savings_kg) : 0;
                            })
                        }
                    })
                }
            })
            return result;
        } else {
            return undefined;
        }
    }, [currentReport]);

    const changeFirstIntermediaryElement = (attribute: string, index: number, value: any) => {
        const clonedFirstIntermediaryList = cloneDeep(firstIntermediaryList);
        clonedFirstIntermediaryList[index][attribute] = value.replace(/^0+/, '');
        setFirstIntermediaryList(clonedFirstIntermediaryList);
        setDisableSave(false);
    }

    const getFirstIntermediaryElement = React.useMemo(() => {
        return firstIntermediaryList.sort((a, b) => {
            const aDate = moment(a.day_of_month + '/' + a.outlet_month_year, "DD/MM/YYYY");
            const bDate = moment(b.day_of_month + '/' + b.outlet_month_year, "DD/MM/YYYY");

            return aDate.diff(bDate);
        }).map((item, index) => {
            const thisDay = moment(item.day_of_month + '/' + item.outlet_month_year, "DD/MM/YYYY");
            return {
                date: <Table.Cell>
                    {thisDay.format('D MMM')}
                </Table.Cell>,

                day: <Table.Cell>
                    {thisDay.format('dddd')}
                </Table.Cell>,

                without: <Table.Cell>
                    <input type="number" disabled={true} onChange={e => { changeFirstIntermediaryElement('all_eqpt_without_TP_kWh', index, e.currentTarget.value) }} value={item.all_eqpt_without_TP_kWh ? item.all_eqpt_without_TP_kWh.toString() : '0'} />
                </Table.Cell>,

                with: <Table.Cell>
                    <input type="number" disabled={true} onChange={e => { changeFirstIntermediaryElement('all_eqpt_with_TP_kWh', index, e.currentTarget.value) }} value={item.all_eqpt_with_TP_kWh ? item.all_eqpt_with_TP_kWh.toString() : '0'} />
                </Table.Cell>,

                keWoTP: <Table.Cell>
                    <input type="number" onChange={e => { changeFirstIntermediaryElement('ke_without_TP_kWh', index, e.currentTarget.value) }} value={item.ke_without_TP_kWh ? item.ke_without_TP_kWh.toString() : '0'} />
                </Table.Cell>,

                keWTP: <Table.Cell>
                    <input type="number" onChange={e => { changeFirstIntermediaryElement('ke_with_TP_kWh', index, e.currentTarget.value) }} value={item.ke_with_TP_kWh ? item.ke_with_TP_kWh.toString() : '0'} />
                </Table.Cell>,

                acWoTP: <Table.Cell>
                    <input type="number" onChange={e => { changeFirstIntermediaryElement('ac_without_TP_kWh', index, e.currentTarget.value) }} value={item.ac_without_TP_kWh ? item.ac_without_TP_kWh.toString() : '0'} />
                </Table.Cell>,

                acWTP: <Table.Cell>
                    <input type="number" onChange={e => { changeFirstIntermediaryElement('ac_with_TP_kWh', index, e.currentTarget.value) }} value={item.ac_with_TP_kWh ? item.ac_with_TP_kWh.toString() : '0'} />
                </Table.Cell>,

                totalSavings: <Table.Cell>
                    {parseInt(item.total_savings_kWh || '0')}
                </Table.Cell>,

            }
        })
    }, [firstIntermediaryList]);

    const changeSecondIntermediaryElement = (attribute: string, index: number, value: string) => {
        const clonedSecondIntermediaryList = cloneDeep(secondIntermediaryList);
        clonedSecondIntermediaryList[index][attribute] = value.replace(/^0+/, '');
        setSecondIntermediaryList(clonedSecondIntermediaryList);
        setDisableSave(false);
    }


    const getSecondaryIntermediaryElement = React.useMemo(() => {
        return secondIntermediaryList.map((item, index) => {
            return {
                time: <Table.Cell>
                    {item.time}
                </Table.Cell>,

                without: <Table.Cell>
                    <input type="number" onChange={e => { changeSecondIntermediaryElement('acmv_without_TP_kWh', index, e.currentTarget.value) }} value={item.acmv_without_TP_kWh ? item.acmv_without_TP_kWh.toString() : '0'} />
                </Table.Cell>,

                baseline: <Table.Cell>
                    <input type="number" onChange={e => { changeSecondIntermediaryElement('acmv_baseline_kW', index, e.currentTarget.value) }} value={item.acmv_baseline_kW ? item.acmv_baseline_kW.toString() : '0'} />
                </Table.Cell>,

            }
        })
    }, [secondIntermediaryList]);

    const outletTotalForGroup = React.useMemo(() => {
        if (currentGroup && currentGroup.reports) {
            let count = 0;
            currentGroup.customers && currentGroup.customers.forEach(cus => {
                count = count + (cus.outlet ? cus.outlet.length : 0);
            })
            return count;
        }
        else {
            return 0;
        }
    }, [currentGroup]);

    const savingTarifForGroup = () => {
        if (currentGroup && currentGroup.reports && currentGroup.reports.length > 0) {
            return currentGroup.reports[0].last_avail_tariff;
        } else {
            return "$0.20";
        }
    }

    const recalculateResults = () => {
        setUpdateRecallLoading(true);
        const promiseArr = recalculateDays.map(day => {
            return axios.post(
                `${process.env.NEXT_PUBLIC_SITE_URL}:4001/recalculate_outlet_results`,
                {
                    "outlet_id": selectedOutletID,
                    "outlet_date": day.padStart(2, '0') + `/${month}/${year}`,
                }
            )
        })

        Promise.all(promiseArr).finally(() => {
            // setFirstOriginIntermediaryList(firstIntermediaryList);
            // setSecondOriginIntermediaryList(secondIntermediaryList);
            setUpdateRecallLoading(false);
        })
    }

    return (<React.Fragment>
        <div className="flex justify-end">
            <button onClick={(e) => { setOpenReportEdit(!openReportEdit) }} className={`w-8 h-8`} type='button'>
                <FontAwesomeIcon style={{ fontSize: '2em', cursor: 'pointer' }} icon={faCircleXmark} />
            </button>
        </div>
        <div className="space-y-6 pt-6">
            <div className="pb-6 space-y-4">
                <div className="flex text-lg justify-between">
                    <div>
                        <h1 ><b>{customerType === 'Group' ? 'Group ID' : 'Report ID'}</b></h1>
                        <h5>{currentReport?.report_id || currentGroup?.group_id}</h5>
                    </div>
                    <div ref={dropdownRef} className="flex gap-x-2">
                        {/* <button type="button" onClick={(e) => { }} className={`text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm w-48 px-2 py-2.5 text-center items-center`}>
                            View Dashboard
                        </button> */}
                        <div className="flex gap-x-2">


                            {/** Edit Button for modal popup */}
                            {customerType === 'Outlet' && <button type="button" onClick={(e) => { setDisableSave(true); setOpenEditPopup(!openEditPopup) }} className={`text-white bg-blue-500 hover:bg-blue-600 relative font-medium rounded-lg text-sm text-center w-48 px-2 py-5 items-center`}>
                                Edit
                            </button>}

                            {customerType === 'Outlet' && <button type="button" onClick={(e) => { recalculateResults() }} className={`text-white bg-blue-500 hover:bg-blue-600 relative font-medium rounded-lg text-sm text-center w-48 px-2 py-5 items-center`}>
                                {updateRecalLoading ? <Oval
                                    height={20}
                                    width={20}
                                    color="white"
                                    wrapperStyle={{}}
                                    wrapperClass="w-full py-2 flex justify-center"
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="white"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}
                                /> : 'Recalculate results'}
                            </button>}
                            <Modal
                                size="7xl"
                                dismissible={true}
                                show={openEditPopup}
                                onClose={() => setOpenEditPopup(!openEditPopup)}
                            >
                                <Modal.Header>
                                    <div className='flex flex-row'>
                                        <h3 className="text-gray-700 text-3xl font-bold">Edit: </h3>
                                        <CustomizedDropDown hideBorder={true} customCSS='text-3xl' inputType={'dropdown'} hidePrefixIcons={true} data={modalItems} selected={modalItems[selectedSubTitle]} setSelected={(selected: string) => { setSelectedSubTitle(modalItems.indexOf(selected)) }} />
                                    </div>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="space-y-6">
                                        <Table className="firstColumnSticky">
                                            {/* <Table.Head>
                                                <Table.HeadCell>
                                                    Product name
                                                </Table.HeadCell>
                                                <Table.HeadCell>
                                                    Color
                                                </Table.HeadCell>
                                                <Table.HeadCell>
                                                    Category
                                                </Table.HeadCell>
                                                <Table.HeadCell>
                                                    Price
                                                </Table.HeadCell>
                                                <Table.HeadCell>
                                                    <span className="sr-only">
                                                        Edit
                                                    </span>
                                                </Table.HeadCell>
                                            </Table.Head> */}
                                            {selectedSubTitle === 0 ? <Table.Body className="divide-y text-xs">
                                                <Table.Row className="bg-white text-[#989AAC] dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        <span className='block w-[144px]'>Date</span>
                                                    </Table.Cell>
                                                    {getFirstIntermediaryElement.map(elem => {
                                                        return elem.date;
                                                    })}
                                                </Table.Row>
                                                <Table.Row className="bg-white text-[#000000] text-custom-sm dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell>
                                                        <span className='block w-[144px]'>Day</span>
                                                    </Table.Cell>
                                                    {getFirstIntermediaryElement.map(elem => {
                                                        return elem.day;
                                                    })}
                                                </Table.Row>
                                                <Table.Row className="bg-white text-[#000000] dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell>
                                                        <span className='block w-[144px]'> All Eqpt. w/o TP (kWh)</span>
                                                    </Table.Cell>
                                                    {getFirstIntermediaryElement.map(elem => {
                                                        return elem.without;
                                                    })}
                                                </Table.Row>
                                                <Table.Row className="bg-white text-[#000000] dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell>
                                                        <span className='block w-[144px]'> All Eqpt. with TP (kWh)</span>
                                                    </Table.Cell>
                                                    {getFirstIntermediaryElement.map(elem => {
                                                        return elem.with;
                                                    })}
                                                </Table.Row>
                                                <Table.Row className="bg-white text-[#000000] dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell>
                                                        <span className='block w-[144px]'> KE w/o TP (kWh)</span>
                                                    </Table.Cell>
                                                    {getFirstIntermediaryElement.map(elem => {
                                                        return elem.keWoTP;
                                                    })}
                                                </Table.Row>
                                                <Table.Row className="bg-white text-[#000000] dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell>
                                                        <span className='block w-[144px]'> KE with TP (kWh)</span>
                                                    </Table.Cell>
                                                    {getFirstIntermediaryElement.map(elem => {
                                                        return elem.keWTP;
                                                    })}
                                                </Table.Row>
                                                <Table.Row className="bg-white text-[#000000] dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell>
                                                        <span className='block w-[144px]'> AC w/o TP (kWh)</span>
                                                    </Table.Cell>
                                                    {getFirstIntermediaryElement.map(elem => {
                                                        return elem.acWoTP;
                                                    })}
                                                </Table.Row>
                                                <Table.Row className="bg-white text-[#000000] dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell>
                                                        <span className='block w-[144px]'> AC with TP (kWh)</span>
                                                    </Table.Cell>
                                                    {getFirstIntermediaryElement.map(elem => {
                                                        return elem.acWTP;
                                                    })}
                                                </Table.Row>
                                                <Table.Row className="bg-[#FAFAFA] dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell>
                                                        <span className='block w-[144px]'> Total Savings</span>
                                                    </Table.Cell>
                                                    {getFirstIntermediaryElement.map(elem => {
                                                        return elem.totalSavings;
                                                    })}
                                                </Table.Row>
                                            </Table.Body> : <Table.Body className="divide-y">
                                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        <span className='block w-[144px]'> Time</span>
                                                    </Table.Cell>
                                                    {getSecondaryIntermediaryElement.map(elem => {
                                                        return elem.time;
                                                    })}
                                                </Table.Row>
                                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell>
                                                        <span className='block w-[144px]'> ACMV w/o TP (kWh)</span>
                                                    </Table.Cell>
                                                    {getSecondaryIntermediaryElement.map(elem => {
                                                        return elem.without;
                                                    })}
                                                </Table.Row>
                                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell>
                                                        <span className='block w-[144px]'> ACMV Baseline (kW)</span>
                                                    </Table.Cell>
                                                    {getSecondaryIntermediaryElement.map(elem => {
                                                        return elem.baseline;
                                                    })}
                                                </Table.Row>
                                            </Table.Body>}


                                        </Table>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="flex w-full justify-end gap-x-2">
                                        <Button onClick={e => {
                                            selectedSubTitle === 0 ? setFirstIntermediaryList(firstOriginIntermediaryList) : setSecondIntermediaryList(secondOriginIntermediaryList);
                                            setDisableSave(true);
                                        }} color="gray">
                                            Reset
                                        </Button>
                                        <Button onClick={() => setOpenModal(true)} data-modal-target="popup-modal" data-modal-show="popup-modal" color={disableSave ? 'dark' : 'info'} disabled={disableSave}>
                                            {updateIntermediaryLoading ? <Oval
                                                height={20}
                                                width={20}
                                                color="white"
                                                wrapperStyle={{}}
                                                wrapperClass="w-full py-2 flex justify-center"
                                                visible={true}
                                                ariaLabel='oval-loading'
                                                secondaryColor="white"
                                                strokeWidth={2}
                                                strokeWidthSecondary={2}
                                            /> : 'Save'}
                                        </Button>
                                        <Modal  size="lg" show={openModal} onClose={() => setOpenModal(!openModal)}>
                                            {/* <Modal.Header></Modal.Header> */}
                                            <Modal.Body>
                                                {/* <button onClick={() => setOpenModal(!openModal)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                    </svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button> */}
                                                <div className="py-4 text-center">
                                                    {/* <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg> */}
                                                    <div className="flex gap-x-2 justify-center mb-4">
                                                        <FontAwesomeIcon icon={faInfo} className="p-1 px-2 text-orange-400 rounded-full border border-orange-400"></FontAwesomeIcon>
                                                        <div className="flex flex-col text-left">
                                                            <h3 className="text-lg mb-2 font-bold">Are you sure you want to save?</h3>
                                                            <p>
                                                                You will not be able to revert the changes if saved
                                                            </p>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-x-2">
                                                    <Button onClick={() => setOpenModal(!openModal)} type="button" color="gray">
                                                        No
                                                    </Button>
                                                    <Button onClick={() => updateIntermediary()} data-modal-hide="popup-modal" type="button" color={"info"}>Yes</Button>
                                                </div>
                                            </Modal.Body>
                                            {/* <Modal.Footer>
                                            </Modal.Footer> */}
                                        </Modal>
                                        {/* <div id="popup-modal" tabIndex={-1} className="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                                            <div className="relative w-full max-w-md max-h-full">
                                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                                    <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                        </svg>
                                                        <span className="sr-only">Close modal</span>
                                                    </button>
                                                    <div className="p-6 text-center">
                                                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                        </svg>
                                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                                                        <button data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                                            Yes, I'm sure
                                                        </button>
                                                        <button data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                        {/* <button
                                            className={`text-white bg-blue-500 hover:bg-blue-600 relative font-medium rounded-lg text-sm text-center w-48 px-2 py-5 items-center`}

                                        >
                                            Reset
                                        </button>
                                        <button className={`text-white bg-blue-500 hover:bg-blue-600 relative font-medium rounded-lg text-sm text-center w-48 px-2 py-5 items-center`} onClick={e => setOpenEditPopup(false)}>
                                            Save
                                        </button> */}
                                    </div>
                                </Modal.Footer>
                            </Modal>

                            <button type="button" onClick={(e) => { !loading && setOpenDownloadReport(!openDownloadReport) }} className={`text-white bg-blue-500 hover:bg-blue-600 relative font-medium rounded-lg text-sm text-center w-48 px-2 py-5 items-center`}>
                                {loading ? <Oval
                                    height={20}
                                    width={20}
                                    color="white"
                                    wrapperStyle={{}}
                                    wrapperClass="w-full py-2 flex justify-center"
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="white"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}
                                /> : 'Download Report'}
                                <div className={`${openDownloadReport ? 'absolute' : 'hidden'} z-20 top-16 left-0 w-full`}>
                                    <DropdownMenu options={downloadReportItems} />
                                </div>
                            </button>


                        </div>
                    </div>

                </div>
                {/* <PillButton className={`${billingData && billingData.STA === 'Generated' ? `text-yellow-600 bg-yellow-500` : `bg-green-300 text-green-500`}  w-40 h-10`} text={`Invoice ${billingData.STA}`} /> */}
            </div>
            <div className="edit-sub-container">
                <div className="flex bg-slate-200 p-4 items-center">
                    <h2><b>{customerType === 'Outlet' ? 'Pte Ltd' : 'Group'}</b> Information</h2>
                </div>
                {customerType === 'Outlet' ?
                    <React.Fragment>
                        <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                            <div>
                                <h4>Pte Ltd Name</h4>
                                <span className="text-slate-400">{currentReport?.group?.customers && currentReport?.group?.customers.length > 0 ? currentReport?.group?.customers[0].name : ''} </span>
                            </div>
                            <div>
                                <h4>Outlet Name</h4>
                                <span className="text-slate-400">{currentReport?.group?.customers && currentReport?.group?.customers.length > 0 && currentReport?.group?.customers[0].outlet && currentReport?.group?.customers[0].outlet.length > 0 ? currentReport?.group?.customers[0].outlet[0].name : ''}</span>
                            </div>
                            <div>
                                <h4>Outlet Address</h4>
                                <span className="text-slate-400">{currentReport?.group?.customers && currentReport?.group?.customers.length > 0 && currentReport?.group?.customers[0].outlet && currentReport?.group?.customers[0].outlet.length > 0 ? currentReport?.group?.customers[0].outlet[0].outlet_address : ''} </ span >
                            </div>

                            <div>
                                <h4>Last Available Tariff</h4>
                                <span className="text-slate-400">{currentReport?.last_avail_tariff}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-2">
                            <div className="edit-sub-container">
                                <div className="flex bg-slate-200 p-4 items-center justify-between">
                                    <div>
                                        <h2><b>Energy Usage</b></h2>
                                        <span><b>W/O TablePointer</b></span>
                                    </div>

                                    <span><b>{convertMonthName(currentReport?.month)}. {currentReport?.year}</b></span>
                                </div>
                                <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                                    {customerType === 'Outlet' ? <><div>
                                        <h4>kWh</h4>
                                        <span className="text-slate-400">{numberWithCommas(reportMeasuredEnergySavings?.euwotp_kwh)}</span>
                                    </div>
                                        <div>
                                            <h4>$</h4>
                                            <span className="text-slate-400">{numberWithCommas(reportMeasuredEnergySavings?.euwotp_exp)}</span>
                                        </div></> :
                                        <><div>
                                            <h4>kWh</h4>
                                            <span className="text-slate-400">{numberWithCommas(groupMeasuredEnergySavings?.euwotp_kwh)}</span>
                                        </div>
                                            <div>
                                                <h4>$</h4>
                                                <span className="text-slate-400">{numberWithCommas(groupMeasuredEnergySavings?.euwotp_exp)}</span>
                                            </div></>}
                                </div>
                            </div>
                            <div className="edit-sub-container">
                                <div className="flex bg-slate-200 p-4 items-center justify-between">
                                    <div>
                                        <h2><b>Energy Usage</b></h2>
                                        <span><b>With TablePointer</b></span>
                                    </div>

                                    <span><b>{convertMonthName(currentReport?.month)}. {currentReport?.year}</b></span>
                                </div>
                                {customerType === 'Outlet' && <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                                    <div>
                                        <h4>kWh</h4>
                                        <span className="text-slate-400">{numberWithCommas(reportMeasuredEnergySavings?.euwtp_kwh)}</span>
                                    </div>
                                    <div>
                                        <h4>$</h4>
                                        <span className="text-slate-400">{numberWithCommas(reportMeasuredEnergySavings?.euwtp_exp)}</span>
                                    </div>
                                </div>}

                            </div>
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                            <div>
                                <h4>Group Name</h4>
                                <span className="text-slate-400">{currentGroup?.group_name} </span>
                            </div>
                            <div>
                                <h4>Live Outlets</h4>
                                <span className="text-slate-400">{outletTotalForGroup}</span>
                            </div>
                            {/* <div>
                                <h4>Group Address</h4>
                                <span className="text-slate-400">{currentGroup}</ span >
                            </div> */}

                            <div>
                                <h4>Savings @Tariff</h4>
                                <span className="text-slate-400">{savingTarifForGroup()}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2">
                            <div className="edit-sub-container">
                                <div className="flex bg-slate-200 p-4 items-center justify-between">
                                    <div>
                                        <h2><b>Energy Usage</b></h2>
                                        <span><b>W/O TablePointer</b></span>
                                    </div>

                                    <span><b>{convertMonthName(month)}. {year}</b></span>
                                </div>
                                <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                                    <div>
                                        <h4>kWh</h4>
                                        <span className="text-slate-400">{numberWithCommas(groupMeasuredEnergySavings?.euwotp_kwh)}</span>
                                    </div>
                                    <div>
                                        <h4>$</h4>
                                        <span className="text-slate-400">{numberWithCommas(groupMeasuredEnergySavings?.euwotp_exp)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="edit-sub-container">
                                <div className="flex bg-slate-200 p-4 items-center justify-between">
                                    <div>
                                        <h2><b>Energy Usage</b></h2>
                                        <span><b>With TablePointer</b></span>
                                    </div>

                                    <span><b>{convertMonthName(month)}. {year}</b></span>
                                </div>
                                <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                                    <div>
                                        <h4>kWh</h4>
                                        <span className="text-slate-400">{numberWithCommas(groupMeasuredEnergySavings?.euwtp_kwh)}</span>
                                    </div>
                                    <div>
                                        <h4>$</h4>
                                        <span className="text-slate-400">{numberWithCommas(groupMeasuredEnergySavings?.euwtp_exp)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </React.Fragment>

                }

            </div>

            <div className="edit-sub-container">
                <div className="flex bg-slate-200 p-4 items-center justify-between">
                    <h2><b>Measured Energy Saving</b></h2>
                    <span><b>{convertMonthName(currentReport?.month || month)}. {currentReport?.year || year}</b></span>
                </div>
                {customerType === 'Outlet' ?
                    <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                        <div>
                            <h4>kWh</h4>
                            <span className="text-slate-400">{numberWithCommas(reportMeasuredEnergySavings?.kwh)}</span>
                        </div>
                        <div>
                            <h4>$</h4>
                            <span className="text-slate-400">{numberWithCommas(reportMeasuredEnergySavings?.exp)}</span>
                        </div>
                        <div>
                            <h4>%</h4>
                            <span className="text-slate-400">{numberWithCommas(reportMeasuredEnergySavings?.percent, 0)}</span>
                        </div>
                        <div>
                            <h4>CO2</h4>
                            <span className="text-slate-400">{numberWithCommas(reportMeasuredEnergySavings?.co2)}</span>
                        </div>
                        <div>
                            <h4>Savings @</h4>
                            <span className="text-slate-400">{numberWithCommas(reportMeasuredEnergySavings?.ste)}</span>
                        </div>
                    </div>
                    :
                    <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                        <div>
                            <h4>kWh</h4>
                            <span className="text-slate-400">{numberWithCommas(groupMeasuredEnergySavings?.kwh)}</span>
                        </div>
                        <div>
                            <h4>$</h4>
                            <span className="text-slate-400">{numberWithCommas(groupMeasuredEnergySavings?.exp)}</span>
                        </div>
                        <div>
                            <h4>%</h4>
                            <span className="text-slate-400">{numberWithCommas(groupMeasuredEnergySavings?.percent)}</span>
                        </div>
                    </div>
                }

            </div>
            {
                customerType === 'Outlet' ?
                    <div className="edit-sub-container">
                        <div className="flex bg-slate-200 p-4 items-center justify-between">
                            <h2><b>Equipment Performance</b></h2>
                            <span><b>{convertMonthName(currentReport?.month)}. {currentReport?.year}</b></span>
                        </div>
                        <div className="grid grid-cols-1 items-center">
                            <div className="w-full overflow-auto max-h-summaryBillingHeight">
                                <SummaryTable headerColor={`bg-slate-100`} headers={["Equipment", "Qty", "Eqpt.Energy Baseline", "Measured Energy Savings", "Benchmark"]} data={getSummaryTable} />
                            </div>
                        </div>
                    </div>
                    :
                    <div className="edit-sub-container">
                        <div className="flex bg-slate-200 p-4 items-center justify-between">
                            <h2><b>Annual Unlocked</b></h2>
                        </div>
                        <div className="grid grid-cols-1 items-center">
                            <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                                <div>
                                    <h4>Energy Savings per year</h4>
                                    <span className="text-slate-400">$ {numberWithCommas(groupMeasuredEnergySavings?.energy_saving_py, 0)}</span>
                                </div>
                                <div>
                                    <h4>CO<span className="text-xs">2</span> Saved per year</h4>
                                    <span className="text-slate-400"> {numberWithCommas(groupMeasuredEnergySavings?.co2_saving_py, 0)}</span>
                                </div>
                                <div>
                                    <h4>Planted Trees per year</h4>
                                    <span className="text-slate-400">{numberWithCommas((groupMeasuredEnergySavings?.energy_saving_py || 0) * 0.00084, 0)}</span>
                                </div>
                                <div>
                                    <h4>Meals sold per year</h4>
                                    <span className="text-slate-400">{numberWithCommas((groupMeasuredEnergySavings?.energy_saving_py || 0) * 2, 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    </React.Fragment >);
}

export default ReportEdit;