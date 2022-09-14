import { Contact } from "../common/types";
import rfdc from 'rfdc';
import CustomizedInput from "./CustomizedInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import Image from "next/image";
import { outlet_person_in_charge } from "../types/datatype";


const cloneDeep = rfdc();

interface Props {
    contactList: outlet_person_in_charge[];
    outletID?: number;
    setContactList(contacts: outlet_person_in_charge[]): void;
}

const ContactList = ({ outletID, contactList, setContactList }: Props): React.ReactElement => {

    const onChange = (value: any, attributeName: string, index: number) => {
        const cloned_contactList = cloneDeep(contactList);
        cloned_contactList[index][attributeName] = value;
        setContactList(cloned_contactList);
    }

    const selectPrimaryContacts = (index: number) => {
        const cloned_contactList = cloneDeep(contactList);
        cloned_contactList.forEach((contact, idx) => {
            if (idx === index) {
                contact.primary_contact = !contact.primary_contact;
            } else {
                if (contact.primary_contact) {
                    contact.primary_contact = false;
                }
            }
        })
        setContactList(cloned_contactList);
    }

    const revalidateIndexOfPIC = (picList: outlet_person_in_charge[]) => {
        return picList.map((pic, idx) => {
            pic.contact_person_index = idx;
            return pic;
        })
    }

    return (
        <>
            <div className="space-y-6">
                {contactList.map((contactObj, idx) => {
                    return (
                        <>
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row items-center gap-x-2">
                                    <Image onClick={e => {
                                        selectPrimaryContacts(idx);
                                    }} alt="confirmSvg" src={`/asserts/main/${contactObj.primary_contact ? 'confirm.svg' : 'unconfirm.svg'}`} width="24" height="24" />
                                    <h4 className="text-lg text-slate-400">Primary Contact</h4>
                                </div>
                                <div>
                                    <Image onClick={e => {
                                        const clonedContactList = cloneDeep(contactList);
                                        clonedContactList.splice(idx, 1);
                                        setContactList(revalidateIndexOfPIC(clonedContactList));
                                    }} src="/asserts/main/cross.svg" alt="crossSvg" className="cursor-pointer" width="24" height="24" />
                                </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-6 ">
                                <CustomizedInput value={contactObj.contact_person_name} label={"Contact Person"} onChange={(value: string) => onChange(value, 'contact_person_name', idx)} inputType="text" />
                                <CustomizedInput value={contactObj.contact_person_position} label={"Position"} onChange={(value: string) => onChange(value, 'contact_person_position', idx)} inputType="text" />
                                <CustomizedInput value={contactObj.contact_person_address} label={"Email Address"} onChange={(value: string) => onChange(value, 'contact_person_address', idx)} inputType="mail" />
                                <CustomizedInput value={contactObj.contact_person_phone} label={"Phone Number"} onChange={(value: string) => onChange(value, 'contact_person_phone', idx)} inputType="text" />
                            </div>
                        </>)
                })}
                <div className="flex justify-end">
                    <span onClick={e => {
                        setContactList([...contactList, {
                            outlet_id: outletID && outletID,
                            contact_person_index: contactList.length,
                            contact_person_name: 'New Person',
                            contact_person_position: 'Finance Manager',
                            contact_person_address: 'andrew@gmail.com',
                            contact_person_phone: '+628788719580',
                            primary_contact: false,
                        }])
                    }} className="cursor-pointer text-sm text-sky-400">Add More Person in Charge</span>
                </div>
            </div>

        </>
    )
}

export default ContactList;