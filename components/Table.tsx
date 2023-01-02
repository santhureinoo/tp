import React from 'react';
import TinyEditDeleteMenu from "./TinyEditDeleteMenu";
import { v4 as uuidv4 } from 'uuid';
import { TableProps } from "../common/types";
import { TRelayEdge } from '@apollo/client/utilities/policies/pagination';

interface Props {
    handleEdit?: (selectedData: any) => any;
    handleDelete?: (selectedData: any) => any;
    handleAddNew?: () => any;
    rightSideElements: JSX.Element[];
    leftSideElements: JSX.Element[];
    leftSideFlexDirection?: 'Horizontal' | 'Vertical';
    buttonText?: string;
    data: any;
    onlyShowButton?: boolean;
    hideDetailMenu?: boolean;
    totalNumberOfPages?: number;
    currentSelectedPage?: number;
    setCurrentSelectedPage?: (pageNum: number) => void;
}

const Table = ({ headers, data, onlyShowButton, hiddenDataCol = [], hiddenDataColIndex = [], currentSelectedPage = 1, setCurrentSelectedPage, totalNumberOfPages = 0, handleAddNew, leftSideFlexDirection = "Horizontal", handleEdit, handleDelete, hideDetailMenu = false, rightSideElements = [], leftSideElements = [], buttonText }: Props & TableProps) => {
    const [openTinyMenuIndex, setOpenTinyMenuIndex] = React.useState(-1);


    const pages = React.useMemo(() => {
        const pageArr = [];
        for (let i = 1; i <= totalNumberOfPages; i++) {
            pageArr.push(
                <a
                    href="#"
                    onClick={event => {
                        setCurrentSelectedPage && setCurrentSelectedPage(i);
                    }}
                    className={i !== currentSelectedPage ? `bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden rounded-md md:inline-flex relative items-center px-4 py-2 border text-sm font-medium` : `z-10 bg-indigo-50 border-indigo-500 text-indigo-600 rounded-md relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                >
                    {i}
                </a>
            )
        }
        return pageArr;
    }, [totalNumberOfPages, currentSelectedPage])

    return (
        <React.Fragment>
            <div className="drop-shadow-lg w-full h-100 rounded-lg p-4 bg-white w-auto">
                {leftSideFlexDirection === 'Horizontal' ? <div className={`grid grid-cols-2 justify-between items-start py-2 grow-0`}>
                    <div className={`flex flex-row gap-x-2`}>
                        {leftSideElements.map(elem => {
                            return <React.Fragment key={uuidv4()}>
                                {elem}
                            </React.Fragment>
                        })}
                    </div>
                    <div className="flex flex-row justify-end gap-x-2">
                        <div className='flex justify-between gap-x-4'>
                            {rightSideElements.map(elem => {
                                return <React.Fragment key={uuidv4()}>
                                    {elem}
                                </React.Fragment>
                            })}
                        </div>
                        {buttonText && <button type="button" onClick={(e) => { handleAddNew && handleAddNew() }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            {buttonText}
                        </button>}
                    </div>
                </div> : <div className='flex flex-col gap-y-4 px-2'>
                    {leftSideElements}
                </div>}
                <table className="items-center w-full bg-transparent border-collapse overflow-x-hidden">
                    <thead>
                        <tr>
                            {headers.map((header, idx) => {
                                return (<th key={uuidv4()} className="px-6 bg-blueGray-50 text-gray-400 align-middle border border-solid border-blueGray-100 py-3 text-xs border-t-0 border-l-0 border-r-0 whitespace-nowrap font-normal leading-6 text-left">
                                    {header}
                                </th>)
                            })}
                            <th key={uuidv4()} className="px-6 bg-blueGray-50 text-gray-400 align-middle border border-solid border-blueGray-100 py-3 text-xs border-t-0 border-l-0 border-r-0 whitespace-nowrap font-normal leading-6 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((obj: any, i: number) => {
                            return (
                                <tr key={uuidv4()} className="odd:bg-white even:bg-slate-50">
                                    {Object.keys(obj).filter((key, index) => !hiddenDataCol.includes(key) && !hiddenDataColIndex.includes(index)).map((key, i) => {
                                        return (
                                            <td key={uuidv4()} className="px-6 bg-blueGray-50 text-blueGray-500 align-middle  py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-normal leading-6 text-left">
                                                {obj[key]}
                                            </td>
                                        )
                                    })}
                                    {!hideDetailMenu && <th onClick={(e: React.MouseEvent<HTMLElement>) => {
                                        if (i === openTinyMenuIndex) setOpenTinyMenuIndex(-1)
                                        else setOpenTinyMenuIndex(i);
                                    }}
                                        className="relative cursor-pointer px-6 bg-blueGray-50 text-blueGray-500 align-middle  py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-normal leading-6 text-left">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                        <div className={`${openTinyMenuIndex === i ? 'absolute' : 'hidden'} z-20 top-8 -left-8`}>
                                            <TinyEditDeleteMenu onlyShowButton={onlyShowButton} selectedData={obj} onEdit={(selectedData) => handleEdit && handleEdit(selectedData)} onDelete={(selectedData) => handleDelete && handleDelete(selectedData)} />
                                        </div>
                                    </th>}
                                </tr>
                            )

                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end p-3 px-8">
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm space-x-3" aria-label="Pagination">
                        {totalNumberOfPages > 1 && <a
                            href="#"
                            onClick={event => {
                                setCurrentSelectedPage && currentSelectedPage > 1 && setCurrentSelectedPage(currentSelectedPage - 1);
                            }}
                            className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </a>}
                        {totalNumberOfPages > 1 && pages}
                        {totalNumberOfPages > 1 && <a
                            href="#"
                            onClick={event => {
                                setCurrentSelectedPage && currentSelectedPage < totalNumberOfPages && setCurrentSelectedPage(currentSelectedPage + 1);
                            }}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border rounded-md border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Next</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>}
                    </nav>
                </div>
            </div>
        </React.Fragment >

    )
}

export default Table;