import Image from "next/image";
import { ButtonProps } from "../common/types";
import { Form, Input } from "antd";
import DynamicSelect from "./DynamicSelect";
import React from "react";
import { EditOutlined } from "@ant-design/icons";

interface Props {
    text: string;
    className: string;
    isForm?: boolean;
    label?: string;
}

const CYTextField = ({ text, className, isForm = false, label = 'Default' }: Props) => {
    const [editMode, setEditMode] = React.useState(false);

    return (
        isForm ? (<Form.Item className="m-0" label={label}>
            {
                !editMode ?
                    <span className={className}>{text}<EditOutlined onClick={(data) => {
                        setEditMode(!editMode);
                    }} rev={undefined}></EditOutlined></span>
                    : <Input />
            }
        </Form.Item>) : (!editMode ?
            <span className={className}>{text}<EditOutlined onClick={(data) => {
                setEditMode(!editMode);
            }} rev={undefined}></EditOutlined></span>
            : <Input />));
}

export default CYTextField;