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
    Plugin

} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NextPage } from "next";
import { useRouter } from 'next/router';
import React from 'react';


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


const OutletAnnexReport: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const stackBarChart = {
        // labels: ["A", "B", "C", "D", "E"],
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
                label: 'Without Tablepointer',
                backgroundColor: 'rgb(26,35,126)',
                data: [4, 2, 1, 4, 6],
                datalabels: {
                    align: 'center' as any,
                    anchor: 'center' as any,
                    labels: {
                        value: {
                            color: 'white'
                        }
                    }
                },
                barThickness: 25,
                order: 3,
            },
            {
                type: 'bar' as const,
                label: 'With Tablepointer',
                backgroundColor: 'rgb(255,112,0)',
                data: [5, 6, 1, 5, 9],
                datalabels: {
                    align: 'center' as any,
                    anchor: 'center' as any,
                    labels: {
                        value: {
                            color: 'white'
                        }
                    }
                },
                barThickness: 25,
                order: 2,
            }

        ]
    };


    const stackBarTop: Plugin = {
        id: 'stackBarTop',
        beforeDraw(chart: any, args: any, options: any) {
            const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
            ctx.save();
            var fontsize = 14;
            var fontface = 'verdana';
            var lineHeight = fontsize * 1.286;
            var text = '100';

            ctx.font = fontsize + 'px ' + fontface;
            var textWidth = ctx.measureText(text).width;

            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            // ctx.fillText(text, x.getPixelForValue(0), y.getPixelForValue(0));
            // ctx.strokeRect(x.getPixelForValue(0), y.getPixelForValue(0), textWidth, lineHeight);
            // const img = new Image();
            // img.src = "https://www.chartjs.org/img/chartjs-logo.svg"
            // ctx.drawImage(img, 10, 10, 30, 30);
            // const data = "data:image/svg+xml," +
            // "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
            //   "<foreignObject width='100%' height='100%'>" +
            //     "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:12px'>" +
            //      "<ul> <li style='color:red'> hello </li>  <li style='color:green'>thomas</li> </ul> "  +   
            //     "</div>" +
            //   "</foreignObject>" +
            // "</svg>";
            // var DOMURL = window.URL || window.webkitURL || window;
            // var img = new Image();
            // var svg = new Blob([data], {
            //     type: 'image/svg+xml;charset=utf-8'
            // });
            // var url = DOMURL.createObjectURL(svg);
            // img.onload = function () {
            //     ctx.drawImage(img, 10, 10, 30, 30);
            //     DOMURL.revokeObjectURL(url);
            //     console.log("CALLE");
            // }
            // img.src = url;
            // setTimeout(()=>{
            //     ctx.drawImage(img, 10, 10, 30, 30);
            //     DOMURL.revokeObjectURL(url);
            // }, 5000);
        }
    }

    const stackBarOption = {
        plugins: {
            legend: {
                display: true,
                position: 'right' as any,
                align: 'start' as any,
            }
            // datalabels: {
            //     color: 'white',
            //     font: {
            //         weight: 'bold' as any
            //     },
            //     formatter: Math.round
            // },
        },
        // elements: {
        //     bar: {
        //         borderRadius: 30,
        //     }
        // },
        responsive: true,
        maintainAspectRatio: false,
        // clamp: true,
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                },
                display: true,
                ticks: {
                    display: false
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
                stacked: true,
                grid: {
                    display: false
                }
            },

        }
    };


    const scatterData = () => {
        return (
            {
                labels: [
                    "00", "01", "02", "03"
                ],
                datasets: [
                    {
                        type: 'line' as const,
                        label: 'Line Dataset',
                        data: ["02", "02", "02", "02", "02"],
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
                        data: ["01.5", "02.3", "02.8", "01.4", "02.1"]
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
                }
            },
            x2: { // add extra axes
                position: 'bottom' as const,
                // type: 'category',
                grid: {
                    display: false
                },
                display: false,
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

    return <React.Fragment>
        <div>
            <h1 className='report-main-header-text'>
                {"Portfolio Savings & Substainability" + id}
            </h1>
            <span>
                {"Month of reference:"}
            </span>
            <span>
                {"August 2022"}
            </span>
        </div>
        <div className='w-auto'>
            <table className="report-table w-auto text-xs">
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
                            Savings @ Tariff
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
                            <span>$</span><span>0.3228</span>
                        </td>
                    </tr>

                </thead>
                <tbody>
                    <tr>
                        <td colSpan={2}>
                            Burger King (Ang Mo Ko)
                        </td>
                        <td >
                            <span>$</span><span>0.1526</span>
                        </td>
                        <td>
                            3,063
                        </td>
                        <td >
                            <span>$</span><span>467.69</span>
                        </td>
                        <td>
                            2,139
                        </td>
                        <td >
                            <span>$</span><span>467.69</span>
                        </td>
                        <td>
                            925
                        </td>
                        <td >
                            <span>$</span><span>141.69</span>
                        </td>
                        <td>
                            30%
                        </td>
                        <td>
                            656
                        </td>
                        <td >
                            <span>$</span><span>298.58</span>
                        </td>
                    </tr>
                    <tr>
                        <td rowSpan={2}>
                            ACMV Equipment
                        </td>
                        <td>
                            5.06
                        </td>
                        <td rowSpan={2} colSpan={5}>

                        </td>
                        <td rowSpan={2} colSpan={5}>
                            <div>
                                qwe
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            valid as of 31 Aug 2023
                        </td>
                    </tr>
                </tbody>
            </table>
            {/* <span className="text-xs">*26% savings generated and within benchmark</span> */}
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
        <div className='h-64 mt-4'>
            <Chart type='scatter' data={scatterData()} options={option} />
        </div>
        <div className='h-64 mt-2'>
            <Chart type='bar' data={stackBarChart} options={stackBarOption} plugins={[stackBarTop]} />
        </div>
        <div className='italic text-xs flex flex-col mt-2'>
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
export default OutletAnnexReport;