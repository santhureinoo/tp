import CustomizedInput from "./CustomizedInput"
import React from 'react';
import Searchfield from "./Searchfield";
import SummaryTable from "./SummaryTable";
import ContactList from "./ContactList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { customer, customer_person_in_charge } from "../types/datatype";
import rfdc from 'rfdc';
import { gql, useMutation, useQuery } from "@apollo/client";

const cloneDeep = rfdc();


interface Props {
    openCustomerEdit: boolean;
    setOpenCustomerEdit(setCE: boolean): void;
    customer?: customer;
    afterOperation?: () => void;
}

const CustomerEdit = ({ afterOperation, openCustomerEdit, setOpenCustomerEdit, customer }: Props) => {

    const [contactList, setContactList] = React.useState<customer_person_in_charge[]>([]);
    const [currentCustomer, setCurrentCustomer] = React.useState<customer>({
        name: "",
        pic_name: "",
        pic_phone: "",
        pte_ltd_name: "",
        country: "",
        city: "",
        current_address: "",
        postal_code: "",
        customer_id: -1,
    });

    const get_custome_pics_query = gql`
    query Customer_person_in_charges($where: Customer_person_in_chargeWhereInput) {
        customer_person_in_charges(where: $where) {
          customer_id
          contact_person_index
          contact_person_name
          contact_person_position
          contact_person_address
          contact_person_phone
          primary_contact
        }
      }`;

    const mutate_customer_query = gql`mutation DeleteOneGlobal_input($data: CustomerCreateInput!) {
        createOneCustomer(data: $data) {
          customer_id
          name
          pte_ltd_name
          pic_name
          pic_phone
          country
          city
          current_address
          postal_code
        }
      }`;

    const mutate_update_customer_query = gql`mutation UpdateOneCustomer($data: CustomerUpdateInput!, $where: CustomerWhereUniqueInput!) {
        updateOneCustomer(data: $data, where: $where) {
          customer_id
          name
          pte_ltd_name
          pic_name
          pic_phone
          country
          city
          current_address
          postal_code
          customer_person_in_charges {
            customer_id
            contact_person_index
          }
        }
      }`;

    const getOutletsQuery = gql`
    query Outlets($where: OutletWhereInput) {
        outlets(where: $where) {
          outlet_id
          name
          _count {
            outlet_device_ex_fa_input
          }
        }
      }`;

    const getOUtletsVariable = {
        variables: {
            "where": {
                "customer_id": {
                    "equals": currentCustomer.customer_id
                }
            }
        }
    };

    const getCustomerPICsVariable = {
        'variables': {
            "where": {
                "customer_id": {
                    "equals": currentCustomer.customer_id
                }
            }
        }
    }

    const getOutletsResult = useQuery(getOutletsQuery, getOUtletsVariable);
    const getCustomerPICsResult = useQuery(get_custome_pics_query, getCustomerPICsVariable);
    const [createMutationQuery, { data, loading, error }] = useMutation(mutate_customer_query);
    const [updateMutationQuery, updateMutationResult = { data, loading, error }] = useMutation(mutate_update_customer_query);
    const [filteredOutletsInArray, setFilteredOutletsInArray] = React.useState<any[][]>([]);
    const [outletsInArray, setOutletsInArray] = React.useState<any[][]>([]);

    React.useEffect(() => {
        if (getOutletsResult.data) {
            setFilteredOutletsInArray(getOutletsResult.data.outlets.map((out: any) => [out.outlet_id, out.name, out._count.outlet_device_ex_fa_input, <FontAwesomeIcon style={{ fontSize: '2em', color: '#E8F2FF' }} icon={faCircle}></FontAwesomeIcon>]));
            setOutletsInArray(getOutletsResult.data.outlets.map((out: any) => [out.outlet_id, out.name, out._count.outlet_device_ex_fa_input, <FontAwesomeIcon style={{ fontSize: '2em', color: '#E8F2FF' }} icon={faCircle}></FontAwesomeIcon>]));
        }
    }, [getOutletsResult.data]);

    React.useEffect(() => {
        if (getCustomerPICsResult.data && getCustomerPICsResult.data.customer_person_in_charges) {
            setContactList(getCustomerPICsResult.data.customer_person_in_charges);
        }
    }, [getCustomerPICsResult.data]);

    const onChange = (value: any, attributeName: string) => {
        const cloned_current_customer: customer = cloneDeep(currentCustomer);
        cloned_current_customer[attributeName] = value;
        setCurrentCustomer(cloned_current_customer);
    }

    const onClick = (event: any) => {
        if (currentCustomer.customer_id !== -1) {
            const MUTATE_VARIABLES = {
                variables: {
                    "where": {
                        "customer_id": currentCustomer.customer_id
                    },
                    "data": {
                        "name": {
                            "set": currentCustomer.name,
                        },
                        "pte_ltd_name": {
                            "set": currentCustomer.pte_ltd_name
                        },
                        "pic_name": {
                            "set": currentCustomer.pic_name
                        },
                        "pic_phone": {
                            "set": currentCustomer.pic_phone
                        },
                        "country": {
                            "set": currentCustomer.country
                        },
                        "city": {
                            "set": currentCustomer.city
                        },
                        "current_address": {
                            "set": currentCustomer.current_address
                        },
                        "postal_code": {
                            "set": currentCustomer.postal_code
                        },
                        "customer_person_in_charges": {
                            "upsert": contactList.map(contact => {
                                return {
                                    "where": {
                                        "customer_id_contact_person_index": {
                                            "customer_id": contact.customer_id ? contact.customer_id : currentCustomer.customer_id,
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
                                        "gte": contactList.length
                                    }
                                }
                            ]
                        },
                    }
                }
            };
            updateMutationQuery(MUTATE_VARIABLES).then((val) => { afterOperation && afterOperation(); setOpenCustomerEdit(false); })
        } else {
            const MUTATE_VARIABLES = {
                variables: {
                    "data": {
                        "name": currentCustomer.name,
                        "pte_ltd_name": currentCustomer.pte_ltd_name,
                        "pic_name": currentCustomer.pic_name,
                        "pic_phone": currentCustomer.pic_phone,
                        "country": currentCustomer.country,
                        "city": currentCustomer.city,
                        "current_address": currentCustomer.current_address,
                        "postal_code": currentCustomer.postal_code,
                        "customer_person_in_charges": {
                            "createMany": {
                                "data": contactList
                            }
                        },
                    }
                }
            };
            createMutationQuery(MUTATE_VARIABLES).then((val) => { afterOperation && afterOperation(); setOpenCustomerEdit(false); });
        }

    }

    React.useEffect(() => {
        if (customer) {
            setCurrentCustomer(customer);
        } else {
            setCurrentCustomer({
                name: "",
                pic_name: "",
                pic_phone: "",
                pte_ltd_name: "",
                country: "",
                city: "",
                current_address: "",
                postal_code: "",
                customer_id: -1,
            });
        }
    }, [customer]);

    return (
        <div className={` edit-container ${openCustomerEdit ? "translate-x-0 " : "translate-x-full"}`}>
            <div className="flex justify-end">
                <button onClick={(e) => { setOpenCustomerEdit(!openCustomerEdit) }} className={`w-8 h-8`} type='button'>
                    <FontAwesomeIcon style={{ fontSize: '2em', cursor: 'pointer' }} icon={faCircleXmark} />
                </button>
            </div>
            <div className="edit-space-divider">
                <div className="space-x-3 space-y-3">
                    <div>
                        <h2><b>Customer</b> <br /> Information</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 pb-6">
                        <CustomizedInput label={"Customer ID"} inputType="text" value={currentCustomer.customer_id === -1 ? "" : currentCustomer.customer_id.toString()} />
                        <CustomizedInput onChange={(value) => { onChange(value, "name") }} label={"Customer Name"} inputType="text" value={currentCustomer.name} />
                        <CustomizedInput onChange={(value) => { onChange(value, "country") }} label={"Country"} inputType="text" value={currentCustomer.country} />
                        <CustomizedInput onChange={(value) => { onChange(value, "city") }} label={"City"} inputType="text" value={currentCustomer.city} />
                        <CustomizedInput onChange={(value) => { onChange(value, "current_address") }} label={"Current Adress"} inputType="text" value={currentCustomer.current_address} />
                        <CustomizedInput onChange={(value) => { onChange(value, "postal_code") }} label={"Postal Code"} inputType="text" value={currentCustomer.postal_code} />
                    </div>
                </div>
                <div className="edit-sub-container">
                    <div className="flex">
                        <h2><b>Person In Charge</b><br /> Information</h2>
                    </div>
                    <ContactList contactList={contactList} setContactList={setContactList} />
                </div>
                <div className="edit-sub-container">
                    <div className="flex justify-between">
                        <h2><b>Outlet</b><br />Assignment</h2>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-x-1 gap-y-8">
                        <Searchfield IconFront={true} WithButton={true} ButtonText={"Search"} data={outletsInArray} setFilteredData={setFilteredOutletsInArray} />
                        <div className="w-full overflow-auto max-h-summaryTableHeight">
                            <SummaryTable headers={['ID', 'Name', 'Equipment', '']} data={filteredOutletsInArray} />
                        </div>
                        <div className="flex justify-end">
                            <span onClick={e => {
                            }} className="cursor-pointer text-sm text-sky-400">Add Outlet Data</span>
                        </div>

                    </div>
                </div>
                <div className="flex flex-row gap-x-3 justify-between">
                    <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Reset</button>
                    <button type='button' onClick={onClick} className="bg-blue-500 text-white rounded-lg w-full text-sm h-11 text-center">Save</button>
                </div>
            </div>

        </div>
    )
}

export default CustomerEdit;