import Image from "next/image";
import { ButtonProps } from "../common/types";
import { Form, Input } from "antd";
import DynamicSelect from "./DynamicSelect";
import React from "react";
import { EditOutlined } from "@ant-design/icons";

interface Props {
    text: JSX.Element;
    className: string;
    isForm?: boolean;
    label?: string;
}

const CYCustom = ({ text, className, label = 'Default' }: Props) => {
    const [editMode, setEditMode] = React.useState(false);

    return <div className="flex flex-col">
        <Form.Item className="m-0" label={label}>
            {
                !editMode ?

                    <div className={className}><EditOutlined onClick={(data) => {
                        setEditMode(!editMode);
                    }} rev={undefined}></EditOutlined>
                    </div>
                    : <Input />
            }
        </Form.Item>
        {text}
    </div>
}

export default CYCustom;