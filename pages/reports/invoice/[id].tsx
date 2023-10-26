import { gql, useLazyQuery, useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import moment from "moment";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { getInDecimal, median } from "../../../common/helper";
import { invoice, outlet, results } from "../../../types/datatype";

const InvoiceReport: NextPage = () => {
    const router = useRouter();
    const [invoice, setInvoice] = React.useState<invoice>({} as invoice);
    const [lstResults, setLstResults] = React.useState<results[]>([]);
    const { id, month, year } = router.query;
    const momentDate = moment(`01/${month}/${year}`, 'DD/MM/YYYY');

    const getResultsQuery = gql`
    query FindManyResults($where: ResultsWhereInput, $outletMonthWhere2: Outlet_monthWhereInput) {
        findManyResults(where: $where) {
          outlet_measured_savings_kWh
          outlet_measured_savings_expenses
          outlet_measured_savings_percent
          co2_savings_kg
          tp_sales_expenses
          outlet {
            name
            outlet_month(where: $outletMonthWhere2) {
                last_avail_tariff
            }
          }
        }
      }
    `;

    const getResultsVariable = {
        'variables': {
            "where": {
                "AND": [
                    {
                        "outlet_id": {
                            "in": invoice ? eval(invoice.outlet_ids) : []
                        },
                        "outlet_date": {
                            "contains": month + "/" + year
                        }
                    }
                ]
            },
            "outletMonthWhere2": {
                "outlet_date": {
                    "contains": month + "/" + year
                }
            }
        },
        'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
    }

    const getInvoiceQuery = gql`
    query FindFirstInvoice($where: InvoiceWhereInput) {
        findFirstInvoice(where: $where) {
          month
          year
          group_id
          invoice_id
          customer_id
          last_available_tariff
          outlet_measured_savings_kWh
          outlet_measured_savings_expenses
          outlet_measured_savings_percent
          eqpt_energy_usage_without_TP_month_kW
          eqpt_energy_usage_without_TP_month_expenses
          eqpt_energy_usage_with_TP_month_kW
          eqpt_energy_usage_with_TP_month_expenses
          outlet_ids
          outlet_count
          customer {
            name
          }
          group {
            group_name
          }
        }
      }`;

    const getInvoiceVariable = {
        'variables': {
            "where": {
                "invoice_id": {
                    "equals": id && typeof id === 'string' ? Number(id) : 0
                },
            },
        },
        onCompleted: (data: any) => {
            if (data && data.findFirstInvoice) {
                setInvoice(data.findFirstInvoice);
            }

        },
        'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
    }

    const invoiceResults = useLazyQuery(getInvoiceQuery, getInvoiceVariable);

    React.useEffect(() => {
        if (id && typeof id === 'string') {
            if (Number(id) !== 0) {
                invoiceResults[0]();
            }
        }
    }, [id]);

    React.useEffect(() => {
        if (invoice.outlet_ids) {
            getResults[0]().then(res => {
                setLstResults(res.data.findManyResults);
            })
        }
    }, [invoice.outlet_ids])

    const getResults = useLazyQuery(getResultsQuery, getResultsVariable);

    const getTotal = React.useMemo(() => {
        if (lstResults && lstResults.length > 0) {

            let totalKwh = 0;
            let totalExpense = 0;
            let totalPercent: number[] = [];
            let totalCo2 = 0;
            let totalSF = 0;

            lstResults.forEach(res => {
                totalKwh += getInDecimal(Number(res.outlet_measured_savings_kWh));
                totalExpense += getInDecimal(Number(res.outlet_measured_savings_expenses), 2);
                totalPercent.push(Number(res.outlet_measured_savings_percent));
                totalCo2 += getInDecimal(Number(res.co2_savings_kg));
                totalSF += getInDecimal(Number(res.tp_sales_expenses));
            })

            return <tr id="tFoot" className="font-bold">
                <td className="text-right">
                    TOTAL
                </td>
                <td>
                </td>
                <td>
                    {totalKwh.toLocaleString()} kWh
                </td>
                <td>
                    <div className="flex flex-row justify-between h-full">
                        <span>$</span>
                        <span>{totalExpense.toLocaleString()}</span>
                    </div>

                </td>
                <td>
                    {getInDecimal(median(totalPercent) * 100)}%
                </td>
                <td>
                    {totalCo2.toLocaleString()} kg
                </td>
                <td>
                    <div className="flex flex-row justify-between h-full">
                        <span>$</span>
                        <span>{totalSF.toLocaleString()}</span>
                    </div>

                </td>
            </tr>
        } else {
            return <></>
        }

    }, [lstResults])

    return <React.Fragment>
        <div className="flex flex-row-reverse">
            <img className="float-right h-12 w-48" src={'/asserts/main/logo.svg'} width={100} height={100} />
        </div>
        <div className="flex flex-col gap-y-4 mt-6">
            <span>Here is our Tablepointer Energy Savings Report for your reference:</span>
            <span>
                The amount of CO2 emissions that {(invoice && invoice.customer) ? invoice.customer.name : 'customer name not found!'} reduced in {momentDate.format('MMMM YYYY')} is equivalent to planting {'311'} trees and waiting for them to grow over 10 years!
            </span>
            <span>
                You are a leading substainable {`F&B`} company in Southeast Asia!
            </span>
            <span>
                Thank you for your support.
                <br />
                Should you have any questions, please feel free to contact us at accounts.sg@tablepointer.com.
            </span>
        </div>
        <div className="flex flex-col gap-y-2 mt-4 text-xs">
            <span>{(invoice && invoice.customer) ? invoice.customer.name : 'customer name not found!'}</span>
            <span>{momentDate.format('MMMM YYYY')}</span>
            <table className="invoice-table w-auto text-xs table-fixed">
                <thead>
                    <tr>
                        <th className="w-3/12" rowSpan={2}></th>
                        <th className="w-1/12">Last Avail. Tariff</th>
                        <th colSpan={3} className="w-5/12">Measured Energy Savings (Month)</th>
                        <th className="w-1/12">CO<sup>2</sup> Savings (Month)</th>
                        <th className="w-2/12">Service Fee</th>
                    </tr>
                    <tr>
                        <th>$/kWh</th>
                        <th className="w-1/12">kWh</th>
                        <th className="w-1/12">$</th>
                        <th className="w-1/12">%</th>
                        <th className="w-1/12">kg</th>
                        <th className="w-1/12">$</th>
                    </tr>


                </thead>
                <tbody>
                    {lstResults && lstResults.map((result: results, index: number) => {
                        return (<React.Fragment key={"frag" + index}>
                            <tr>
                                <td>
                                    {result.outlet?.name}
                                </td>
                                <td>
                                    <div className="flex flex-row justify-between h-full">
                                        <span>$</span>
                                        <span>{result.outlet && result.outlet.outlet_month && result.outlet.outlet_month.reduce((prev, current) => Number(current.last_avail_tariff) + Number(prev), 0).toFixed(4)}</span>
                                    </div>

                                </td>
                                <td>
                                    {getInDecimal(parseFloat(result.outlet_measured_savings_kWh || "0"), 0)}
                                </td>
                                <td>
                                    <div className="flex flex-row justify-between h-full">
                                        <span>$</span>
                                        <span>{getInDecimal(parseFloat(result.outlet_measured_savings_expenses || "0"), 2)}</span>
                                    </div>

                                </td>
                                <td>
                                    {getInDecimal(parseFloat(result.outlet_measured_savings_percent || "0") * 100)}%
                                </td>
                                <td>
                                    {getInDecimal(parseFloat(result.co2_savings_kg || "0"))}
                                </td>
                                <td>
                                    <div className="flex flex-row justify-between h-full">
                                        <span>$</span>
                                        <span>{getInDecimal(parseFloat(result.tp_sales_expenses || "0"))}</span>
                                    </div>

                                </td>
                            </tr>
                        </React.Fragment>)
                    })}

                    {getTotal}
                </tbody>
                <tfoot>

                </tfoot>
            </table>
        </div>

    </React.Fragment>
}

export default InvoiceReport;