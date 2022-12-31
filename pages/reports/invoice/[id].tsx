import { gql, useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { median } from "../../../common/helper";
import { outlet } from "../../../types/datatype";

const InvoiceReport: NextPage = () => {
    const router = useRouter();
    const { id, month, year } = router.query;

    const getFirstCustomerQuery = gql`
    query findFirstCustomerQuery($where: CustomerWhereInput) {
        findFirstCustomer(where: $where) {
          outlet {
            name
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

    const getFirstCustomerVariable = {
        'variables': {
            "where": {
                "group_id": {
                    "equals": id && typeof id === 'string' ? Number(id) : 0
                },
            },
            ...(month && year && month !== 'All' && year !== 'All') && {
                "outletWhere2": {
                    "reports": {
                        "some": {
                            "year": {
                                "equals": year
                            },
                            "month": {
                                "equals": month
                            }
                        }
                    }
                }
            }
        },
        'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
    }

    const getCustomerResult = useQuery(getFirstCustomerQuery, getFirstCustomerVariable);

    const getTotal = React.useMemo(() => {
        if (getCustomerResult.data && getCustomerResult.data.findFirstCustomer &&
            getCustomerResult.data.findFirstCustomer.outlet) {

            const outlets: outlet[] = getCustomerResult.data.findFirstCustomer.outlet;

            let totalKwh = 0;
            let totalExpense = 0;
            let totalPercent: number[] = [];
            let totalCo2 = 0;
            let totalSF = 0;

            outlets.forEach(out => {
                if (out.results) {
                    totalKwh += Number(out.results[0].outlet_measured_savings_kWh);
                    totalExpense += Number(out.results[0].outlet_measured_savings_expenses);
                    totalPercent.push(Number(out.results[0].outlet_measured_savings_percent));
                    totalCo2 += Number(out.results[0].co2_savings_kg);
                    totalSF += Number(out.results[0].tp_sales_expenses);
                }
            })

            return <tr className="font-bold">
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
                    {median(totalPercent)}%
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
            return <tr></tr>
        }

    }, [getCustomerResult.data])

    return <React.Fragment>
        <div className="flex flex-row-reverse">
            <img className="float-right h-12 w-48" src={'/asserts/main/logo.svg'} width={100} height={100} />
        </div>
        <div className="flex flex-col gap-y-4 mt-6">
            <span>Here is our Tablepointer Energy Savings Report for your reference:</span>
            <span>
                The amount of CO2 emissions that Burger King Singapore Pte ltd reduced...
                <br />
                The amount of CO2 emissions that Burger King Singapore Pte ltd reduced...
            </span>
        </div>
        <div className="flex flex-col gap-y-2 mt-4 text-xs">
            <span>Burger King Singapore Pte Ltd</span>
            <span>August 2022</span>
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
                    {/* <tr>
                        <td>
                            Burger King (Kebun Baru Community Club)
                        </td>
                        <td>
                            <div className="flex flex-row justify-between h-full">
                                <span>$</span>
                                <span>0.3486</span>
                            </div>

                        </td>
                        <td>
                            709
                        </td>
                        <td>
                            <div className="flex flex-row justify-between h-full">
                                <span>$</span>
                                <span>247.31</span>
                            </div>

                        </td>
                        <td>
                            23%
                        </td>
                        <td>
                            503
                        </td>
                        <td>
                            <div className="flex flex-row justify-between h-full">
                                <span>$</span>
                                <span>123.66</span>
                            </div>

                        </td>
                    </tr> */}
                    {getCustomerResult.data &&
                        getCustomerResult.data.findFirstCustomer &&
                        getCustomerResult.data.findFirstCustomer.outlet &&
                        getCustomerResult.data.findFirstCustomer.outlet.map((outl: outlet, index: number) => {
                            return (<React.Fragment key={"frag" + "index"}>
                                <tr>
                                    <td>
                                        {outl.name}
                                    </td>
                                    <td>
                                        <div className="flex flex-row justify-between h-full">
                                            <span>$</span>
                                            <span>{outl.outlet_month && outl.outlet_month[0].last_avail_tariff}</span>
                                        </div>

                                    </td>
                                    <td>
                                        {outl.results && outl.results[0].outlet_measured_savings_kWh}
                                    </td>
                                    <td>
                                        <div className="flex flex-row justify-between h-full">
                                            <span>$</span>
                                            <span>{outl.results && outl.results[0].outlet_measured_savings_expenses}</span>
                                        </div>

                                    </td>
                                    <td>
                                        {outl.results && outl.results[0].outlet_measured_savings_percent}%
                                    </td>
                                    <td>
                                        {outl.results && outl.results[0].co2_savings_kg}
                                    </td>
                                    <td>
                                        <div className="flex flex-row justify-between h-full">
                                            <span>$</span>
                                            <span>{outl.results && outl.results[0].tp_sales_expenses}</span>
                                        </div>

                                    </td>
                                </tr>
                            </React.Fragment>)
                        })}

                </tbody>
                <tfoot>
                    {getTotal}
                </tfoot>
            </table>
        </div>

    </React.Fragment>
}

export default InvoiceReport;