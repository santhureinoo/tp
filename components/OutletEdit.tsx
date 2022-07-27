import CustomizedInput from "./CustomizedInput"
import React from 'react';
import ContactList from "./ContactList";
import { dummyContactList, dummySummaryOutletTableData } from "./../common/constant";
import SummaryTable from "./SummaryTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import OutletInformation from "./outlet/OutletInformation";
import SavingsInformation from "./outlet/SavingsInformation";

interface Props {
    openOutletEdit: boolean;
    setOpenOutletEdit(openOutletEdit: boolean): void;
}

const OutletEdit = ({ openOutletEdit, setOpenOutletEdit }: Props) => {
    const [contactList, setContactList] = React.useState(dummyContactList);
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
    const [selectedInformation, setSelectedinformation] = React.useState(1);
    return (
        <div className={`edit-container ${openOutletEdit ? "translate-x-0 " : "translate-x-full"}`}>
            <div className="flex justify-end">
                <button onClick={(e) => { setOpenOutletEdit(!openOutletEdit) }} className={`w-8 h-8`} type='button'>
                    <FontAwesomeIcon style={{ fontSize: '2em', cursor: 'pointer' }} icon={faCircleXmark} />
                </button>
            </div>
            <div className="edit-space-divider">

                <div className="edit-sub-container">
                    <div className="flex flex-row gap-x-12 cursor-pointer">
                        <div onClick={(e) => { setSelectedinformation(1); }} className="flex justify-between">
                            {
                                selectedInformation === 1 ? <h2><b>Outlet</b> <br /> Information</h2> : <h2 className="header-thin">Outlet<br />Information</h2>
                            }

                        </div>
                        <div onClick={(e) => { setSelectedinformation(2); }} className="flex">
                            {
                                selectedInformation === 2 ? <h2><b>Savings</b> <br /> Information</h2> : <h2 className="header-thin">Savings<br />Information</h2>
                            }

                        </div>
                    </div>
                </div>
                {
                    selectedInformation === 1 ? <OutletInformation /> : <SavingsInformation />
                }


            </div>

        </div>
    )
}

export default OutletEdit;