import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import OutletInformation from "./outlet/OutletInformation";
import SavingsInformation from "./outlet/SavingsInformation";
import { gql, useLazyQuery, useMutation, WatchQueryFetchPolicy } from "@apollo/client";
import { outlet, outlet_month, outlet_person_in_charge } from "../types/datatype"; import rfdc from 'rfdc';
import { defaultOutletMonthShifts } from '../common/constant';
const cloneDeep = rfdc();

interface Props {
    openOutletEdit: boolean;
    setOpenOutletEdit(openOutletEdit: boolean): void;
    selectedCustomerID: number;
    outlet?: outlet;
    afterOperation?: () => void;
}

const OutletEdit = ({ openOutletEdit, setOpenOutletEdit, outlet, selectedCustomerID, afterOperation }: Props) => {
    // const [contactList, setContactList] = React.useState<outlet_person_in_charge[]>([]);
    const [outletMonth, setOutletMonth] = React.useState<outlet_month>({
        no_of_ac_in_outlet: 0,
        no_of_ex_in_outlet: 0,
        no_of_fa_in_outlet: 0,
        no_of_ex_installed: 0,
        no_of_fa_installed: 0,
        no_of_ac_installed: 0,
        remarks_on_eqpt_in_outlet_or_installed: "",
        remarks_on_overall_outlet: "",
        outlet_date: "0",
        outlet_outlet_id: -1,
        percent_share_of_savings: "",
        last_avail_tariff: "",
        tariff_month: "",

    });
    const [selectedInformation, setSelectedinformation] = React.useState(1);
    const [currentOutlet, setCurrentOutlet] = React.useState<outlet>({
        outlet_id: -1,
        customer_id: selectedCustomerID,
        name: "",
        outlet_status: "Live",
        outlet_address: "",
        outlet_type: "Restaurant",
        outlet_month_shifts: defaultOutletMonthShifts,
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
          outlet_month_shifts {
            outlet_id
            outlet_date
            day_of_week
            shift_num
            startTime
            endTime
            remarks_on_op_hours
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
                            "updateMany": currentOutlet.outlet_month_shifts.map(shift => {
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
                                        }
                                    }
                                }
                            })
                        } : undefined,
                        "outlet_person_in_charges": selectedInformation === 1 && currentOutlet.outlet_person_in_charges ? {
                            "upsert": currentOutlet.outlet_person_in_charges.map(contact => {
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
                        "outlet_month": selectedInformation === 2 ? {
                            "update": [
                                {
                                    "data": {
                                        "outlet_date": {
                                            "set": outletMonth.outlet_date
                                        },
                                        "percent_share_of_savings": {
                                            "set": outletMonth.percent_share_of_savings
                                        },
                                        "last_avail_tariff": {
                                            "set": outletMonth.last_avail_tariff
                                        },
                                        "tariff_month": {
                                            "set": outletMonth.tariff_month
                                        },
                                        "remarks_on_eqpt_in_outlet_or_installed": {
                                            "set": outletMonth.remarks_on_eqpt_in_outlet_or_installed
                                        },
                                        "no_of_ex_in_outlet": {
                                            "set": outletMonth.no_of_ex_in_outlet
                                        },
                                        "no_of_fa_in_outlet": {
                                            "set": outletMonth.no_of_fa_in_outlet
                                        },
                                        "no_of_ac_in_outlet": {
                                            "set": outletMonth.no_of_ac_in_outlet
                                        },
                                        "no_of_ex_installed": {
                                            "set": outletMonth.no_of_ex_installed
                                        },
                                        "no_of_fa_installed": {
                                            "set": outletMonth.no_of_fa_installed
                                        },
                                        "no_of_ac_installed": {
                                            "set": outletMonth.no_of_ac_installed
                                        },
                                        "remarks_on_overall_outlet": {
                                            "set": outletMonth.remarks_on_overall_outlet
                                        }
                                    },
                                    "where": {
                                        "outlet_outlet_id_outlet_date": {
                                            "outlet_outlet_id": outletMonth.outlet_outlet_id,
                                            "outlet_date": outletMonth.outlet_date
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
                                "data": currentOutlet.outlet_month_shifts.map(({ outlet_id, ...shift }) => shift)
                            }
                        } : undefined,
                        "outlet_month": {
                            "create": [
                                {
                                    "outlet_date": outletMonth.outlet_date,
                                    "percent_share_of_savings": outletMonth.percent_share_of_savings,
                                    "last_avail_tariff": outletMonth.last_avail_tariff,
                                    "tariff_month": outletMonth.tariff_month,
                                    "no_of_ex_in_outlet": outletMonth.no_of_ex_in_outlet,
                                    "no_of_fa_in_outlet": outletMonth.no_of_fa_in_outlet,
                                    "no_of_ac_in_outlet": outletMonth.no_of_ac_in_outlet,
                                    "no_of_ex_installed": outletMonth.no_of_ex_installed,
                                    "no_of_fa_installed": outletMonth.no_of_fa_installed,
                                    "no_of_ac_installed": outletMonth.no_of_ac_installed,
                                    "remarks_on_overall_outlet": outletMonth.remarks_on_overall_outlet,
                                    "remarks_on_eqpt_in_outlet_or_installed": outletMonth.remarks_on_eqpt_in_outlet_or_installed
                                }
                            ]
                        }

                    }
                }
            };

            createMutationQuery(MUTATE_VARIABLES).then((val) => {
                afterOperation && afterOperation();
                setOpenOutletEdit(false);
            });
        }

    }

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
                    selectedInformation === 1 ? <OutletInformation setOutlet={setCurrentOutlet} outlet={currentOutlet} /> : <SavingsInformation outlet_month={outletMonth} setOutletMonth={setOutletMonth} setOutlet={setCurrentOutlet} outlet={currentOutlet} />
                }
                <div className="flex flex-row gap-x-3 justify-between">
                    <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Reset</button>
                    <button type='button' onClick={onClick} className="bg-blue-500 text-white rounded-lg w-full text-sm h-11 text-center">Save</button>
                </div>


            </div>

        </div>
    )
}

export default OutletEdit;