export interface TableProps {
    headers: any[];
    data: any[];
    hiddenDataCol?: any[];
    hiddenDataColIndex?: number[];
    headerColor?: string;
}

export interface Contact {
    ContactPerson: string;
    Position: string;
    EmailAddress: string;
    PhoneNumber: string;
}

export interface DropdownProps {
    key : string;
    value: string;
}
