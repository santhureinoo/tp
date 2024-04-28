import React from 'react';
import rfdc from 'rfdc';
import { defaultOutletMonthShifts } from '../common/constant';
import moment from 'moment';
import { Button, Divider, Form, Input, Modal, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DynamicSelect from './DynamicSelect';
const cloneDeep = rfdc();
const { Option } = Select;

interface Props {
    isModelOpen: boolean;
    setIsModelOpen: (res: boolean) => void;
}

const OutletCreate = ({ isModelOpen, setIsModelOpen }: Props) => {

    return <Modal title="Basic Modal" width={1200} open={isModelOpen} onOk={() => {
        setIsModelOpen(false);
    }} onCancel={() => {

    }}>
        <Form
            layout="horizontal"
            labelWrap
        >
            <div className='flex flex-col items-center w-full'>
                <Form.Item label="Outlet Name">
                    <Input />
                </Form.Item>
                <Form.Item label="Energy Tariff">
                    <Input />
                </Form.Item>
            </div>
            <div className='flex gap-x-2 w-full'>
                <div className='flex flex-col bg-tp-grey w-3/5 px-8 py-4'>
                    <Form.Item label="Select or Create Group">
                        <DynamicSelect></DynamicSelect>
                    </Form.Item>
                    <Form.Item label="Select or Create Company">
                        <DynamicSelect></DynamicSelect>
                    </Form.Item>
                    <Form.Item label="Select or Create Brand">
                        <DynamicSelect></DynamicSelect>
                    </Form.Item>
                </div>
                <div className='flex flex-col bg-tp-grey w-2/5 px-8 py-4'>
                    <Form.Item label="Select Country">
                        <DynamicSelect></DynamicSelect>
                    </Form.Item>
                    <Form.Item label="Select Timezone">
                        <DynamicSelect></DynamicSelect>
                    </Form.Item>
                    <Form.Item label="Other Tags">
                        <DynamicSelect></DynamicSelect>
                    </Form.Item>
                </div>
            </div>
        </Form>
    </Modal>
}

export default OutletCreate;