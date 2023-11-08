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
    Plugin,

} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NextPage } from "next";
import { useRouter } from 'next/router';
import { first_intermediary_table, global_input, group, outlet, reports, secondary_intermediary_table } from '../../../types/datatype';
import React from 'react';
import { gql, useQuery, WatchQueryFetchPolicy } from '@apollo/client';
import { convertDate, getInDecimal, numberWithCommas, render_html_to_canvas } from '../../../common/helper';


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
    ChartDataLabels,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle,
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
    const [globalSetting, setGlobalSetting] = React.useState<global_input>();
    const { id, month, year } = router.query;

    const getGlobalInputQuery = gql`
    query Global_input($where: Global_inputWhereUniqueInput!) {
        global_input(where: $where) {
          poss_tariff_increase
        }
      }`;

    const getGlobalInputVariable = {
        "variables": {
            "where": {
                "global_input_id": 1
            }
        }
    }

    const getOutletQuery = gql`
    query FindFirstOutlet($where: OutletWhereInput, $resultsWhere2: ResultsWhereInput) {
        findFirstOutlet(where: $where) {
          results(where: $resultsWhere2) {
            outlet_id
            outlet_date
            ke_baseline_factor_rg3
            ac_baseline_factor_rg3
            ke_measured_savings_kWh
            ac_measured_savings_kWh
            acmv_measured_savings_kWh
            outlet_measured_savings_kWh
            outlet_measured_savings_expenses
            outlet_measured_savings_percent
            co2_savings_kg
            savings_tariff_expenses
            tp_sales_expenses
            ke_eqpt_energy_baseline_avg_hourly_kW
            ac_eqpt_energy_baseline_avg_hourly_kW
            acmv_eqpt_energy_baseline_avg_hourly_kW
            ke_eqpt_energy_baseline_avg_hourly_as_date
            ac_eqpt_energy_baseline_avg_hourly_as_date
            acmv_eqpt_energy_baseline_avg_hourly_as_date
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
            ke_and_ac_10percent_benchmark_comparison_kWh
            ke_and_ac_10percent_benchmark_comparison_expenses
            monday
            tuesday
            wednesday
            thursday
            friday
            saturday
            sunday
            holiday
          }
          name
        }
      }`;

    const getOutletVariable = {
        'variables': {
            "where": {
                "outlet_id": {
                    "equals": id && typeof id === 'string' ? Number(id) : 0
                }
            },
            ...(month && year && month !== 'All' && year !== 'All') && {
                "resultsWhere2": {
                    "outlet_date": {
                        "contains": month + "/" + year
                    }
                }
            }
        },
        'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
    }

    const getFirstIntermediaryQuery = gql`
    query First_intermediary_tables($where: First_intermediary_tableWhereInput) {
        first_intermediary_tables(where: $where) {
          outlet_id
          outlet_month_year
          day_of_month
          ke_baseline_kW
          ke_without_TP_kWh
          ke_with_TP_kWh
          ke_savings_kWh
          ke_savings_expenses
          ac_baseline_kWh
          ac_without_TP_kWh
          ac_with_TP_kWh
          ac_savings_kWh
          ac_savings_expenses
          all_eqpt_without_TP_kWh
          all_eqpt_with_TP_kWh
          total_savings_kWh
          total_savings_expenses
          ke_ops_hours
          ac_op_hours
        }
      }`;

    const getFirstIntermediaryVariable = {
        'variables': {
            "where": {
                "outlet_id": {
                    "equals": id && typeof id === 'string' ? Number(id) : 0
                },
                ...(month && year && month !== 'All' && year !== 'All') && {
                    "outlet_month_year": {
                        "equals": `${month}/${year}`
                    }
                },

            }
        },
        'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
    }

    const getSecondIntermediaryQuery = gql`
    query Secondary_intermediary_tables($where: Secondary_intermediary_tableWhereInput) {
        secondary_intermediary_tables(where: $where) {
          outlet_id
          outlet_month_year
          day_of_month
          time
          ke_without_TP_kWh
          ke_baseline_kW
          ac_without_TP_kWh
          ac_baseline_kW
          acmv_without_TP_kWh
          acmv_baseline_kW
        }
      }
    `

    const getSecondIntermediaryVariable = {
        'variables': {
            "where": {
                "outlet_id": {
                    "equals": id && typeof id === 'string' ? Number(id) : 0
                },
                ...(month && year && month !== 'All' && year !== 'All') && {
                    "outlet_month_year": {
                        "equals": `${month}/${year}`
                    }
                }
            }
        },
        'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
    }

    const getOutletResult = useQuery(getOutletQuery, getOutletVariable);
    const getGlobalInputResult = useQuery(getGlobalInputQuery, getGlobalInputVariable);
    const getFirstIntermediaryResult = useQuery(getFirstIntermediaryQuery, getFirstIntermediaryVariable);
    const getSecondIntermediaryResult = useQuery(getSecondIntermediaryQuery, getSecondIntermediaryVariable);

    React.useEffect(() => {
        if (getGlobalInputResult.data) {
            setGlobalSetting(getGlobalInputResult.data.global_input);
        }
    }, [getGlobalInputResult]);

    const dataRow = React.useMemo(() => {
        let elem = <></>;
        if (getOutletResult.data && getOutletResult.data.findFirstOutlet) {
            const currentOutlet: outlet = getOutletResult.data.findFirstOutlet;
            elem = <React.Fragment>
                {currentOutlet.results && currentOutlet.results.map((result, index) => {
                    return <React.Fragment key={'frag-' + index}>
                        <tr>
                            <td colSpan={2}>
                                {currentOutlet.name}
                            </td>
                            <td>
                                <div className='flex flex-row justify-between'>
                                    <span>$</span><span>{numberWithCommas(Number(result.savings_tariff_expenses), 4)}</span>
                                </div>

                            </td>
                            <td>
                                {numberWithCommas(Number(result.outlet_eqpt_energy_usage_without_TP_month_kW))}
                            </td>
                            <td>
                                <div className='flex flex-row justify-between'>
                                    <span>$</span><span>{numberWithCommas(Number(result.outlet_eqpt_energy_usage_without_TP_month_expenses))}</span>
                                </div>
                            </td>
                            <td>
                                {numberWithCommas(Number(result.outlet_eqpt_energy_usage_with_TP_month_kW))}
                            </td>
                            <td>
                                <div className='flex flex-row justify-between'>
                                    <span>$</span><span>{numberWithCommas(Number(result.outlet_eqpt_energy_usage_with_TP_month_expenses))}</span>
                                </div>
                            </td>
                            <td>
                                {numberWithCommas(Number(result.outlet_measured_savings_kWh))}
                            </td>
                            <td>
                                <div className='flex flex-row justify-between'>
                                    <span>$</span><span>{numberWithCommas(Number(result.outlet_measured_savings_expenses))}</span>
                                </div>
                            </td>
                            <td>
                                {getInDecimal(Number(result.outlet_measured_savings_percent) * 100)}%
                            </td>
                            <td>
                                {getInDecimal(Number(result.co2_savings_kg))}
                            </td>
                            <td>
                                <div className='flex flex-row justify-between'>
                                    <span>$</span><span>{numberWithCommas(Number(result.savings_tariff_expenses), 2)}</span>
                                </div>

                            </td>
                        </tr>
                        <tr>
                            <td rowSpan={2}>
                                ACMV Equipment
                            </td>
                            <td>
                                {Number(result.acmv_eqpt_energy_baseline_avg_hourly_kW).toFixed(2)}
                            </td>
                            <td rowSpan={2} colSpan={5}>

                            </td>
                            <td rowSpan={2} colSpan={5}>
                                <div className='flex flex-row justify-between align-center'>
                                    <div className='flex flex-col items-end'>
                                        <span>{Number(result.acmv_25percent_benchmark_comparison_kWh).toFixed(2)}</span>
                                        <span>{Number(result.acmv_10percent_benchmark_comparison_kWh).toFixed(2)}</span>
                                    </div>
                                    <div className='flex flex-col items-start'>
                                        <div className='flex gap-x-4'>
                                            <span>$</span>
                                            <span>{numberWithCommas(Number(result.acmv_25percent_benchmark_comparison_expenses))}</span>
                                            <span>  --&gt; 25% benchmark comparison</span>
                                        </div>
                                        <div className='flex gap-x-4'>
                                            <span>$</span>
                                            <span>{numberWithCommas(Number(result.acmv_10percent_benchmark_comparison_expenses))}</span>
                                            <span>  --&gt; 10% benchmark comparison</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                valid as of {convertDate(result.acmv_eqpt_energy_baseline_avg_hourly_as_date)}
                            </td>

                        </tr>
                        {/* <tr>
                            <td rowSpan={2}>
                                Kitchen Exhaust
                            </td>
                            <td>
                                {Number(result.ke_eqpt_energy_baseline_avg_hourly_kW).toFixed(2)}
                            </td>
                            <td rowSpan={2}>

                            </td>
                            <td rowSpan={2}>
                                {Number(result.ke_eqpt_energy_usage_without_TP_month_kW).toFixed(2)}
                            </td>
                            <td rowSpan={2}>

                            </td>
                            <td rowSpan={2}>
                                {Number(result.ke_eqpt_energy_usage_with_TP_month_kW).toFixed(2)}
                            </td>
                            <td rowSpan={2}>

                            </td>
                            <td rowSpan={4} colSpan={5}>
                                <div className='flex flex-row justify-between align-center'>
                                    <div className='flex flex-col items-end'>
                                        <span>{Number(result.ke_and_ac_25percent_benchmark_comparison_kWh).toFixed(2)}</span>
                                        <span>{Number(result.ke_and_ac_10percent_benchmark_comparison_kWh).toFixed(2)}</span>
                                    </div>
                                    <div className='flex flex-col items-start'>
                                        <div className='flex gap-x-4'>
                                            <span>$</span>
                                            <span>{numberWithCommas(Number(result.ke_and_ac_25percent_benchmark_comparison_expenses))}</span>
                                            <span>  --&gt; 25% benchmark comparison</span>
                                        </div>
                                        <div className='flex gap-x-4'>
                                            <span>$</span>
                                            <span>{numberWithCommas(Number(result.ke_and_ac_10percent_benchmark_comparison_expenses))}</span>
                                            <span>  --&gt; 10% benchmark comparison</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                valid as of {convertDate(result.ke_eqpt_energy_baseline_avg_hourly_as_date)}
                            </td>
                        </tr>
                        <tr>
                            <td rowSpan={2}>
                                Aircons
                            </td>
                            <td>
                                {Number(result.ac_eqpt_energy_baseline_avg_hourly_kW).toFixed(2)}
                            </td>
                            <td rowSpan={2}>

                            </td>
                            <td rowSpan={2}>
                                {Number(result.ac_eqpt_energy_usage_without_TP_month_kW).toFixed(2)}
                            </td>
                            <td rowSpan={2}>

                            </td>
                            <td rowSpan={2}>
                                {Number(result.ac_eqpt_energy_usage_with_TP_month_kW).toFixed(2)}
                            </td>
                            <td rowSpan={2}>

                            </td>
                        </tr>
                        <tr>
                            <td>
                                valid as of {convertDate(result.ac_eqpt_energy_baseline_avg_hourly_as_date)}
                            </td>
                        </tr> */}
                    </React.Fragment>
                })}
            </React.Fragment>;

        }
        return elem;

    }, [getOutletResult.data])

    const stackBarChart = React.useMemo(() => {
        if (getFirstIntermediaryResult.data && getFirstIntermediaryResult.data.first_intermediary_tables) {
            const first_intermediary_tables: first_intermediary_table[] = (getFirstIntermediaryResult.data.first_intermediary_tables as first_intermediary_table[]).sort((a, b) => {
                return Number(a.day_of_month) == Number(b.day_of_month) ? 0 : Number(a.day_of_month) > Number(b.day_of_month) ? 1 : -1;
            });
            const labelList = first_intermediary_tables.map((fi) => fi.day_of_month + "/" + fi.outlet_month_year);
            labelList.push("");
            const chartData = {
                labels: labelList,
                datasets: [
                    // {
                    //     type: 'line' as const,
                    //     label: 'Measured Savings',
                    //     lineTension: 0,
                    //     borderColor: 'rgb(255, 99, 132)',
                    //     borderWidth: 2,
                    //     fill: true,
                    //     backgroundColor: 'transparent',
                    //     data: [1, 2, 3, 4, 5],
                    // },
                    {
                        type: 'bar' as const,
                        label: 'Energy Savings',
                        backgroundColor: 'rgb(26,35,126)',
                        data: first_intermediary_tables.map(ft => getInDecimal(Number(ft.all_eqpt_without_TP_kWh))),
                        datalabels: {
                            align: 'center' as any,
                            anchor: 'center' as any,
                            labels: {
                                value: {
                                    color: 'white'
                                }
                            }
                        },
                        barThickness: 20,
                        responsive: true,
                        order: 3,
                    },
                    {
                        type: 'bar' as const,
                        label: 'Energy Usage WITH TablePointer (kWh)',
                        backgroundColor: 'rgb(255,112,0)',
                        data: first_intermediary_tables.map(ft => getInDecimal(Number(ft.all_eqpt_with_TP_kWh))),
                        datalabels: {
                            align: 'center' as any,
                            anchor: 'center' as any,
                            labels: {
                                value: {
                                    color: 'white'
                                }
                            }
                        },
                        barThickness: 20,
                        responsive: true,
                        order: 2,
                    }

                ]
            }

            const stackBarTop: Plugin = {
                id: 'stackBarTop',
                // beforeBuildTicks(chart, args, options) {
                //     const canvas = document.getElementById("stack-bar-chart")?.getElementsByTagName("canvas")[0]
                //     console.log(canvas);
                //     const orig = canvas ? Number(canvas.getAttribute('width')) : 0;
                //     // canvas?.setAttribute('width', (orig).toString());
                // },
                afterDatasetsDraw: function (chart, options) {
                    // console.log(chart);
                    var ctx = chart.ctx;
                    // ctx.font = Chart..global.defaultFontStyle;
                    ctx.fillStyle = "#666666";
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    chart.data.datasets.forEach(function (dataset, i) {
                        var meta = chart.getDatasetMeta(i);
                        meta.data.forEach(function (bar: any, index) {
                            const total: number = bar.$context.parsed._stacks.y[0] + bar.$context.parsed._stacks.y[1];
                            (bar.height > 0 && (bar.$context.parsed.y === bar.$context.parsed._stacks.y[0])) && render_html_to_canvas(`<div style="border: 1px solid black; font-size:14px;">${total}</div>`, ctx, bar.x, bar.y, (total.toString().length * 10) + (14 - total.toString().length), 30);
                        });
                    });
                },
            }

            // <block:plugin:0>
            const getOrCreateLegendList = (chart: any, id: any) => {
                const legendContainer = document.getElementById(id);
                let listContainer = legendContainer?.querySelector('ul');

                if (!listContainer) {
                    listContainer = document.createElement('ul');
                    listContainer.style.display = 'flex';
                    listContainer.style.flexDirection = 'row';
                    listContainer.style.margin = "0px";
                    listContainer.style.padding = "0px";

                    legendContainer?.appendChild(listContainer);
                }

                return listContainer;
            };

            const htmlLegendPlugin = {
                id: 'htmlLegend',
                afterUpdate(chart: any, args: any, options: any) {
                    const ul = getOrCreateLegendList(chart, options.containerID);

                    // Remove old legend items
                    while (ul.firstChild) {
                        ul.firstChild.remove();
                    }

                    // Reuse the built-in legendItems generator
                    const items = chart.options.plugins.legend.labels.generateLabels(chart);

                    items.unshift({
                        fillStyle: 'white',
                        strokeStyle: 'gray',
                        lineWidth: '1',
                        fontColor: 'gray',
                        text: 'Energy Usage W/O TablePointer (kWh)'
                    });

                    items.forEach((item: any) => {
                        const li = document.createElement('li');
                        li.style.alignItems = 'center';
                        li.style.cursor = 'pointer';
                        li.style.display = 'flex';
                        li.style.flexDirection = 'row';
                        li.style.marginLeft = '10px';

                        // Color box
                        const boxSpan = document.createElement('span');
                        boxSpan.style.background = item.fillStyle;
                        boxSpan.style.borderColor = item.strokeStyle;
                        boxSpan.style.borderWidth = item.lineWidth + 'px';
                        boxSpan.style.display = 'inline-block';
                        boxSpan.style.flexShrink = "20px";
                        boxSpan.style.height = '20px';
                        boxSpan.style.marginRight = '10px';
                        boxSpan.style.width = '20px';

                        // Text
                        const textContainer = document.createElement('p');
                        textContainer.style.color = item.fontColor;
                        textContainer.style.margin = "0px";
                        textContainer.style.padding = "0px";
                        textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

                        const text = document.createTextNode(item.text);
                        textContainer.appendChild(text);

                        li.appendChild(boxSpan);
                        li.appendChild(textContainer);
                        ul.appendChild(li);
                    });
                }
            };
            // </block:plugin>
            const stackBarOption = {
                barPercentage: 0.3,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top' as any,
                        align: 'center' as any,
                    },

                    htmlLegend: {
                        // ID of the container to put the legend in
                        containerID: 'legend-container',
                    },

                },
                responsive: true,
                maintainAspectRatio: false,
                // clamp: true,
                scales: {
                    x: {
                        grace: 1,
                        stacked: true,
                        grid: {
                            display: false
                        },
                        display: true,
                        ticks: {
                            display: true,
                        }
                    },
                    // x2: { // add extra axes
                    //     position: 'bottom' as const,
                    //     // type: 'category',
                    //     grid: {
                    //         display: false
                    //     },
                    //     display: false,
                    // },
                    y: {
                        grace: '20%',
                        stacked: true,
                        grid: {
                            display: false
                        },
                    },

                }
            };

            return <Chart type='bar' data={chartData} options={stackBarOption} plugins={[stackBarTop, htmlLegendPlugin]} />
        } else {
            return <></>
        }

    }, [getFirstIntermediaryResult.data]);

    const scatterChart = React.useMemo(() => {
        if (getSecondIntermediaryResult.data && getSecondIntermediaryResult.data.secondary_intermediary_tables) {
            const second_intermediary_tables: secondary_intermediary_table[] = getSecondIntermediaryResult.data.secondary_intermediary_tables;
            const scatterData = () => {
                return (
                    {
                        labels: second_intermediary_tables.map((_, index) => index),
                        datasets: [
                            {
                                type: 'line' as const,
                                label: 'Line Dataset',
                                data: second_intermediary_tables.map(si => Number(si.acmv_baseline_kW)),
                                backgroundColor: 'rgb(0, 0, 255)',
                                borderColor: 'rgb(0, 0, 255)',
                                pointRadius: 0,
                                xAxisID: 'x2' // Specify to which axes to link
                            },
                            {
                                type: 'scatter' as const,
                                backgroundColor: 'rgb(238,143,80)',
                                borderColor: 'rgb(238,143,80)',
                                pointStyle: 'cross',
                                rotation: 45,
                                data: second_intermediary_tables.map(si => Number(si.acmv_without_TP_kWh))
                            }
                        ],
                    }
                )
            }
            const option = {
                plugins: {
                    legend: {
                        display: false,
                    },
                    datalabels: {
                        display: false,
                    }
                },
                elements: {
                    bar: {
                        borderRadius: 30,
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        },
                        display: true,
                        ticks: {
                            display: false,
                        },
                        barPercentage: 1,
                        categoryPercentage: 1
                    },
                    x2: { // add extra axes
                        position: 'bottom' as const,
                        // type: 'category',
                        grid: {
                            display: false
                        },
                        display: false,
                        barPercentage: 1,
                        categoryPercentage: 1
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        grid: {
                            display: false,
                        },
                        ticks: {
                            // autoSkipPadding: 80
                        }
                    },

                }
            }
            return <Chart type='scatter' data={scatterData()} options={option} />;
        } else {
            return <></>
        }

    }, [getSecondIntermediaryResult.data])

    return <React.Fragment>
        <div id="month-of-reference">
            <div>
                {/* <h1 className='report-main-header-text'>
                {year + " --- " + month + ` (${id})`}
            </h1> */}
                <span>
                    {"Month of reference:"}
                </span>
                <span>
                    {month + "/" + year}
                </span>
            </div>
            <div className='w-auto'>
                <table className="report-table w-full text-xs">
                    <thead>
                        <tr>
                            <td rowSpan={2}>

                            </td>
                            <td>
                                Eqpt. Energy Baseline (Avg. Hourly)
                            </td>
                            <td>
                                Last Avail. Tariff
                            </td>
                            <td colSpan={2}>
                                Eqpt. Energy Usage W/O TablePointer (Month)
                            </td>
                            <td colSpan={2}>
                                Eqpt. Energy Usage WITH TablePointer (Month)
                            </td>
                            <td colSpan={3}>
                                Measured Energy Savings (Month)
                            </td>
                            <td>
                                CO<sup>2</sup> Savings (Month)
                            </td>
                            <td>
                                Savings @ Tariff ↑
                            </td>
                            <td>
                                Remarks
                            </td>
                        </tr>
                        <tr>
                            <td>
                                kW
                            </td>
                            <td>
                                $ / kWh
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
                                kWh
                            </td>
                            <td>
                                $
                            </td>
                            <td>
                                %
                            </td>
                            <td>
                                kg
                            </td>
                            <td >
                                <div className='flex flex-row justify-between'>
                                    <span>$</span><span>{numberWithCommas(Number(globalSetting?.poss_tariff_increase), 4)}</span>
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataRow}
                    </tbody>
                </table>
                {/* <span className="text-xs">*26% savings generated and within benchmark</span> */}
            </div>
        </div>

        {/* <div >
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
        </div> */}
        <div id="scatter-chart" className='h-80 mt-4'>
            {scatterChart}
        </div>
        <div className='flex place-content-center my-4' id='legend-container'>

        </div>
        <div id="stack-bar-chart" className='h-80 mt-4'>
            {stackBarChart}
        </div>
        <div className='italic text-xs flex flex-col mt-12'>
            <span>
                {`* Eqpt.Energy Baseline represents the equipment's energy usage over a typical hour without Tablepointer,
                and is continuously and dynamically sampled for statistical best-fit averaging to ensure validity over time.`}
            </span>
            <span>
                * Benchmark Comparison of 10% - 25% is for guidance and based on database of projects implemented.
            </span>
        </div>

    </React.Fragment>
}
export default GroupReport