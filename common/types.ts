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


export interface ButtonProps {
    text : string;
    onClick? : () => void;
    disable? : boolean;
    css : string;
}

export interface FileInfo {
    name: string;
    type: string;
    downloadURL? : string;
}