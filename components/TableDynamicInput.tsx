import Image from "next/image";
import { ButtonProps } from "../common/types";
import { Button, Form, Input, Space } from "antd";
import DynamicSelect from "./DynamicSelect";
import React from "react";
import { CheckOutlined, CloseOutlined, CloseSquareFilled, CloseSquareOutlined, EditOutlined, RightOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";

interface Props {
    text: string;
    setText: (text: string) => void;
}

const TableDynamicInput = ({ text, setText }: Props) => {
    const [editMode, setEditMode] = React.useState(false);
    const [prompt, setPrompt] = React.useState(text);

    const onClick = (val: string) => {
        setText(val);
        setEditMode(false);
    }

    const onRemove = () => {
        setPrompt(text);
        setEditMode(false);
    }


    return editMode ?
        <Space.Compact className="w-full">
            <Input className="w-auto" size="small" value={prompt} onChange={(val) => setPrompt(val.currentTarget.value)} />
            <Button onClick={()=>onRemove()} className="h-auto bg-sky-200" icon={<CloseOutlined
                rev={undefined} />}>
            </Button>
            <Button onClick={()=>onClick(prompt)} className="h-auto" icon={<CheckOutlined rev={undefined} />} type="primary"></Button>
        </Space.Compact>
        : <span>{prompt}<EditOutlined onClick={(data) => {
            setEditMode(true);
        }} rev={undefined}></EditOutlined></span>
}

export default TableDynamicInput;