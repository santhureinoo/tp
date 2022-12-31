import { dummySummaryBillingTableData, dummySummaryOutletTableData } from "../common/constant";
import PillButton from "./PillButton";
import SummaryTable from "./SummaryTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { group, outlet, reports, results } from "../types/datatype";
import React from "react";
import { gql, useLazyQuery, WatchQueryFetchPolicy } from "@apollo/client";
import DropdownMenu from "./DropdownMenu";
import { useRouter } from 'next/router';
import { useDropdown } from '../hooks/UseDropdown';
import axios from "axios";
import { downloadFile } from "../common/helper";


interface Props {
    openReportEdit: boolean;
    afterOperation?: () => void;
    customerType: 'Group' | 'Outlet';
    selectedReportID: number;
    month: string;
    year: string;
    result?: results;
    setOpenReportEdit(openReportEdit: boolean): void;
}

const ReportEdit = ({ openReportEdit, setOpenReportEdit, selectedReportID, result, month, year, afterOperation, customerType }: Props) => {
    const [currentOutlet, setCurrentOutlet] = React.useState<outlet>();
    const [dropdownRef, openDownloadReport, setOpenDownloadReport] = useDropdown(false, () => { });
    const [currentReport, setCurrentReport] = React.useState<reports>();
    const [currentGroup, setCurrentGroup] = React.useState<group>();
    const router = useRouter();

    const getGroupBYIDVariable = {
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
                    "equals": selectedReportID
                }
            }
        },
    };

    const getGroupByIDQUery = gql`
    query FindFirstGroup($where: ReportsWhereInput, $findFirstGroupWhere2: GroupWhereInput) {
        findFirstGroup(where: $findFirstGroupWhere2) {
          group_name
          group_id
          reports(where: $where) {
            last_avail_tariff
            outlet_measured_savings_expenses
            outlet_measured_savings_kWh
            outlet_measured_savings_percent
            customer {
                name
                outlet {
                  results {
                    outlet_eqpt_energy_usage_with_TP_month_expenses
                    outlet_eqpt_energy_usage_with_TP_month_kW
                    outlet_eqpt_energy_usage_without_TP_month_expenses
                    outlet_eqpt_energy_usage_without_TP_month_kW
                    outlet_measured_savings_percent
                    outlet_measured_savings_kWh
                    outlet_measured_savings_expenses
                  }
                }
              }
            month
            year
          }
        }
      }`;

    const getReportByIDVariable = {
        "variables": {
            "where": {
                "report_id": {
                    "equals": selectedReportID
                }
            }
        },
    }

    const getGroupQuery = gql`
    query FindManyReports($where: ReportsWhereInput, $resultsWhere2: ResultsWhereInput) {
        findManyReports(where: $where) {
          customer {
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
              }
            }
          }
        }
      }`;

    const getReportByIdQuery = gql`
    query FindFirstReports($where: ReportsWhereInput) {
        findFirstReports(where: $where) {
          customer {
            pte_ltd_name
          }
          outlet {
            outlet_id
            name
            outlet_address
            results {
              outlet_eqpt_energy_usage_with_TP_month_expenses
              outlet_eqpt_energy_usage_with_TP_month_kW
              outlet_eqpt_energy_usage_without_TP_month_expenses
              outlet_eqpt_energy_usage_without_TP_month_kW
              outlet_measured_savings_expenses
              outlet_measured_savings_kWh
              outlet_measured_savings_percent
              co2_savings_kg
              savings_tariff_expenses
            }
            outlet_device_ac_input {
              ac_baseline_kW
            }
            outlet_device_ex_fa_input {
              display_baseline_kW
              device_type
            }
          }
          last_avail_tariff
          year
          month
        }
      }`;
    // const getResultQuery = gql`
    // query FindFirstResults($where: ResultsWhereInput, $outletMonthWhere2: Outlet_monthWhereInput, $resultsWhere2: ResultsWhereInput) {
    //     findFirstResults(where: $where) {
    //       outlet {
    //         name
    //         customer {
    //           pte_ltd_name
    //         }
    //         outlet_device_ac_input {
    //             od_device_input_id
    //         }
    //         outlet_device_ex_fa_input {
    //             od_device_input_id
    //             device_type
    //         }
    //         outlet_address
    //         outlet_month(where: $outletMonthWhere2) {
    //           last_avail_tariff
    //         }
    //         results(where: $resultsWhere2) {
    //           acmv_measured_savings_kWh
    //           outlet_measured_savings_kWh
    //           outlet_measured_savings_expenses
    //           outlet_measured_savings_percent
    //           ke_eqpt_energy_usage_without_TP_month_kW
    //           ac_eqpt_energy_usage_without_TP_month_kW
    //           outlet_eqpt_energy_usage_without_TP_month_kW
    //           outlet_eqpt_energy_usage_without_TP_month_expenses
    //           ke_eqpt_energy_usage_with_TP_month_kW
    //           ac_eqpt_energy_usage_with_TP_month_kW
    //           outlet_eqpt_energy_usage_with_TP_month_kW
    //           outlet_eqpt_energy_usage_with_TP_month_expenses
    //           acmv_25percent_benchmark_comparison_kWh
    //           acmv_25percent_benchmark_comparison_expenses
    //           acmv_10percent_benchmark_comparison_kWh
    //           acmv_10percent_benchmark_comparison_expenses
    //           ke_and_ac__25percent_benchmark_comparison_kWh
    //           ke_and_ac__25percent_benchmark_comparison_expenses
    //           co2_savings_kg
    //           savings_tariff_expenses
    //         }
    //       }
    //     }
    //   }
    // `;

    // const getResultVariable = React.useMemo(() => {
    //     return {
    //         'variables': {
    //             "where": {
    //                 "outlet_date": {
    //                     "equals": result?.outlet_date
    //                 }
    //             },
    //             "outletMonthWhere2": {
    //                 "outlet_date": {
    //                     "equals": result?.outlet_date
    //                 }
    //             },
    //             "resultsWhere2": {
    //                 "outlet_date": {
    //                     "equals": result?.outlet_date
    //                 }
    //             }
    //         }
    //     }
    // }, [result]);

    // const getResultResult = useLazyQuery(getResultQuery, getResultVariable);
    const getReportByID = useLazyQuery(getReportByIdQuery, getReportByIDVariable);
    const getGroupByID = useLazyQuery(getGroupByIDQUery, getGroupBYIDVariable);
    const getGroupResult = useLazyQuery(getGroupQuery);

    React.useEffect(() => {
        if (customerType === 'Outlet') {
            getReportByID[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
                if (res && res.data && res.data.findFirstReports) {
                    setCurrentReport(res.data.findFirstReports);
                }
            })
        } else {
            getGroupByID[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
                if (res && res.data && res.data.findFirstGroup) {
                    setCurrentGroup(res.data.findFirstGroup);
                }
            }
            )
        }
    }, [customerType, selectedReportID])

    const getSummaryTable = React.useMemo(() => {
        let ex_data: any[] = ["Kitchen Exhaust"];
        let fa_data: any[] = ["Fresh Air"];
        let ac_data: any[] = ["ACMV"];
        if (currentReport && currentReport.outlet) {
            if (currentReport.outlet.outlet_device_ac_input) {
                ac_data.push(currentReport.outlet.outlet_device_ac_input.length.toString());
                const elemString = currentReport.outlet.outlet_device_ac_input.map((acItem, index) => {
                    return <div key={'frag ' + index} className='flex flex-row justify-around gap-x-4'>
                        <div className='flex flex-col'>
                            <span>
                                97kWh
                            </span>
                        </div>
                        <div className='flex flex-col'>
                            <span>
                                $0.20
                            </span>
                        </div>
                    </div>;
                });
                ac_data.push(currentReport.outlet.outlet_device_ac_input.reduce((accum, obj) => { return accum + parseInt(obj.ac_baseline_kW || "0") }, 0) + "kw");
                ac_data.push(elemString);
                ac_data.push(elemString.length > 0 && "30%");
            } else {
                ac_data = [...ac_data, "0", "0kw"];
            }
            if (currentReport.outlet.outlet_device_ex_fa_input) {
                const exArr = currentReport.outlet.outlet_device_ex_fa_input.filter((eqpt: any) => eqpt.device_type === 'ex');
                const elemString = exArr.map((exItem, index) => {
                    return <div key={'frag ' + index} className='flex flex-row justify-around gap-x-4' >
                        <div className='flex flex-col'>
                            <span>
                                97kWh
                            </span>
                        </div>
                        <div className='flex flex-col'>
                            <span>
                                $0.20
                            </span>
                        </div>
                    </div >;
                })
                ex_data.push(exArr.length.toString());
                ex_data.push(exArr.reduce((accum, obj) => { return accum + parseInt(obj.display_baseline_kW || "0") }, 0) + "kw");
                ex_data.push(elemString);
                ex_data.push(elemString.length > 0 && "30%");
            } else {
                ex_data = [...ex_data, "0", "0kw"];
            }
            if (currentReport.outlet.outlet_device_ex_fa_input) {
                const faArr = currentReport.outlet.outlet_device_ex_fa_input.filter((eqpt: any) => eqpt.device_type === 'fa');
                const elemString = faArr.map((faItem, index) => {
                    return <div key={'frag ' + index} className='flex flex-row justify-around gap-x-4'>
                        <div className='flex flex-col'>
                            <span>
                                97kWh
                            </span>
                        </div>
                        <div className='flex flex-col'>
                            <span>
                                $0.20
                            </span>
                        </div>

                    </div>;
                })
                fa_data.push(faArr.length.toString());
                fa_data.push(faArr.reduce((accum, obj) => { return accum + parseInt(obj.display_baseline_kW || "0") }, 0) + "kw");
                fa_data.push(elemString);
                fa_data.push(elemString.length > 0 && "30%");
            } else {
                fa_data = [...fa_data, "0", "0kw"];
            }
        }
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
                        axios.get(
                            '/api/download',
                            {
                                responseType: 'blob',
                                params: {
                                    type: 'group',
                                    id: selectedReportID,
                                    month: month,
                                    year: year,
                                }
                            } // !!!
                        ).then((response) => {
                            downloadFile(response.data, 'Group Report');
                        })
                    },
                    "css": "",
                },
                {
                    "text": "Group + Annex",
                    "onClick": () => {
                        getGroupResult[0]({
                            'variables': {
                                "where": {
                                    "group_id": {
                                        "equals": selectedReportID
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
                                            "equals": `${month} ${year}`
                                        }
                                    }

                                }
                            },
                            'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
                        }).then(response => {
                            const reports: reports[] = response.data.findManyReports;
                            console.log
                            reports.forEach(rep => {
                                if (rep.customer) {
                                    if (rep.customer.outlet) {
                                        rep.customer.outlet.forEach(outlet => {
                                            console.log(outlet.outlet_id);
                                            axios.get(
                                                '/api/download',
                                                {
                                                    responseType: 'arraybuffer',
                                                    params: {
                                                        type: 'group_annex',
                                                        id: outlet.outlet_id,
                                                        month: month,
                                                        year: year,
                                                    }
                                                } // !!!
                                            ).then((response) => {
                                                downloadFile(response.data, 'Group(Annex) Report');
                                            })
                                        })
                                    }
                                }
                            })
                        })

                        axios.get(
                            '/api/download',
                            {
                                responseType: 'arraybuffer',
                                params: {
                                    type: 'group',
                                    id: selectedReportID,
                                    month: month,
                                    year: year,
                                }
                            } // !!!
                        ).then((response) => {
                            downloadFile(response.data, 'Group Report');
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
                        axios.get(
                            '/api/download',
                            {
                                responseType: 'arraybuffer',
                                params: {
                                    type: 'outlet', id: currentReport?.outlet?.outlet_id,
                                    month: month,
                                    year: year,
                                }
                            } // !!!
                        ).then((response) => {
                            downloadFile(response.data, 'Outlet Report');
                        })

                        // router.push({ pathname: "/api/download", query: { type: 'outlet', id: selectedReportID } });
                    },
                    "css": "",
                },
            ]
        }
    }, [customerType, selectedReportID, month, year, currentReport]);

    const outletTotalForGroup = () => {
        if (currentGroup && currentGroup.reports && currentGroup.reports.length > 0
            && currentGroup.reports[0].customer &&
            currentGroup.reports[0].customer.length > 0) {
            return currentGroup.reports[0].customer[0].outlet.length;
        }
        else {
            return 0;
        }
    }

    const savingTarifForGroup = () => {
        if (currentGroup && currentGroup.reports && currentGroup.reports.length > 0) {
            return currentGroup.reports[0].last_avail_tariff;
        } else {
            return "$0.20";
        }
    }


    return (< div className={` edit-container ${openReportEdit ? "translate-x-0 " : "translate-x-full"}`
    }>
        <div className="flex justify-end">
            <button onClick={(e) => { setOpenReportEdit(!openReportEdit) }} className={`w-8 h-8`} type='button'>
                <FontAwesomeIcon style={{ fontSize: '2em', cursor: 'pointer' }} icon={faCircleXmark} />
            </button>
        </div>
        <div className="space-y-6 pt-6">
            <div className="pb-6 space-y-4">
                <div className="flex text-lg justify-between">
                    <div>
                        <h1 ><b>Report ID</b></h1>
                        <h5>EQ-2405</h5>
                    </div>
                    <div ref={dropdownRef} className="flex gap-x-2">
                        <button type="button" onClick={(e) => { }} className={`text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm w-48 px-2 py-2.5 text-center items-center`}>
                            View Dashboard
                        </button>
                        <div className="">
                            <button type="button" onClick={(e) => { setOpenDownloadReport(!openDownloadReport) }} className={`text-white bg-blue-500 hover:bg-blue-600 relative font-medium rounded-lg text-sm text-center w-48 px-2 py-5 items-center`}>
                                Download Report
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
                    <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                        <div>
                            <h4>Pte Ltd Name</h4>
                            <span className="text-slate-400">{currentReport?.customer?.pte_ltd_name} </span>
                        </div>
                        <div>
                            <h4>Outlet Name</h4>
                            <span className="text-slate-400">{currentReport?.outlet?.name}</span>
                        </div>
                        <div>
                            <h4>Outlet Address</h4>
                            <span className="text-slate-400">{currentReport?.outlet?.outlet_address} </ span >
                        </div>

                        <div>
                            <h4>Last Available Tariff</h4>
                            <span className="text-slate-400">{currentReport?.last_avail_tariff}</span>
                        </div>
                    </div>
                    :
                    <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                        <div>
                            <h4>Group Name</h4>
                            <span className="text-slate-400">{currentGroup?.group_name} </span>
                        </div>
                        <div>
                            <h4>Live Outlets</h4>
                            <span className="text-slate-400">{outletTotalForGroup()}</span>
                        </div>
                        <div>
                            <h4>Group Address</h4>
                            <span className="text-slate-400">Sahid Building <br /> Sudirman Boulevard No.12 Floor 15 / <br /> Unit 09</ span >
                        </div>

                        <div>
                            <h4>Savings @Tariff</h4>
                            <span className="text-slate-400">{savingTarifForGroup()}</span>
                        </div>
                    </div>
                }

            </div>
            <div className="grid grid-cols-2 gap-x-2">
                <div className="edit-sub-container">
                    <div className="flex bg-slate-200 p-4 items-center justify-between">
                        <div>
                            <h2><b>Energy Usage</b></h2>
                            <span><b>W/O TablePointer</b></span>
                        </div>

                        <span><b>{currentReport?.month}. {currentReport?.year}</b></span>
                    </div>
                    <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                        {customerType === 'Outlet' ? <><div>
                            <h4>kWh</h4>
                            <span className="text-slate-400">{currentReport?.outlet?.results && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results[0].outlet_eqpt_energy_usage_without_TP_month_kW}</span>
                        </div>
                            <div>
                                <h4>$</h4>
                                <span className="text-slate-400">{currentReport?.outlet?.results && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results[0].outlet_eqpt_energy_usage_without_TP_month_expenses}</span>
                            </div></> :
                            <><div>
                                <h4>kWh</h4>
                                <span className="text-slate-400">2,549</span>
                            </div>
                                <div>
                                    <h4>$</h4>
                                    <span className="text-slate-400">180</span>
                                </div></>}
                    </div>
                </div>
                <div className="edit-sub-container">
                    <div className="flex bg-slate-200 p-4 items-center justify-between">
                        <div>
                            <h2><b>Energy Usage</b></h2>
                            <span><b>With TablePointer</b></span>
                        </div>

                        <span><b>{currentReport?.month}. {currentReport?.year}</b></span>
                    </div>
                    {customerType === 'Outlet' && <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                        <div>
                            <h4>kWh</h4>
                            <span className="text-slate-400">{currentReport?.outlet?.results && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results[0].outlet_eqpt_energy_usage_with_TP_month_kW}</span>
                        </div>
                        <div>
                            <h4>$</h4>
                            <span className="text-slate-400">{currentReport?.outlet?.results && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results[0].outlet_eqpt_energy_usage_with_TP_month_expenses}</span>
                        </div>
                    </div>}
                    {customerType === 'Group' && <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                        <div>
                            <h4>kWh</h4>
                            <span className="text-slate-400">2,001</span>
                        </div>
                        <div>
                            <h4>$</h4>
                            <span className="text-slate-400">120</span>
                        </div>
                    </div>}
                </div>
            </div>
            <div className="edit-sub-container">
                <div className="flex bg-slate-200 p-4 items-center justify-between">
                    <h2><b>Measured Energy Savings</b></h2>
                    <span><b>{currentReport?.month}. {currentReport?.year}</b></span>
                </div>
                <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                    <div>
                        <h4>kWh</h4>
                        <span className="text-slate-400">{currentReport?.outlet?.results && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results[0].outlet_measured_savings_kWh}</span>
                    </div>
                    <div>
                        <h4>$</h4>
                        <span className="text-slate-400">{currentReport?.outlet?.results && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results[0].outlet_measured_savings_expenses}</span>
                    </div>
                    <div>
                        <h4>%</h4>
                        <span className="text-slate-400">{currentReport?.outlet?.results && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results[0].outlet_measured_savings_percent}</span>
                    </div>
                    {customerType === 'Outlet' && <> <div>
                        <h4>CO2</h4>
                        <span className="text-slate-400">{currentReport?.outlet?.results && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results[0].co2_savings_kg}</span>
                    </div>
                        <div>
                            <h4>Savings @</h4>
                            <span className="text-slate-400">{currentReport?.outlet?.results && currentReport?.outlet?.results.length > 0 && currentReport?.outlet?.results[0].savings_tariff_expenses}</span>
                        </div> </>}
                </div>
            </div>
            {
                customerType === 'Outlet' ?
                    <div className="edit-sub-container">
                        <div className="flex bg-slate-200 p-4 items-center justify-between">
                            <h2><b>Equipment Performance</b></h2>
                            <span><b>{currentReport?.month}. {currentReport?.year}</b></span>
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
                                    <span className="text-slate-400">$ 100,900</span>
                                </div>
                                <div>
                                    <h4>Energy Savings per year</h4>
                                    <span className="text-slate-400">225,700</span>
                                </div>
                                <div>
                                    <h4>Planted Trees per year</h4>
                                    <span className="text-slate-400">3,730</span>
                                </div>
                                <div>
                                    <h4>Meals sold per year</h4>
                                    <span className="text-slate-400">201,800</span>
                                </div>
                            </div>
                        </div>
                    </div>
            }

        </div>
    </div >);
}

export default ReportEdit;