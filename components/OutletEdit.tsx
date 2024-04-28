import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import OutletInformation from "./outlet/OutletInformation";
import SavingsInformation from "./outlet/SavingsInformation";
import { gql, useLazyQuery, useMutation, WatchQueryFetchPolicy } from "@apollo/client";
import { outlet, outlet_month, outlet_month_shifts, outlet_person_in_charge } from "../types/datatype"; import rfdc from 'rfdc';
import { defaultOutletMonthShifts } from '../common/constant';
import moment from 'moment';
import CYTextField from './CYTextField';
import { Badge, Button, Form, Input, Modal, Space, Table, Tag } from 'antd';
import { DownOutlined, LinkOutlined } from '@ant-design/icons';
import CYCustom from './CYCustom';
const cloneDeep = rfdc();

interface Props {
    openOutletEdit: boolean;
    setOpenOutletEdit(openOutletEdit: boolean): void;
    selectedCustomerID: number;
    outlet?: outlet;
    afterOperation?: () => void;
    customerDropdown: any[];
}

const OutletEdit = ({ openOutletEdit, setOpenOutletEdit, outlet, selectedCustomerID, afterOperation, customerDropdown }: Props) => {
    // const [contactList, setContactList] = React.useState<outlet_person_in_charge[]>([]);
    const [selectedInformation, setSelectedinformation] = React.useState(1);
    const [openEquipmentModal, setOpenEquipmentModal] = React.useState(false);
    const [currentOutlet, setCurrentOutlet] = React.useState<outlet>({
        outlet_id: -1,
        customer_id: selectedCustomerID,
        name: "",
        outlet_status: "Live",
        outlet_address: "",
        outlet_type: "Restaurant",
        outlet_month_shifts: defaultOutletMonthShifts,
        outlet_device_live_date: [
            {
                outlet_id: -1,
                outlet_date: moment().format("DD/MM/YYYY"),
                ke_live_date: "",
                ac_live_date: "",
            }
        ],
        outlet_month: [
            {
                no_of_ac_in_outlet: 0,
                no_of_ex_in_outlet: 0,
                no_of_fa_in_outlet: 0,
                no_of_ex_installed: 0,
                no_of_fa_installed: 0,
                no_of_ac_installed: 0,
                remarks_on_eqpt_in_outlet_or_installed: "",
                remarks_on_overall_outlet: "",
                outlet_date: moment().format("DD/MM/YYYY"),
                outlet_outlet_id: -1,
                percent_share_of_savings: "",
                last_avail_tariff: "",
                tariff_month: "",

            }
        ]
    });

    const get_outlet_query = gql`
    query Outlet($where: OutletWhereUniqueInput!) {
        outlet(where: $where) {
          outlet_id
          name
          customer_id
          outlet_status
          outlet_address
          outlet_type
          outlet_month {
            outlet_date
            outlet_outlet_id
            percent_share_of_savings
            last_avail_tariff
            tariff_month
            no_of_ex_in_outlet
            no_of_fa_in_outlet
            no_of_ac_in_outlet
            no_of_ex_installed
            no_of_fa_installed
            no_of_ac_installed
            remarks_on_eqpt_in_outlet_or_installed
            remarks_on_overall_outlet
          }
          outlet_device_live_date {
            ke_live_date
            ac_live_date
            outlet_date
          }
          outlet_month_shifts {
            outlet_id
            outlet_date
            day_of_week
            shift_num
            startTime
            endTime
            remarks_on_op_hours
          }
          outlet_device_live_date {
            outlet_id
            ke_live_date
            ac_live_date
            outlet_date
          }
          outlet_person_in_charges {
            outlet_id
            contact_person_index
            contact_person_name
            contact_person_position
            contact_person_address
            contact_person_phone
            primary_contact
          }
        }
      }`;

    const get_outlet_variable = React.useMemo(() => {
        if (outlet && outlet.outlet_id !== -1) {
            return {
                'variables': {
                    "where": {
                        "outlet_id": outlet.outlet_id
                    }
                }
            }
        } else {
            return {};
        }

    }, [outlet]);

    const mutate_outlet_query = gql`mutation CreateOneOutlet($data: OutletCreateInput!) {
        createOneOutlet(data: $data) {
          outlet_id
          name
          customer_id
          outlet_status
          outlet_address
          outlet_type
          outlet_person_in_charges {
            contact_person_index
            contact_person_name
            contact_person_position
            contact_person_address
            contact_person_phone
            primary_contact
          }
          outlet_month {
            percent_share_of_savings
            last_avail_tariff
            tariff_month
            no_of_ex_in_outlet
            no_of_fa_in_outlet
            no_of_ac_in_outlet
            no_of_ex_installed
            no_of_fa_installed
            no_of_ac_installed
            remarks_on_eqpt_in_outlet_or_installed
            remarks_on_overall_outlet
          }
        }
      }`;

    const mutate_update_customer_query = gql`mutation UpdateOneOutlet($data: OutletUpdateInput!, $where: OutletWhereUniqueInput!) {
        updateOneOutlet(data: $data, where: $where) {
          name
          customer_id
          outlet_status
          outlet_address
          outlet_type
          customer {
            customer_id
          }
          outlet_person_in_charges {
            outlet_id
            contact_person_index
          }
        }
      }`;

    const [createMutationQuery] = useMutation(mutate_outlet_query);
    const getOutletQuery = useLazyQuery(get_outlet_query, get_outlet_variable);
    const [updateMutationQuery] = useMutation(mutate_update_customer_query);

    React.useEffect(() => {
        const cloned_outlet: outlet = cloneDeep(currentOutlet);
        cloned_outlet.customer_id = selectedCustomerID;
        setCurrentOutlet(cloned_outlet);
    }, [selectedCustomerID]);

    React.useEffect(() => {
        if (outlet && outlet.outlet_id !== -1) {
            getOutletQuery[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(result => {
                if (result.data && result.data.outlet) {
                    // const cloned_outlet: outlet = cloneDeep(result.data.outlet);
                    // if (cloned_outlet.outlet_device_live_date && cloned_outlet.outlet_device_live_date.length > 0) {
                    //     setCurrentOutlet(result.data.outlet);
                    // } else {
                    //     // Quick Fix
                    //     cloned_outlet.outlet_device_live_date = [
                    //         {
                    //             outlet_id: cloned_outlet.outlet_id,
                    //             outlet_date: moment().format("DD/MM/YYYY"),
                    //             ke_live_date: "",
                    //             ac_live_date: "",
                    //         }
                    //     ]
                    //     setCurrentOutlet(cloned_outlet);
                    // }
                    setCurrentOutlet(result.data.outlet);

                }
            })
        } else {
            setCurrentOutlet({
                outlet_id: -1,
                customer_id: selectedCustomerID,
                name: "",
                outlet_status: "Live",
                outlet_address: "",
                outlet_type: "Restaurant",
                outlet_month_shifts: defaultOutletMonthShifts,
                outlet_device_live_date: [
                    {
                        outlet_id: -1,
                        outlet_date: moment().format("DD/MM/YYYY"),
                        ke_live_date: "",
                        ac_live_date: "",
                    }
                ],
                outlet_month: [
                    {
                        no_of_ac_in_outlet: 0,
                        no_of_ex_in_outlet: 0,
                        no_of_fa_in_outlet: 0,
                        no_of_ex_installed: 0,
                        no_of_fa_installed: 0,
                        no_of_ac_installed: 0,
                        remarks_on_eqpt_in_outlet_or_installed: "",
                        remarks_on_overall_outlet: "",
                        outlet_date: moment().format("DD/MM/YYYY"),
                        outlet_outlet_id: -1,
                        percent_share_of_savings: "",
                        last_avail_tariff: "",
                        tariff_month: "",

                    }
                ]
            });
        }
    }, [outlet]);

    const onClick = (event: any) => {
        if (currentOutlet.outlet_id !== -1) {
            const MUTATE_VARIABLES = {
                variables: {
                    "where": {
                        "outlet_id": currentOutlet.outlet_id
                    },
                    "data": {
                        "customer": {
                            "connect": {
                                "customer_id": currentOutlet.customer_id
                            }
                        },
                        "name": {
                            "set": currentOutlet.name
                        },
                        "outlet_status": {
                            "set": currentOutlet.outlet_status
                        },
                        "outlet_address": {
                            "set": currentOutlet.outlet_address
                        },
                        "outlet_type": {
                            "set": currentOutlet.outlet_type
                        },
                        "outlet_month_shifts": currentOutlet.outlet_month_shifts ? {
                            "updateMany": currentOutlet.outlet_month_shifts.map((shift: outlet_month_shifts) => {
                                return {
                                    "where": {
                                        "outlet_id": {
                                            "equals": shift.outlet_id
                                        },
                                        "shift_num": {
                                            "equals": shift.shift_num
                                        },
                                        "outlet_date": {
                                            "equals": shift.outlet_date
                                        },
                                        "day_of_week": {
                                            "equals": shift.day_of_week
                                        }
                                    },
                                    "data": {
                                        "startTime": {
                                            "set": shift.startTime
                                        },
                                        "endTime": {
                                            "set": shift.endTime
                                        },
                                        "remarks_on_op_hours": {
                                            "set": shift.remarks_on_op_hours
                                        },
                                        "outlet_date": {
                                            "set": moment().format("DD/MM/YYYY")
                                        }
                                    }
                                }
                            })
                        } : undefined,
                        "outlet_person_in_charges": selectedInformation === 1 && currentOutlet.outlet_person_in_charges ? {
                            "upsert": currentOutlet.outlet_person_in_charges.map((contact: outlet_person_in_charge) => {
                                return {
                                    "where": {
                                        "outlet_id_contact_person_index": {
                                            "outlet_id": contact.outlet_id ? contact.outlet_id : currentOutlet.outlet_id,
                                            "contact_person_index": contact.contact_person_index
                                        }
                                    },
                                    "update": {
                                        "contact_person_index": {
                                            "set": contact.contact_person_index
                                        },
                                        "contact_person_name": {
                                            "set": contact.contact_person_name
                                        },
                                        "contact_person_position": {
                                            "set": contact.contact_person_position
                                        },
                                        "contact_person_address": {
                                            "set": contact.contact_person_address
                                        },
                                        "contact_person_phone": {
                                            "set": contact.contact_person_phone
                                        },
                                        "primary_contact": {
                                            "set": contact.primary_contact
                                        }
                                    },
                                    "create": {
                                        "contact_person_index": contact.contact_person_index,
                                        "contact_person_position": contact.contact_person_position,
                                        "contact_person_name": contact.contact_person_name,
                                        "contact_person_address": contact.contact_person_address,
                                        "contact_person_phone": contact.contact_person_phone,
                                        "primary_contact": contact.primary_contact
                                    }
                                }
                            }),
                            "deleteMany": [
                                {
                                    "contact_person_index": {
                                        "gte": currentOutlet.outlet_person_in_charges.length
                                    }
                                }
                            ]
                        } : undefined,
                        "outlet_device_live_date": currentOutlet?.outlet_device_live_date && currentOutlet.outlet_device_live_date.length > 0 ? {
                            "update": [
                                {
                                    "data": {
                                        "outlet_date": {
                                            "set": moment().format("DD/MM/YYYY")
                                        },
                                        "ac_live_date": {
                                            "set": currentOutlet.outlet_device_live_date[0].ac_live_date
                                        },
                                        "ke_live_date": {
                                            "set": currentOutlet.outlet_device_live_date[0].ke_live_date
                                        },

                                    },
                                    "where": {
                                        "outlet_date_outlet_id": {
                                            "outlet_id": currentOutlet.outlet_device_live_date[0].outlet_id,
                                            "outlet_date": currentOutlet.outlet_device_live_date[0].outlet_date
                                        }
                                    }
                                }
                            ]
                        } : undefined,
                        "outlet_month": selectedInformation === 2 && currentOutlet?.outlet_month && currentOutlet.outlet_month.length > 0 ? {
                            "update": [
                                {
                                    "data": {
                                        "outlet_date": {
                                            "set": moment().format("DD/MM/YYYY")
                                        },
                                        "percent_share_of_savings": {
                                            "set": currentOutlet.outlet_month[0].percent_share_of_savings
                                        },
                                        "last_avail_tariff": {
                                            "set": currentOutlet.outlet_month[0].last_avail_tariff
                                        },
                                        "tariff_month": {
                                            "set": currentOutlet.outlet_month[0].tariff_month
                                        },
                                        "remarks_on_eqpt_in_outlet_or_installed": {
                                            "set": currentOutlet.outlet_month[0].remarks_on_eqpt_in_outlet_or_installed
                                        },
                                        "no_of_ex_in_outlet": {
                                            "set": currentOutlet.outlet_month[0].no_of_ex_in_outlet
                                        },
                                        "no_of_fa_in_outlet": {
                                            "set": currentOutlet.outlet_month[0].no_of_fa_in_outlet
                                        },
                                        "no_of_ac_in_outlet": {
                                            "set": currentOutlet.outlet_month[0].no_of_ac_in_outlet
                                        },
                                        "no_of_ex_installed": {
                                            "set": currentOutlet.outlet_month[0].no_of_ex_installed
                                        },
                                        "no_of_fa_installed": {
                                            "set": currentOutlet.outlet_month[0].no_of_fa_installed
                                        },
                                        "no_of_ac_installed": {
                                            "set": currentOutlet.outlet_month[0].no_of_ac_installed
                                        },
                                        "remarks_on_overall_outlet": {
                                            "set": currentOutlet.outlet_month[0].remarks_on_overall_outlet
                                        }
                                    },
                                    "where": {
                                        "outlet_outlet_id_outlet_date": {
                                            "outlet_outlet_id": currentOutlet.outlet_month[0].outlet_outlet_id,
                                            "outlet_date": currentOutlet.outlet_month[0].outlet_date
                                        }
                                    }
                                }
                            ]
                        } : undefined
                    }
                }
            };
            updateMutationQuery(MUTATE_VARIABLES).then((val) => {
                afterOperation && afterOperation();
                setOpenOutletEdit(false);
            })
        } else {
            const MUTATE_VARIABLES = {
                variables: {
                    "data": {
                        "name": currentOutlet.name,
                        "outlet_status": currentOutlet.outlet_status,
                        "outlet_address": currentOutlet.outlet_address,
                        "outlet_type": currentOutlet.outlet_type,
                        "customer": {
                            "connect": {
                                "customer_id": currentOutlet.customer_id,
                            }
                        },
                        "outlet_person_in_charges": currentOutlet.outlet_person_in_charges ? {
                            "createMany": {
                                "data": currentOutlet.outlet_person_in_charges
                            }
                        } : undefined,
                        "outlet_month_shifts": currentOutlet.outlet_month_shifts ? {
                            "createMany": {
                                "data": currentOutlet.outlet_month_shifts.map(({ outlet_id, ...shift }: outlet_month_shifts) => shift)
                            }
                        } : undefined,
                        "outlet_device_live_date": currentOutlet.outlet_device_live_date && currentOutlet.outlet_device_live_date.length > 0 && {
                            "create": [
                                {
                                    "outlet_date": currentOutlet.outlet_device_live_date[0].outlet_date,
                                    "ke_live_date": currentOutlet.outlet_device_live_date[0].ke_live_date,
                                    "ac_live_date": currentOutlet.outlet_device_live_date[0].ac_live_date,
                                }
                            ]
                        },
                        "outlet_month": currentOutlet.outlet_month && currentOutlet.outlet_month.length > 0 && {
                            "create": [
                                {
                                    "outlet_date": currentOutlet.outlet_month[0].outlet_date,
                                    "percent_share_of_savings": currentOutlet.outlet_month[0].percent_share_of_savings,
                                    "last_avail_tariff": currentOutlet.outlet_month[0].last_avail_tariff,
                                    "tariff_month": currentOutlet.outlet_month[0].tariff_month,
                                    "no_of_ex_in_outlet": currentOutlet.outlet_month[0].no_of_ex_in_outlet,
                                    "no_of_fa_in_outlet": currentOutlet.outlet_month[0].no_of_fa_in_outlet,
                                    "no_of_ac_in_outlet": currentOutlet.outlet_month[0].no_of_ac_in_outlet,
                                    "no_of_ex_installed": currentOutlet.outlet_month[0].no_of_ex_installed,
                                    "no_of_fa_installed": currentOutlet.outlet_month[0].no_of_fa_installed,
                                    "no_of_ac_installed": currentOutlet.outlet_month[0].no_of_ac_installed,
                                    "remarks_on_overall_outlet": currentOutlet.outlet_month[0].remarks_on_overall_outlet,
                                    "remarks_on_eqpt_in_outlet_or_installed": currentOutlet.outlet_month[0].remarks_on_eqpt_in_outlet_or_installed
                                }
                            ]
                        }

                    }
                }
            };

            createMutationQuery(MUTATE_VARIABLES).then((val) => {
                setCurrentOutlet({
                    outlet_id: -1,
                    customer_id: selectedCustomerID,
                    name: "",
                    outlet_status: "Live",
                    outlet_address: "",
                    outlet_type: "Restaurant",
                    outlet_month_shifts: defaultOutletMonthShifts,
                    outlet_device_live_date: [
                        {
                            outlet_id: -1,
                            outlet_date: moment().format("DD/MM/YYYY"),
                            ke_live_date: "",
                            ac_live_date: "",
                        }
                    ],
                    outlet_month: [
                        {
                            no_of_ac_in_outlet: 0,
                            no_of_ex_in_outlet: 0,
                            no_of_fa_in_outlet: 0,
                            no_of_ex_installed: 0,
                            no_of_fa_installed: 0,
                            no_of_ac_installed: 0,
                            remarks_on_eqpt_in_outlet_or_installed: "",
                            remarks_on_overall_outlet: "",
                            outlet_date: moment().format("DD/MM/YYYY"),
                            outlet_outlet_id: -1,
                            percent_share_of_savings: "",
                            last_avail_tariff: "",
                            tariff_month: "",

                        }
                    ]
                });
                afterOperation && afterOperation();
                setOpenOutletEdit(false);
            });
        }

    }

    const dataSource = [
        {
            1: 'DD Exhaust',
        },
        {
            1: 'Split Screen Aircon',
        },
    ];

    const columns = [
        {
            title: () => {
                return <h2 className='text-2xl'>Equipment</h2>
            },
            dataIndex: '1',
            key: '1',
        },

        {
            title: () => {
                return <div className='text-2xl flex w-100 justify-end'>
                    <Button size={"large"} className='text-md' onClick={() => setOpenEquipmentModal(!openEquipmentModal)}>Add Equipment</Button>
                </div>;
            },
            dataIndex: '2',
            key: '2',
            render: () => (
                <Space size="middle" className='w-100 flex flex-row justify-end'>
                    <Badge status="success" text="Live" />
                    <a className="text-blue-500">Pause</a>
                    <a className="text-blue-500">Edit</a>
                    <a className="text-red-500">Delete</a>
                </Space>
            ),
        },
    ];

    return (
        <React.Fragment>
            <Modal
                title="Create Equipment"
                centered
                open={openEquipmentModal}
                onOk={() => setOpenEquipmentModal(!openEquipmentModal)}
                onCancel={() => setOpenEquipmentModal(!openEquipmentModal)}
            >
                <Form className='flex flex-col'>
                    <Form.Item label="EM MAC ID" className='mb-4'>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item label="Select Equipment" className='mb-4'>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item label="Equipment Name" className='mb-4'>
                        <Input></Input>
                    </Form.Item>
                    <div className='flex flex-col content-center items-center gap-y-4'>
                        <h3>Settings</h3>
                        <div className='px-8 flex flex-row flex-wrap'>
                            <Input className='w-1/2 px-2' addonBefore="Amp" defaultValue="0.5" />
                            <Input className='w-1/2 px-2' addonBefore="KE" defaultValue="0.1" />
                            <Input className='w-1/2 px-2' addonBefore="Amp" defaultValue="10" />
                            <Input className='w-1/2 px-2' addonBefore="KE" defaultValue="0.95" />
                        </div>
                    </div>
                </Form>
            </Modal>
            <div className="flex justify-end">
                <button onClick={(e) => { setOpenOutletEdit(!openOutletEdit) }} className={`w-8 h-8`} type='button'>
                    <FontAwesomeIcon style={{ fontSize: '2em', cursor: 'pointer' }} icon={faCircleXmark} />
                </button>
            </div>
            <div className="edit-space-divider">
                <div className='flex flex-row justify-between'>
                    <CYTextField text='Outlet 2' className='text-3xl font-bold'></CYTextField>
                    <LinkOutlined className='font-[#147CFC]' style={{ fontSize: '200%', color: '#147CFC'}} rev={undefined} />
                </div>
                <div className='flex justify-between'>
                    <div className='flex flex-col'>
                        <CYTextField text='Group Name' className='' isForm={true} label='Group'></CYTextField>
                        <CYTextField text='Company PTE LTD' className='' isForm={true} label='Company'></CYTextField>
                        <CYTextField text='Group Name' className='' isForm={true} label='Country'></CYTextField>
                        <CYTextField text='Group Name' className='' isForm={true} label='Timezone'></CYTextField>
                        <CYTextField text='Group Name' className='' isForm={true} label='Other Tag'></CYTextField>
                        <CYTextField text='$0.30' className='' isForm={true} label='Tariff'></CYTextField>
                    </div>
                    <div className='flex flex-row gap-x-4'>
                        <CYCustom text={<Badge status="success" text="Live" />} className='' isForm={true} label='Status'></CYCustom>
                        <CYCustom text={<Tag color="green">Audit</Tag>} className='' isForm={true} label='IPMVP'></CYCustom>
                    </div>
                </div>
                <Table columns={columns} dataSource={dataSource} />
                <div className="flex flex-row gap-x-3 justify-between">
                    <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Reset</button>
                    <button type='button' onClick={onClick} className="bg-blue-500 text-white rounded-lg w-full text-sm h-11 text-center">Save</button>
                </div>

            </div>

        </React.Fragment>
    )
}

export default OutletEdit;