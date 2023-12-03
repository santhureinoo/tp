import React from "react";
import { Item, group } from "../../types/datatype";
import { RightOutlined, LeftOutlined, ExceptionOutlined, ExclamationOutlined, CloseOutlined } from "@ant-design/icons";
import { DatePicker, Modal, Progress } from "antd";
import MultiItemSelector from "./MultiItemSelector";
import rfdc from "rfdc";
import { gql, useLazyQuery, WatchQueryFetchPolicy } from "@apollo/client";
import dayjs, { Dayjs } from "dayjs";
import { dateValueForQuery, downloadFile } from "../../common/helper";
import axios, { AxiosHeaders } from "axios";
import io, { Socket } from 'socket.io-client';

const cloneDeep = rfdc();

interface Props {
    setOpenBatchCalculate: (calculate: boolean) => void;
    openBatchCalculate: boolean;
    reportType: 'none' | 'group' | 'invoice' | 'group_annex';
}

const BatchGenerator = ({ openBatchCalculate, setOpenBatchCalculate, reportType = 'group_annex' }: Props): React.ReactElement => {
    const [leftSideItems, setLeftSideItems] = React.useState<Item[]>([]);
    const [rightSideItems, setRightSideItems] = React.useState<Item[]>([]);
    const [disableGenBtn, setDisableGenBtn] = React.useState(true);
    const [groups, setGroups] = React.useState<group[]>([]);
    const [downloadURL, setDownloadURL] = React.useState("");
    const [missingOutlets, setMissingOutlets] = React.useState<string[]>([]);
    const [finalProgress, setFinalProgress] = React.useState<{
        progress: number;
        status: "success" | "normal" | "exception" | "active" | undefined;
    }>({
        progress: -1,
        status: 'normal',
    });
    const firstTime = React.useRef(true);

    let socket: Socket;

    const getDefItem = (itemList: Item[]) => {
        const item = cloneDeep(itemList);
        return item.filter(itm => itm.checked).map((item) => {
            item.checked = false;
            return item;
        });
    }

    const mergeInPrevposition = (parentList: Item[], newList: Item[]) => {
        newList.forEach(item => {
            if (item.prev_position !== undefined) {
                if (item.prev_position === 0) {
                    parentList.unshift(item);
                } else {
                    parentList.splice(item.prev_position - 1, 0, item);
                }
            }
        })
        console.log(parentList);
        return parentList;
    }

    const onAddBatchModalClick = () => {
        const clonedRightSideItems = cloneDeep(rightSideItems);
        const clonedLeftSideItems = cloneDeep(leftSideItems);
        setRightSideItems(clonedRightSideItems.concat(getDefItem(clonedLeftSideItems)));
        setLeftSideItems(clonedLeftSideItems.filter(item => item.checked === false));
    }

    const onRemoveBatchModalClick = () => {
        const clonedLeftSideItems = cloneDeep(leftSideItems);
        const clonedRightSideItems = cloneDeep(rightSideItems);
        setLeftSideItems(mergeInPrevposition(clonedLeftSideItems, getDefItem(clonedRightSideItems)));
        setRightSideItems(clonedRightSideItems.filter(item => item.checked === false));
    }

    const onBatchGenerate = () => {

        setFinalProgress({
            progress: 0,
            status: "normal",
        });
        // const lstGroups = groups.filter(gp => rightSideItems.find(item => item.value === gp.group_id));
        axios.post(
            `${process.env.NEXT_PUBLIC_SITE_URL}:4001/batch-generation`,
            {
                // type: 'group',
                desired_report_type: reportType,
                month: (date.month() + 1).toString().padStart(2, '0'),
                year: (date.year()).toString(),
                customer_ids: ([] as number[]).concat(...rightSideItems.map(item => item.customers.split(',').map(cus => Number(cus)))),
                group_ids: rightSideItems.map(item => item.value)
            }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        ).then((response) => {
            console.log(response);
            setDownloadURL(response.data.downloadUrl);
            const missingOutletList: string[] = [];
            /**
             * customer_name
                : 
                "1 - Mansion Pte Ltd"
                group_name
                : 
                "1-Group"
                outlet_id
                : 
                1
                outlet_name
                : 
                "TXA Gastrobar L1 (Alkaff Mansion)"
             */

            response.data.outlets_with_missing_data_for_month.forEach((data: any) => {
                missingOutletList.push(`${data.outlet_name} (${data.group_name}) has no data for the month selected`)
            })

            setMissingOutlets(missingOutletList);
            // downloadFile(response.data, `TablePointer Summary Report - ${currentGroup?.group_name} - ${month} ${year} - Group`);
        }).catch(error => {
            console.log("EEE", finalProgress.progress);
            setFinalProgress({
                progress: 0,//finalProgress.progress,
                status: 'exception'
            })
        });
    }

    const [date, setDate] = React.useState<Dayjs>(dayjs());

    const getGroupsVariable = {
        "variables": {
            "where": {
                "month": {
                    "equals": (Number(date.month()) + 1).toString()
                },
                "year": {
                    "equals": (date.year()).toString()
                },
                "NOT": [
                    {
                        "outlet_measured_savings_expenses": {
                            "equals": "0"
                        },
                        "outlet_measured_savings_kWh": {
                            "equals": "0"
                        },
                        "outlet_measured_savings_percent": {
                            "equals": "0"
                        }
                    }
                ]
            },
            "resultsWhere2": {
                "outlet_date": {
                    "equals": dateValueForQuery((Number(date.month()) + 1).toString(), date.year().toString())
                }
            }
            // ...(dateValueForQuery(selectedSavingsMonth, selectedSavingsYear) !== '') && {
            //     "resultsWhere2": {
            //         "outlet_date": {
            //             "equals": dateValueForQuery(selectedSavingsMonth, selectedSavingsYear)
            //         }
            //     }
            // }
        },
    };

    const getGroupsQuery = gql`
  query getGroups($where: ReportsWhereInput, $resultsWhere2: ResultsWhereInput) {
    groups {
      group_id
      group_name
      customers {
        customer_id
        outlet {
          outlet_id
          results(where: $resultsWhere2) {
            savings_tariff_expenses
            outlet_date
          }
        }
      }
      reports(where: $where) {
        month
        year
        outlet_measured_savings_expenses
        outlet_measured_savings_kWh
        outlet_measured_savings_percent
        last_avail_tariff
        total_updated_outlets
      }
    }
  }`;

    const getGroupsResult = useLazyQuery(getGroupsQuery, getGroupsVariable);


    const socket_port = 3030;

    const host = '18.141.128.98';

    React.useEffect(() => {
        if (openBatchCalculate) {
            getGroupsResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then((res: any) => {
                const arr: any[] = [];
                if (res && res.data && res.data.groups) {
                    const groups = res.data.groups as group[];
                    setLeftSideItems(groups.map((gp, index) => {
                        return {
                            value: gp.group_id,
                            display: gp.group_name,
                            customers: gp.customers?.map(cus => Number(cus.customer_id)).join(',') || "",
                            checked: false,
                            prev_position: index
                        }
                    }));

                    setRightSideItems([]);
                }
            });
        }

    }, [openBatchCalculate])

    React.useEffect(() => {
        if (firstTime.current) {
            socket = io(`ws://${host}:${socket_port}`);

            socket.on('connect', () => {
                console.log('connected')
            });

            socket.on('progress_update', (data) => {
                console.log(data)
                setFinalProgress({ progress: Number(data.percent), status: Number(data.percent) === 100 ? 'success' : 'normal' });
            });

            firstTime.current = false;
        }
    }, [firstTime])

    const modalData = React.useMemo(() => {

        if (rightSideItems.length > 0) {
            setDisableGenBtn(false);
        } else {
            setDisableGenBtn(true);
        }

        return <React.Fragment>
            <div className='flex flex-col items-center'>
                <h1 className='text-center'>Batch Generate Savings Reports</h1>
                <DatePicker className='w-1/3' size={"large"} picker="month" value={date} onChange={(event) => { console.log(event); event && setDate(event) }} />
            </div>
            <div className='flex justify-between mt-5'>
                <MultiItemSelector Items={leftSideItems} Label={'Choose Group'} onSelected={setLeftSideItems}></MultiItemSelector>
                <div className='flex flex-col justify-center px-2 gap-y-2'>
                    <button onClick={onAddBatchModalClick} className="bg-[#1890FF] text-white hover:bg-sky-700 text-md px-3 py-2">
                        Add <RightOutlined rev={undefined}></RightOutlined>
                    </button>
                    <button onClick={onRemoveBatchModalClick} className="bg-gray-200 hover:bg-gray-300 text-md px-3 py-2">
                        <LeftOutlined rev={undefined} /> Remove
                    </button>
                </div>
                <MultiItemSelector Items={rightSideItems} Label={'To Generate'} onSelected={setRightSideItems}></MultiItemSelector>

            </div>
        </React.Fragment>

    }, [leftSideItems, rightSideItems, date]);

    const finalData = React.useMemo(() => {
        return <div className='flex flex-col items-center'>
            <h1 className='text-center'>Batch Generate Savings Reports <br /> {date.format('MMM YYYY')}</h1>
            <Progress type="circle" percent={finalProgress.progress} status={missingOutlets.length > 0 ? finalProgress.status : undefined} format={finalProgress.status === 'exception' ? () => {
                return <CloseOutlined rev={undefined} className="text-exception-batch-gen"></CloseOutlined>
            } : missingOutlets.length > 0 ? () => {
                return <ExclamationOutlined rev={undefined} className="text-warning-batch-gen" />
            } : undefined} strokeColor={finalProgress.status === 'exception' ? '#F5222D' : missingOutlets.length > 0 ? "#FFC53D" : undefined} />
            <div>
                {missingOutlets.map(data => {
                    return <p className={"text-warning-batch-gen"}>{data}</p>
                })}
                {
                    finalProgress.status === 'exception' && <p className={"text-exception-batch-gen"}>{`Unknown error, please contact tech team to investigate`}</p>
                }
            </div>
        </div>
    }, [downloadURL, finalProgress])

    return <Modal
        style={{ top: 30 }}
        open={openBatchCalculate}
        onCancel={(e) => {
            setDownloadURL('');
            setRightSideItems([]);
            setOpenBatchCalculate(false);
            setFinalProgress({
                progress: -1,
                status: 'normal'
            });
            setMissingOutlets([]);
        }}
        destroyOnClose={true}
        width={800}
        footer={
            <div className='flex justify-center w-100'>
                {finalProgress.progress === -1 ? <button onClick={onBatchGenerate} disabled={disableGenBtn} className="bg-custom-active-link text-white hover:bg-sky-700 text-md px-5 py-3 rounded-md">
                    Generate Reports</button> :
                    <a
                        href={downloadURL.toString()}
                        style={{ pointerEvents: finalProgress.progress === 100 ? 'all' : 'none' }}
                        className={`${finalProgress.progress === 100 ? 'bg-custom-active-link' : 'bg-gray-600'} text-white hover:bg-sky-700 text-md px-5 py-3 rounded-md`}
                        download
                    >Download Reports</a>}
            </div>
        }
    >
        {finalProgress.progress > (-1) ? finalData : modalData}
    </Modal>

}

export default BatchGenerator;