import { dummySummaryBillingTableData, dummySummaryOutletTableData } from "../common/constant";
import PillButton from "./PillButton";
import SummaryTable from "./SummaryTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { outlet, results } from "../types/datatype";
import React from "react";
import { gql, useLazyQuery } from "@apollo/client";
import axios from "axios";
import { FileInfo } from "../common/types";

interface Props {
    openReportStepEdit: boolean;
    setOpenReportStepEdit: (bool: boolean) => void;
    fromExtension: string;
    toExtension: string;
    datePeriod: string;
    affectedRows: number;
    uploadedFileAttribute: FileInfo | undefined;
    onConfirm?: () => void;
}



const ReportStepEdit = ({ openReportStepEdit, setOpenReportStepEdit, fromExtension, toExtension, uploadedFileAttribute, onConfirm, datePeriod, affectedRows }: Props) => {

    const [isSuccess, setIsSuccess] = React.useState(false);
    const [currentUploadedFileAttribute, setCurrentUploadedFileAttribute] = React.useState<FileInfo | undefined>(uploadedFileAttribute);

    React.useEffect(() => {
        if (!openReportStepEdit) {
            setIsSuccess(false);
        }
    }, [openReportStepEdit])

    React.useEffect(() => {
        if (uploadedFileAttribute) {
            setCurrentUploadedFileAttribute(uploadedFileAttribute);
        }
    }, [uploadedFileAttribute])

    const successComp = React.useMemo(() => {
        return (<div>
            <h2><b>Success!</b></h2>
            <div className="flex flex-col gap-y-4">
                <h4>{`You have successfully generated ${toExtension} with following details:`}</h4>
                <div className="flex flex-col gap-y-1">
                    <span>{`${toExtension} Period:`}<br /><b>{datePeriod}</b></span>
                </div>
            </div>
        </div>)
    }, [toExtension, datePeriod]);

    // const downloadFromS3 = React.useCallback(() => {
    //     if (currentUploadedFileAttribute) {
    //         axios.post(
    //             "https://20ix7znzn5.execute-api.ap-southeast-1.amazonaws.com/staging/getDownloadPresignedUrl",
    //             { "filename": currentUploadedFileAttribute.name }
    //         ).then(response => {
    //             // uploadURL and filename
    //             const result = response.data;
    //             axios.get(result.uploadURL, {
    //                 responseType: 'blob',
    //             }).then(result => {
    //                 // create file link in browser's memory
    //                 var binaryData = [];
    //                 binaryData.push(response.data);
    //                 const href = URL.createObjectURL(new Blob(binaryData, { type: currentUploadedFileAttribute.type }));

    //                 // create "a" HTML element with href to file & click
    //                 const link = document.createElement('a');
    //                 link.href = href;
    //                 link.setAttribute('download', currentUploadedFileAttribute.name); //or any other extension
    //                 document.body.appendChild(link);
    //                 link.click();

    //                 // clean up "a" element & remove ObjectURL
    //                 document.body.removeChild(link);
    //                 URL.revokeObjectURL(href);

    //                 setIsSuccess(true);

    //             }).catch(error => {
    //                 console.log(error);
    //             })
    //         })
    //         // uploadFiles.forEach(uploadFile => {

    //         // })
    //     }

    // }, [currentUploadedFileAttribute]);

    const startComp = React.useMemo(() => {
        return (<div>
            <h2><b>Attention!</b></h2>
            <div className="flex flex-col gap-y-4">
                <h4>{`You're going to generate ${fromExtension} by using the uploaded ${toExtension} for:`}</h4>
                <div className="flex flex-col gap-y-1">
                    <span>{`${fromExtension} Period:`}<br /><b>{datePeriod}</b></span>
                    <span>Row Data Affected:<br /><b>{affectedRows}</b></span>
                    <h2 className="">Do you wish to continue?</h2>
                </div>
                <div className="flex flex-row gap-x-3 justify-between">
                    <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Cancel</button>
                    <button type='button' onClick={() => { onConfirm && onConfirm(); setIsSuccess(true); }} className="bg-blue-500 text-white rounded-lg w-full text-sm h-11 text-center">Yes</button>
                </div>
            </div>
        </div>)
    }, [fromExtension, toExtension, datePeriod, affectedRows, currentUploadedFileAttribute]);

    return (
        <div className={` edit-container ${openReportStepEdit ? "translate-x-0 " : "translate-x-full"}`}>
            <div className="flex justify-end">
                <button onClick={(e) => { setOpenReportStepEdit(!openReportStepEdit) }} className={`w-8 h-8`} type='button'>
                    <FontAwesomeIcon style={{ fontSize: '2em', cursor: 'pointer' }} icon={faCircleXmark} />
                </button>
            </div>
            <div className="space-y-6 pt-6 h-full flex flex-col justify-center items-center">
                {isSuccess ? successComp : startComp}
            </div>
        </div>
    )

}

export default ReportStepEdit;