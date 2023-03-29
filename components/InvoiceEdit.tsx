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
import { downloadFile, monthNumToStr } from "../common/helper";
import { Oval } from "react-loader-spinner";


interface Props {
    openReportEdit: boolean;
    afterOperation?: () => void;
    invoice?: invoice;
    setOpenReportEdit(openReportEdit: boolean): void;
    month: string;
    year: string;
}

const InvoiceEdit = ({ openReportEdit, setOpenReportEdit, invoice, afterOperation, month, year }: Props) => {

    const [outlets, setOutlets] = React.useState<outlet[]>([]);
    const [openInvoiceBtn, setOpenInvoiceBtn] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
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
            savings_tariff_expenses
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
                            "contains": month + "/" + year
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
                            "contains": month + "/" + year
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

    const savingCo2 = React.useMemo(() => {
        console.log(outlets);
        let co2 = 0;
        let saving = 0;
        if (outlets && outlets.length > 0) {
            outlets.forEach(out => {
                out.results?.forEach(res => {
                    co2 += Number(res.co2_savings_kg);
                    saving += Number(res.savings_tariff_expenses);
                })
            })

        } return {
            'co2': co2,
            'saving': saving,
        }
    }, [outlets])

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
                                <button type="button" onClick={(e) =>  { !loading && setOpenInvoiceBtn(!openInvoiceBtn)
                                }} className={`text-white bg-blue-500 hover:bg-blue-600 relative font-medium rounded-lg text-sm text-center w-48 px-2 py-5 items-cente`}>
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
                                    /> : 'Download Invoice'}
                                    <div className={`${openInvoiceBtn ? 'absolute' : 'hidden'} z-20 top-16 left-0 w-full`}>
                                        <DropdownMenu options={[
                                            {
                                                "text": "Invoice",
                                                "onClick": () => {
                                                    setLoading(true)
                                                    axios.get(
                                                        '/api/download',
                                                        {
                                                            responseType: 'arraybuffer',
                                                            params: {
                                                                type: 'invoice',
                                                                id: invoice?.invoice_id,
                                                                month: month,
                                                                year: year,
                                                            }
                                                        } // !!!
                                                    ).then((response) => {
                                                        downloadFile(response.data, 'Invoice Report');
                                                    }).finally(()=>{
                                                        setLoading(false);
                                                    })
                                                },
                                                "css": "",
                                            }
                                        ]} />
                                    </div>
                                </button>

                            </div>

                            {/* <button type="button" onClick={(e) => { }} className={`text-white ${billingData && billingData.STA === 'Generated' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'} font-medium rounded-lg text-sm px-5 py-5 items-center`}>
                                Download Invoice
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

                            <span><b>{month + '.' + year}</b></span>
                        </div>
                        <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                            <div>
                                <h4>kWh</h4>
                                <span className="text-slate-300">{Number(invoice?.eqpt_energy_usage_without_TP_month_kW).toFixed(2)}</span>
                            </div>
                            <div>
                                <h4>$</h4>
                                <span className="text-slate-300">{Number(invoice?.eqpt_energy_usage_without_TP_month_expenses).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="edit-sub-container">
                        <div className="flex bg-slate-200 p-4 items-center justify-between">
                            <div>
                                <h2><b>Energy Usage</b></h2>
                                <span><b>With TablePointer</b></span>
                            </div>

                            <span><b>{month + '.' + year}</b></span>
                        </div>
                        <div className="grid grid-cols-1 gap-x-2 gap-y-8">
                            <div>
                                <h4>kWh</h4>
                                <span className="text-slate-300">{Number(invoice?.eqpt_energy_usage_with_TP_month_kW).toFixed(2)}</span>
                            </div>
                            <div>
                                <h4>$</h4>
                                <span className="text-slate-300">{Number(invoice?.eqpt_energy_usage_with_TP_month_expenses).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="edit-sub-container">
                    <div className="flex bg-slate-200 p-4 items-center justify-between">
                        <h2><b>Measured Energy Savings</b></h2>
                        <span><b>{month + '.' + year}</b></span>
                    </div>
                    <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                        <div>
                            <h4>kWh</h4>
                            <span className="text-slate-300">{Number(invoice?.outlet_measured_savings_kWh).toFixed(2)}</span>
                        </div>
                        <div>
                            <h4>$</h4>
                            <span className="text-slate-300">{Number(invoice?.outlet_measured_savings_expenses).toFixed(2)}</span>
                        </div>
                        <div>
                            <h4>%</h4>
                            <span className="text-slate-300">{Math.round(Number(invoice?.outlet_measured_savings_percent))}</span>
                        </div>
                        <div>
                            <h4>CO2</h4>
                            <span className="text-slate-300">{Number(savingCo2.co2).toFixed(2)}</span>
                        </div>
                        <div>
                            <h4>Savings @</h4>
                            <span className="text-slate-300">{Number(savingCo2.saving).toFixed(2)}</span>
                        </div>

                    </div>
                </div>
                <div className="edit-sub-container">
                    <div className="flex bg-slate-200 p-4 items-center justify-between">
                        <h2><b>Outlet Savings</b></h2>
                        <span><b>{month + '.' + year}</b></span>
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