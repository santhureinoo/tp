import React from 'react';
import rfdc from 'rfdc';
import { defaultOutletMonthShifts } from '../common/constant';
import moment from 'moment';
import { Button, Divider, Form, Input, InputRef, Modal, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const cloneDeep = rfdc();
const { Option } = Select;


const DynamicSelect = () => {
    const [items, setItems] = React.useState(['jack', 'lucy']);
    const [name, setName] = React.useState('');
    const inputRef = React.useRef<InputRef>(null);
    let index = 0;

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return <Select
        placeholder="Select a option and change input text above"
        dropdownRender={(menu) => (
            <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                        placeholder="Please enter item"
                        ref={inputRef}
                        value={name}
                        onChange={() => { }}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button type="text" icon={<PlusOutlined rev={undefined} />} onClick={addItem}>
                        Add item
                    </Button>
                </Space>
            </>
        )}
        options={items.map((item) => ({ label: item, value: item }))}
        allowClear
    >
    </Select>

}

export default DynamicSelect;