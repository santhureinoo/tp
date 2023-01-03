import {
    Chart as ChartJS,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { NextPage } from "next";
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import React from 'react';
import { group, reports } from '../../../types/datatype';
import { report } from 'process';
import axios from 'axios';
import { downloadFile } from '../../../common/helper';


ChartJS.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
);


const GroupReport: NextPage = () => {

    const router = useRouter();
    const [reportAttributes, setReportAttributes] = React.useState({
        outletCount: 0,
        eqptWoTP: 0,
        eqptWoTPExpense: 0,
        eqptWTP: 0,
        eqptWTPExpense: 0,
        measuredEnergySavingsKWH: 0,
        measuredEnergySavingsExpense: 0,
        measuredEnergySavingsPercent: 0,
        savingTariff: 0,
        groupName: "",
    });
    const { id, month, year } = router.query;

    const getGroupQuery = gql`
    query FindManyReports($where: ReportsWhereInput, $resultsWhere2: ResultsWhereInput) {
        findManyReports(where: $where) {
          customer {
            outlet {
              name
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

    const getGroupVariable = {
        'variables': {
            "where": {
                "group_id": {
                    "equals": id && typeof id === 'string' ? Number(id) : 0
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
    }

    const getGroupResult = useQuery(getGroupQuery, getGroupVariable);

    React.useEffect(() => {
        if (getGroupResult.data && getGroupResult.data.findManyReports) {
            let attributes = {
                outletCount: 0,
                eqptWoTP: 0,
                eqptWoTPExpense: 0,
                eqptWTP: 0,
                eqptWTPExpense: 0,
                measuredEnergySavingsKWH: 0,
                measuredEnergySavingsExpense: 0,
                measuredEnergySavingsPercent: 0,
                savingTariff: 0,
                groupName: "",
            };

            const reports: reports[] = getGroupResult.data.findManyReports;
            reports.forEach(rep => {
                if (rep.customer) {
                    if (rep.customer.outlet) {
                        rep.customer.outlet.forEach(outlet => {
                            axios.get(
                                '/api/download',
                                {
                                    responseType: 'blob',
                                    params: {
                                        type: 'group_annex',
                                        id: outlet.outlet_id,
                                        month: month,
                                        year: year,
                                    }
                                } // !!!
                            ).then((response) => {
                                downloadFile(response.data, 'Group (Annax) Report');
                            });
                            attributes.outletCount += 1;
                            outlet.results && outlet.results.forEach(result => {
                                attributes.eqptWTP += Number(result.outlet_eqpt_energy_usage_with_TP_month_kW);
                                attributes.eqptWTPExpense += Number(result.outlet_eqpt_energy_usage_with_TP_month_expenses);
                                attributes.eqptWoTP += Number(result.outlet_eqpt_energy_usage_without_TP_month_kW);
                                attributes.eqptWoTPExpense += Number(result.outlet_eqpt_energy_usage_without_TP_month_expenses);
                                attributes.savingTariff += Number(result.savings_tariff_expenses);
                                attributes.measuredEnergySavingsExpense += Number(result.outlet_measured_savings_expenses);
                                attributes.measuredEnergySavingsKWH += Number(result.outlet_measured_savings_kWh);
                                attributes.measuredEnergySavingsPercent += Number(result.outlet_measured_savings_percent);
                            })
                        })
                    }
                }
            })

            setReportAttributes(attributes);
        }
    }, [getGroupResult.data]);

    return <div>
        <div>
            <h1 className='report-main-header-text'>
                {"Portfolio Savings & Substainability"}
            </h1>
            <span>
                {"Burger King Holdings"}
            </span>
            <span>
                {"August 2022"}
            </span>
            {/* <table>
                <tr>
                    <td>
                        hi
                    </td>
                </tr>
            </table> */}
        </div>
        <div>
            <table className="report-table">
                <thead>
                    <tr>
                        <td rowSpan={2} className="col-span-2">
                            No. of Live Outlets
                        </td>
                        <td colSpan={2} className="row-span-2">
                            <span>Eqpt.Energy Usage</span>
                            <span>W/O TablePointer (Month)</span>
                        </td>
                        <td colSpan={2} className="row-span-2">
                            <span>Eqpt.Energy Usage</span>
                            <span>WITH TablePointer (Month)</span>
                        </td>
                        <td colSpan={3} className="row-span-2">
                            <span>Measured Energy Savings</span>
                            <span>(Month)</span>
                        </td>
                        <td className="row-span-2">
                            <span>Savings @</span>
                            <span>Tariff</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            kWh
                        </td>
                        <td>
                            $
                        </td>
                        <td>
                            kWh
                        </td>
                        <td>
                            $
                        </td>
                        <td>
                            kWh
                        </td>
                        <td>
                            $
                        </td>
                        <td>
                            %
                        </td>
                        <td>
                            <span>$</span>
                            <span>0.3228</span>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {reportAttributes.outletCount}
                        </td>
                        <td>
                            {reportAttributes.eqptWTP}
                        </td>
                        <td>
                            <div className='flex flex-row justify-between'>
                                <span>$</span> <span>{reportAttributes.eqptWTPExpense}</span>
                            </div>

                        </td>
                        <td>
                            {reportAttributes.eqptWoTP}
                        </td>
                        <td>
                            <div className='flex flex-row justify-between'>
                                <span>$</span> <span>{reportAttributes.eqptWoTPExpense}</span>
                            </div>

                        </td>
                        <td>
                            {reportAttributes.measuredEnergySavingsKWH}
                        </td>
                        <td>
                            <div className='flex flex-row justify-between'>
                                <span>$</span> <span>{reportAttributes.measuredEnergySavingsExpense}</span>
                            </div>
                        </td>
                        <td>
                            {reportAttributes.measuredEnergySavingsPercent}%
                        </td>
                        <td>
                            <div className='flex flex-row justify-between'>
                                <span>$</span><span>{reportAttributes.savingTariff}</span>
                            </div>

                        </td>
                    </tr>
                </tbody>


            </table>
            <span className="text-xs">*26% savings generated and within benchmark</span>
        </div>
        <div className='block'>
            <p className='report-text mb-2'>
                Annually Unlocked :
            </p>
            <div className='flex flex-row gap-x-4 text-report-non-table-text justify-center'>
                <div className='flex flex-col'>
                    <span>$100,900</span>
                    <span>energy savings per year</span>
                </div>
                <div className='flex flex-col'>
                    <span>$100,900</span>
                    <span>kg CO<sup>2</sup> saved per year</span>
                </div>
                <div className='flex flex-col'>
                    <span>3,730</span>
                    <span>tree per years and wait 10 years</span>
                </div>
                <div className='flex flex-col'>
                    <span>201,800</span>
                    <span>meals to be sold per year</span>
                </div>
            </div>
        </div>
        {/* <div className='w-100 h-[200px]'>
            <Chart type='bar' data={stackBarChart} options={stackBarOption} />
        </div> */}
    </div>
}
export default GroupReport