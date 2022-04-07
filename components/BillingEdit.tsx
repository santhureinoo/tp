import { dummySummaryBillingTableData, dummySummaryOutletTableData } from "../common/constant";
import PillButton from "./PillButton";
import SummaryTable from "./SummaryTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleXmark } from '@fortawesome/free-regular-svg-icons';


interface Props {
    openBillingEdit: boolean;
    setOpenBillingEdit(openBillingEdit: boolean): void;
}

const BillingEdit = ({ openBillingEdit, setOpenBillingEdit }: Props) => {
    return (
        <div className={`shadow-lg overflow-auto top-0 px-6 pt-6 bottom-0 right-0 fixed w-full md:w-[46vw] h-full bg-white ease-in-out z-50 duration-300 ${openBillingEdit ? "translate-x-0 " : "translate-x-full"}`}>
            <div className="flex justify-end">
                <button onClick={(e) => { setOpenBillingEdit(!openBillingEdit) }} className={`w-8 h-8`} type='button'>
                    <FontAwesomeIcon style={{ fontSize: '2em', cursor:'pointer' }} icon={faCircleXmark} />
                </button>
            </div>
            <div className="space-y-6 pt-6">
                <div className="pb-6 space-y-4">
                    <div className="flex text-lg justify-between">
                        <div>
                            <h4 ><b>Invoice ID</b> <br /> Set-2095860</h4>
                        </div>

                        <button type="button" onClick={(e) => { }} className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Download Invoice
                        </button>
                    </div>
                    <PillButton className={"bg-green-300  w-40 h-10"} text={"Invoice Extracted"} />
                </div>
                <div className="space-x-3 space-y-3 py-6">
                    <div className="flex bg-slate-200 p-4 items-center">
                        <h6 ><b>Business</b> Information</h6>
                    </div>
                    <div className="grid grid-cols-3 gap-x-2 gap-y-8">
                        <div>
                            <h4>Business Name</h4>
                            <span className="text-slate-300">KFC Holding Indonesia</span>
                        </div>
                        <div className="col-span-2">
                            <h4>Business Address</h4>
                            <span className="text-slate-300">Sahid Building <br />Sudirman Boulevard No.12 Floor 15/<br />Unit 09</span>
                        </div>
                        <div>
                            <h4>Country</h4>
                            <span className="text-slate-300">Indonesia</span>
                        </div>
                        <div>
                            <h4>City</h4>
                            <span className="text-slate-300">Jakarta</span>
                        </div>
                        <div>
                            <h4>Postal Code </h4>
                            <span className="text-slate-300">150345</span>
                        </div>
                    </div>
                </div>
                <div className="space-x-3 space-y-3 py-6">
                    <div className="flex bg-slate-200 p-4 items-center justify-between">
                        <h6 ><b>Invoice</b> Information</h6>
                        <span> Period <b>Sept. 2022</b></span>
                    </div>
                    <div className="grid grid-cols-4 gap-x-2 gap-y-8">
                        <div>
                            <h4>Invoice ID</h4>
                            <span className="text-slate-300">Set-2095860</span>
                        </div>
                        <div>
                            <h4>Invoice Date</h4>
                            <span className="text-slate-300">30/09/2022</span>
                        </div>
                        <div>
                            <h4>Due Date</h4>
                            <span className="text-slate-300">30/10/2022</span>
                        </div>
                        <div>
                            <h4>Tax</h4>
                            <span className="text-slate-300">0</span>
                        </div>
                        <div>
                            <h4>Total Service Fee</h4>
                            <span className="text-slate-300">$485.09</span>
                        </div>
                        <div>
                            <h4>Total Savings ($)</h4>
                            <span className="text-slate-300">$250</span>
                        </div>
                        <div>
                            <h4>Total Savings (kWh)</h4>
                            <span className="text-slate-300">470</span>
                        </div>
                    </div>
                </div>
                <div className="space-x-3 bg-slate-200 space-y-3 py-6">
                    <div className="flex p-4 items-center">
                        <h6><b>Outlet (5)</b></h6>
                    </div>
                    <div className="grid grid-cols-1 items-center">
                        <div className="w-full overflow-auto">
                            <SummaryTable headerColor={`bg-slate-100`} headers={['Outlet Name','Last Available Tariff','Eqpt.EnergyBaseline','Energy Usage','Savings', 'Service Fee']} data={dummySummaryBillingTableData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillingEdit;