import { dummySummaryBillingTableData, dummySummaryOutletTableData } from "../common/constant";
import PillButton from "./PillButton";
import SummaryTable from "./SummaryTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { outlet, results } from "../types/datatype";
import React from "react";
import { gql, useLazyQuery, WatchQueryFetchPolicy } from "@apollo/client";
import DropdownMenu from "./DropdownMenu";
import { useRouter } from 'next/router';
import axios from "axios";
import { downloadFile } from "../common/helper";


interface Props {
    openReportEdit: boolean;
    afterOperation?: () => void;
    billingData: any;
    result?: results;
    setOpenReportEdit(openReportEdit: boolean): void;
}

const InvoiceEdit = ({ openReportEdit, setOpenReportEdit, result, afterOperation, billingData }: Props) => {

    const [currentOutlet, setCurrentOutlet] = React.useState<outlet>();
    const [currentResult, setCurrentResult] = React.useState<results>();
    const [openInvoiceBtn, setOpenInvoiceBtn] = React.useState(false);
    const router = useRouter();
    const getResultQuery = gql`
    query FindFirstResults($where: ResultsWhereInput, $outletMonthWhere2: Outlet_monthWhereInput, $resultsWhere2: ResultsWhereInput) {
        findFirstResults(where: $where) {
          outlet {
            name
            customer {
              pte_ltd_name
            }
            outlet_device_ac_input {
                od_device_input_id
            }
            outlet_device_ex_fa_input {
                od_device_input_id
                device_type
            }
            outlet_address
            outlet_month(where: $outletMonthWhere2) {
              last_avail_tariff
            }
            results(where: $resultsWhere2) {
              acmv_measured_savings_kWh
              outlet_measured_savings_kWh
              outlet_measured_savings_expenses
              outlet_measured_savings_percent
              ke_eqpt_energy_usage_without_TP_month_kW
              ac_eqpt_energy_usage_without_TP_month_kW
              outlet_eqpt_energy_usage_without_TP_month_kW
              outlet_eqpt_energy_usage_without_TP_month_expenses
              ke_eqpt_energy_usage_with_TP_month_kW
              ac_eqpt_energy_usage_with_TP_month_kW
              outlet_eqpt_energy_usage_with_TP_month_kW
              outlet_eqpt_energy_usage_with_TP_month_expenses
              acmv_25percent_benchmark_comparison_kWh
              acmv_25percent_benchmark_comparison_expenses
              acmv_10percent_benchmark_comparison_kWh
              acmv_10percent_benchmark_comparison_expenses
              ke_and_ac_25percent_benchmark_comparison_kWh
              ke_and_ac_25percent_benchmark_comparison_expenses
              co2_savings_kg
              savings_tariff_expenses
            }
          }
        }
      }
    `;

    const getResultVariable = React.useMemo(() => {
        return {
            'variables': {
                "where": {
                    "outlet_date": {
                        "equals": result?.outlet_date
                    }
                },
                "outletMonthWhere2": {
                    "outlet_date": {
                        "equals": result?.outlet_date
                    }
                },
                "resultsWhere2": {
                    "outlet_date": {
                        "equals": result?.outlet_date
                    }
                }
            }
        }
    }, [result]);

    const getFirstCustomerQuery = gql`
    query findFirstCustomerQuery($where: CustomerWhereInput) {
        findFirstCustomer(where: $where) {
          outlet {
            name
            outlet_id
            outlet_month {
              last_avail_tariff
            }
            results {
              outlet_measured_savings_expenses
              outlet_measured_savings_kWh
              outlet_measured_savings_percent
              co2_savings_kg
              tp_sales_expenses
            }
          }
        }
      }`;

    // const getFirstCustomerVariable = {
    //     'variables': {
    //         "where": {
    //             "group_id": {
    //                 "equals": id && typeof id === 'string' ? Number(id) : 0
    //             },
    //         },
    //         ...(month && year && month !== 'All' && year !== 'All') && {
    //             "outletWhere2": {
    //                 "reports": {
    //                     "some": {
    //                         "year": {
    //                             "equals": year
    //                         },
    //                         "month": {
    //                             "equals": month
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
    // }

    const getResultResult = useLazyQuery(getResultQuery, getResultVariable);
    const getFirstCustomerResult = useLazyQuery(getFirstCustomerQuery);

    React.useEffect(() => {
        if (result && result.outlet_date !== '') {
            getResultResult[0]().then(result => {
                if (result.data && result.data.findFirstResults && result.data.findFirstResults.outlet) {
                    setCurrentOutlet(result.data.findFirstResults.outlet);
                    console.log(result.data.findFirstResults.outlet);
                    if (result.data.findFirstResults.outlet && result.data.findFirstResults.outlet.results.length > 0)
                        setCurrentResult(result.data.findFirstResults.outlet.results[0]);
                }

            })
        } else {
            setCurrentOutlet(undefined);
            setCurrentResult(undefined);
        }
    }, [result]);

    const getSummaryTable = React.useMemo(() => {
        let elems = [];
        for (let i = 0; i < 8; i++) {
            elems.push(["KFC Sarinah", <span key={'frag ' + i}><sub>$</sub> 0.349</span>, <div key={'frag div ' + i} className="flex flex-row gap-x-2"><span>749<sub>kWh</sub></span><span><sub>$</sub>247,31</span><span>23<sub>%</sub></span></div>, '503kg', <span key={'frag span ' + i}><sub>$</sub>123.66</span>]);
        }

        return elems;

    }, [currentOutlet]);

    if (billingData) {
        return (
            <div className={` edit-container ${openReportEdit ? "translate-x-0 " : "translate-x-full"}`}>
                <div className="flex justify-end">
                    <button onClick={(e) => { setOpenReportEdit(!openReportEdit) }} className={`w-8 h-8`} type='button'>
                        <FontAwesomeIcon style={{ fontSize: '2em', cursor: 'pointer' }} icon={faCircleXmark} />
                    </button>
                </div>
                <div className="space-y-6 pt-6">
                    <div className="pb-6 space-y-4">
                        <div className="flex text-lg justify-between">
                            <div>
                                <h1><b>Invoice ID</b></h1>
                                <h5>EQ-2405</h5>
                            </div>
                            <div className="flex gap-x-2">
                                <div className="">
                                    <button type="button" onClick={(e) => { setOpenInvoiceBtn(!openInvoiceBtn) }} className={`text-white ${billingData && billingData.STA === 'Generated' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'} relative font-medium rounded-lg text-sm px-5 py-5 inline-flex items-center`}>
                                        Download Invoice
                                        <div className={`${openInvoiceBtn ? 'absolute' : 'hidden'} z-20 top-12 left-0 w-full`}>
                                            <DropdownMenu options={[
                                                {
                                                    "text": "Invoice",
                                                    "onClick": () => {
                                                        axios.get(
                                                            '/api/download',
                                                            {
                                                                responseType: 'arraybuffer',
                                                                params: {
                                                                    type: 'invoice',
                                                                    id: 9,
                                                                    month: "Oct",
                                                                    year: "2021",
                                                                }
                                                            } // !!!
                                                        ).then((response) => {
                                                            downloadFile(response.data, 'Invoice Report');
                                                        })
                                                    },
                                                    "css": "",
                                                },
                                                {
                                                    "text": "Invoice + Outlet Annex",
                                                    "onClick": () => {
                                                        getFirstCustomerResult[0]({
                                                            'variables': {
                                                                "where": {
                                                                    "group_id": {
                                                                        "equals": 9
                                                                    },
                                                                },

                                                                "outletWhere2": {
                                                                    "reports": {
                                                                        "some": {
                                                                            "year": {
                                                                                "equals": "2021"
                                                                            },
                                                                            "month": {
                                                                                "equals": "Oct"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
                                                        }).then(response => {
                                                            if (response.data && response.data.findFirstCustomer &&
                                                                response.data.findFirstCustomer.outlet) {

                                                                const outlets: outlet[] = response.data.findFirstCustomer.outlet;

                                                                outlets.forEach(out => {
                                                                    axios.get(
                                                                        '/api/download',
                                                                        {
                                                                            responseType: 'arraybuffer',
                                                                            params: {
                                                                                type: 'invoice_annex',
                                                                                id: out.outlet_id,
                                                                                month: "Oct",
                                                                                year: "2021",
                                                                            }
                                                                        } // !!!
                                                                    ).then((response) => {
                                                                        downloadFile(response.data, 'Invoice(Annex) Report');
                                                                    })
                                                                })
                                                            }
                                                        })
                                                        axios.get(
                                                            '/api/download',
                                                            {
                                                                responseType: 'arraybuffer',
                                                                params: {
                                                                    type: 'invoice',
                                                                    id: 9,
                                                                    month: "Oct",
                                                                    year: "2021",
                                                                }
                                                            } // !!!
                                                        ).then((response) => {
                                                            downloadFile(response.data, 'Invoice Report');
                                                        })
                                                    },
                                                    "css": "",
                                                },
                                            ]} />
                                        </div>
                                    </button>

                                </div>

                                {/* <button type="button" onClick={(e) => { }} className={`text-white ${billingData && billingData.STA === 'Generated' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'} font-medium rounded-lg text-sm px-5 py-5 items-center`}>
                                    Download Report
                                </button> */}
                            </div>

                        </div>
                        {/* <PillButton className={`${billingData && billingData.STA === 'Generated' ? `text-yellow-600 bg-yellow-500` : `bg-green-300 text-green-500`}  w-40 h-10`} text={`Invoice ${billingData.STA}`} /> */}
                    </div>
                    <div className="edit-sub-container">
                        <div className="flex bg-slate-200 p-4 items-center">
                            <h2><b>Pte Ltd</b> Information</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                            <div>
                                <h4>Pte Ltd</h4>
                                <span className="text-slate-300">{currentOutlet?.customer?.pte_ltd_name} </span>
                            </div>
                            <div>
                                <h4>Outlet Name</h4>
                                <span className="text-slate-300">{currentOutlet?.name}</span>
                            </div>
                            <div>
                                <h4>Outlet Address</h4>
                                <span className="text-slate-300">{currentOutlet?.outlet_address} </ span >
                            </div>

                            <div>
                                <h4>Last Available Tariff</h4>
                                <span className="text-slate-300">{currentOutlet && currentOutlet.outlet_month && currentOutlet.outlet_month.length && currentOutlet.outlet_month[0].last_avail_tariff}</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                        <div className="edit-sub-container">
                            <div className="flex bg-slate-200 p-4 items-center justify-between">
                                <div>
                                    <h2><b>Energy Usage</b></h2>
                                    <span><b>W/O TablePointer</b></span>
                                </div>

                                <span><b>Sept. 2022</b></span>
                            </div>
                            <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                                <div>
                                    <h4>kWh</h4>
                                    <span className="text-slate-300">{result?.outlet_eqpt_energy_usage_without_TP_month_kW}</span>
                                </div>
                                <div>
                                    <h4>$</h4>
                                    <span className="text-slate-300">{result?.outlet_eqpt_energy_usage_without_TP_month_expenses}</span>
                                </div>
                            </div>
                        </div>
                        <div className="edit-sub-container">
                            <div className="flex bg-slate-200 p-4 items-center justify-between">
                                <div>
                                    <h2><b>Energy Usage</b></h2>
                                    <span><b>With TablePointer</b></span>
                                </div>

                                <span><b>Sept. 2022</b></span>
                            </div>
                            <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                                <div>
                                    <h4>kWh</h4>
                                    <span className="text-slate-300">{result?.outlet_eqpt_energy_usage_with_TP_month_kW}</span>
                                </div>
                                <div>
                                    <h4>$</h4>
                                    <span className="text-slate-300">{result?.outlet_eqpt_energy_usage_with_TP_month_expenses}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="edit-sub-container">
                        <div className="flex bg-slate-200 p-4 items-center justify-between">
                            <h2><b>Measured Energy Savings</b></h2>
                            <span><b>Sept. 2022</b></span>
                        </div>
                        <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                            <div>
                                <h4>kWh</h4>
                                <span className="text-slate-300">{currentResult?.outlet_measured_savings_kWh}</span>
                            </div>
                            <div>
                                <h4>$</h4>
                                <span className="text-slate-300">{currentResult?.outlet_measured_savings_expenses}</span>
                            </div>
                            <div>
                                <h4>%</h4>
                                <span className="text-slate-300">{currentResult?.outlet_measured_savings_percent}</span>
                            </div>
                            <div>
                                <h4>CO2</h4>
                                <span className="text-slate-300">{currentResult?.co2_savings_kg}</span>
                            </div>
                            <div>
                                <h4>Savings @</h4>
                                <span className="text-slate-300">{currentResult?.savings_tariff_expenses}</span>
                            </div>

                        </div>
                    </div>
                    <div className="edit-sub-container">
                        <div className="flex bg-slate-200 p-4 items-center justify-between">
                            <h2><b>Outlet Savings</b></h2>
                            <span><b>Sept. 2022</b></span>
                        </div>
                        <div className="grid grid-cols-1 items-center">
                            <div className="w-full flex flex-col overflow-auto max-h-summaryBillingHeight">
                                <SummaryTable headerColor={`bg-slate-100`} headers={["Outlet", "Last Avail.Tariff", "Measured Energy Savings", <span key={'frag_span'}>C0<sub>2</sub></span>, "Service Fee"]} data={getSummaryTable} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (<>
        </>);
    }

}

export default InvoiceEdit;