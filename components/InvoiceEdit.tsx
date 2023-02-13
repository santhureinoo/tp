import { dummySummaryBillingTableData, dummySummaryOutletTableData } from "../common/constant";
import PillButton from "./PillButton";
import SummaryTable from "./SummaryTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { invoice, outlet, results } from "../types/datatype";
import React from "react";
import { gql, useLazyQuery, WatchQueryFetchPolicy } from "@apollo/client";
import DropdownMenu from "./DropdownMenu";
import { useRouter } from 'next/router';
import axios from "axios";
import { downloadFile } from "../common/helper";


interface Props {
    openReportEdit: boolean;
    afterOperation?: () => void;
    invoice?: invoice;
    setOpenReportEdit(openReportEdit: boolean): void;
}

const InvoiceEdit = ({ openReportEdit, setOpenReportEdit, invoice, afterOperation }: Props) => {

    const [outlets, setOutlets] = React.useState<outlet[]>([]);
    const [openInvoiceBtn, setOpenInvoiceBtn] = React.useState(false);
    const router = useRouter();

    const getOutletsQuery = gql`
    query Outlets($where: Outlet_monthWhereInput, $outletsWhere2: OutletWhereInput, $resultsWhere2: ResultsWhereInput) {
        outlets(where: $outletsWhere2) {
          results(where: $resultsWhere2) {
            tp_sales_expenses
            outlet_measured_savings_expenses
            outlet_measured_savings_kWh
            outlet_measured_savings_percent
            outlet_eqpt_energy_usage_with_TP_month_expenses
            outlet_eqpt_energy_usage_with_TP_month_kW
            outlet_eqpt_energy_usage_without_TP_month_expenses
            outlet_eqpt_energy_usage_without_TP_month_kW
            co2_savings_kg
            outlet_date
          }
          name
          outlet_month(where: $where) {
            last_avail_tariff
            outlet_date
          }
        }
      }`;
    const getOutletsResult = useLazyQuery(getOutletsQuery);

    const getSummaryTable = React.useMemo(() => {
        let elems: any = [];
        if (outlets) {
            outlets.forEach((out, i) => {
                elems.push([out.name,
                <span key={'frag span ' + i}><span className="text-custom-xs">$</span>{out.outlet_month?.reduce((acc, obj) => acc + parseInt(obj.last_avail_tariff || '0'), 0)}</span>,
                <div key={'frag div ' + i} className="flex flex-row gap-x-2">
                    <span>{out.results?.reduce((acc, obj) => acc + parseInt(obj.outlet_measured_savings_kWh || '0'), 0)}<span className="text-custom-xs">kWh</span></span>
                    <span><span className="text-custom-xs">$</span>{out.results?.reduce((acc, obj) => acc + parseInt(obj.outlet_measured_savings_expensesd || '0'), 0)}</span>
                    <span>{out.results?.reduce((acc, obj) => acc + parseInt(obj.outlet_measured_savings_percent || '0'), 0)}<span className="text-custom-xs">%</span></span></div>,
                <span key={'frag span ' + i}>{out.results?.reduce((acc, obj) => acc + parseInt(obj.co2_savings_kg || '0'), 0)}<span className="text-custom-xs">kg</span></span>, <span key={'frag span ' + i}><span className="text-custom-xs">$</span>{out.results?.reduce((acc, obj) => acc + parseInt(obj.tp_sales_expenses || '0'), 0)}</span>]);
            })
        }

        return elems;
    }, [outlets]);

    React.useEffect(() => {
        if (invoice && openReportEdit) {
            getOutletsResult[0]({
                'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy,
                "variables": {
                    "where": {
                        "outlet_date": {
                            // "endsWith": `${invoice.month}/${invoice.year}`
                            "endsWith": '2022',
                            "startsWith": '01'
                        }
                    },
                    "outletsWhere2": {
                        "outlet_id": {
                            "in": JSON.parse(invoice.outlet_ids),
                        }
                    },
                    "resultsWhere2": {
                        "outlet_date": {
                            // "endsWith": `${invoice.month}/${invoice.year}`
                            "endsWith": '2022',
                            "startsWith": '01'
                        }
                    }
                }
            }).then(res => {
                if (res.data && res.data.outlets) {
                    setOutlets(res.data.outlets);
                }
            })
        }

    }, [invoice, openReportEdit]);



    return (
        <React.Fragment>
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
                                <button type="button" onClick={(e) => { setOpenInvoiceBtn(!openInvoiceBtn) }} className={`text-white relative font-medium rounded-lg text-sm px-5 py-5 inline-flex items-center`}>
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
                                            }
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
                            <span className="text-slate-300">{invoice?.customer?.name} </span>
                        </div>
                        <div>
                            <h4>Live Outlets</h4>
                            <span className="text-slate-300">{invoice?.outlet_count}</span>
                        </div>
                        <div>
                            <h4>Pte Ltd Address</h4>
                            <span className="text-slate-300">{invoice?.customer?.current_address} </ span >
                        </div>

                        <div>
                            <h4>Last Available Tariff</h4>
                            <span className="text-slate-300">{invoice?.last_available_tariff}</span>
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
                                <span className="text-slate-300">{invoice?.eqpt_energy_usage_without_TP_month_kW}</span>
                            </div>
                            <div>
                                <h4>$</h4>
                                <span className="text-slate-300">{invoice?.eqpt_energy_usage_without_TP_month_expenses}</span>
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
                                <span className="text-slate-300">{invoice?.eqpt_energy_usage_with_TP_month_kW}</span>
                            </div>
                            <div>
                                <h4>$</h4>
                                <span className="text-slate-300">{invoice?.eqpt_energy_usage_with_TP_month_expenses}</span>
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
                            <span className="text-slate-300">{invoice?.outlet_measured_savings_kWh}</span>
                        </div>
                        <div>
                            <h4>$</h4>
                            <span className="text-slate-300">{invoice?.outlet_measured_savings_expenses}</span>
                        </div>
                        <div>
                            <h4>%</h4>
                            <span className="text-slate-300">{invoice?.outlet_measured_savings_percent}</span>
                        </div>
                        <div>
                            <h4>CO2</h4>
                            <span className="text-slate-300">{invoice?.co2_savings_kg}</span>
                        </div>
                        <div>
                            <h4>Savings @</h4>
                            <span className="text-slate-300">{invoice?.savings_tariff_expenses}</span>
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
        </React.Fragment>
    )

}

export default InvoiceEdit;