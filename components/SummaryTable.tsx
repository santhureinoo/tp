import { TableProps } from "../common/types";
import { v4 as uuidv4 } from 'uuid';

const SummaryTable = ({ headers, data, headerColor }: TableProps) => {
    return (
        <table className="table-auto w-full overflow-y-auto">
            <thead>
                <tr className={`${headerColor}`}>
                    {headers.map((header, idx) => {
                        return (<th key={uuidv4()} className="px-6 bg-blueGray-50 text-gray-300 align-middle border border-solid border-blueGray-100 py-3 text-xs border-t-0 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            {header}
                        </th>);
                    })}
                </tr>
            </thead>
            <tbody className="relative">
                {data.map((obj, idx) => {
                    return (
                        <tr key={idx}>
                            {Object.keys(obj).map((key, idx) => {
                                return (
                                    <td key={key + '-' + idx} className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-normal text-left">
                                        {obj[key]}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}

                {/* <tr className=" bottom-0 left-0 right-0">
                    <td key={'total'} className="col-span-2 px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-normal text-left">
                        Total
                    </td>
                    <td key={'measuredEnergy1'} className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-normal text-left">
                        12345kWh
                    </td>
                    <td key={'measuredEnergy2'} className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-normal text-left">
                        12345kWh
                    </td>
                    <td key={'measuredEnergy3'} className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-normal text-left">
                        80<sup>%</sup>
                    </td>
                    <td key={'co2'} className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-normal text-left">
                        10,986kg
                    </td>
                    <td key={'measuredEnergy3'} className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-normal text-left">
                        <sup>$</sup>29,390
                    </td>
                </tr> */}

            </tbody>
        </table>

    )
}

export default SummaryTable;