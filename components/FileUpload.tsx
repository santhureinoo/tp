import React from "react";
import { v4 as uuidv4 } from 'uuid';
import rfdc from 'rfdc';
import Image from 'next/image';
import { bytesToSize, truncateFileName } from "../common/helper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
const cloneDeep = rfdc();

interface Props {
    uploadedFile: File | undefined;
    setUploadedFile(uploadeFiles: File): void;
}

const FileUpload = ({ uploadedFile, setUploadedFile }: Props) => {

    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.currentTarget.files) {
            const uploadedFileArray = Array.from(e.currentTarget.files);
            const clonedUploadedFile = uploadedFileArray[0];
            setUploadedFile(clonedUploadedFile);
        }
    };

    const getImage = React.useMemo(() => {
        if (uploadedFile) {
            return <Image alt="uploadedFile" width={80} height={80}  className="object-contain" src={URL.createObjectURL(uploadedFile)} />
        } else {
            return <FontAwesomeIcon icon={faImage} className="p-4 text-3xl text-[#147CFC] rounded-full bg-[#E8F2FF]" />
        }
    }, [uploadedFile]);

    return (
        <React.Fragment>
            <div className="flex flex-row gap-x-2 items-center">
                {getImage}
                <div className="w-full flex items-center flex-col justify-center bg-grey-lighter">
                    <label className="w-full flex flex-col items-center px-4 py-2 bg-[#147CFC] text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
                        <span className="text-white text-base leading-normal">Upload</span>
                        <input type='file' accept="image/*" onChange={handleUploadFile} className="hidden" />
                    </label>
                    <span className="text-xs pt-1">Supports: JPG, PNG</span>
                </div>
            </div>
        </React.Fragment>
    )
}

export default FileUpload;