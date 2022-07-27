export interface TableProps {
    headers: any[];
    data: any[];
    hiddenDataCol?: any[];
    headerColor?: string;
}

export interface Contact {
    ContactPerson: string;
    Position: string;
    EmailAddress: string;
    PhoneNumber: string;
}