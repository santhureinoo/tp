import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import { DummyBillingDataRow } from '../common/constant'
import TableOptionField from '../components/TableOptionField';
import BillingEdit from '../components/BillingEdit';
import { v4 as uuidv4 } from 'uuid';
import PillButton from '../components/PillButton';

const Billings: NextPage = () => {
  const [openBillingEdit, setOpenBillingEdit] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState();

  function getDummyCustomerData(): any[] {
    const dummyArr = [];
    for (var i = 0; i < 16; i++) {
      dummyArr.push(DummyBillingDataRow);
    }
    dummyArr.push({
      IID: 'Set-2095860',
      CUS: 'KFC Holding Indonesia',
      PER: 'Sep, 2022',
      OUT: '5',
      TSF: '$485.09',
      TSS: '$250',
      TSK: (<div className="flex flex-row gap-x-6 items-center justify-between"><span>470</span><PillButton className={"text-yellow-600 bg-yellow-500 w-40 h-8"} text={"Invoice Generated"} /></div>),
      STA: 'Generated',
    })
    return dummyArr;
  }

  return (
    <React.Fragment>
      <Table headers={['Invoice ID', 'Customer', 'Period', 'Outlets', 'Total Service Fee', 'Total Savings($)', 'Total Savings(kWh)']} hiddenDataCol={['STA']} data={getDummyCustomerData()} handleAddNew={() => setOpenBillingEdit(true)} handleEdit={(selectedData) => { setOpenBillingEdit(true); setSelectedData(selectedData); }} handleDelete={() => setOpenBillingEdit(true)}
        rightSideElements={[<TableOptionField key={uuidv4()} label={'Customer'} data={['All', 'Some']} />,
        <TableOptionField key={uuidv4()} label={'Month'} data={['All', 'Some']} />]}
        leftSideElements={[]} />
      <BillingEdit billingData={selectedData} openBillingEdit={openBillingEdit} setOpenBillingEdit={setOpenBillingEdit} />
    </React.Fragment >
  )
}

Billings.getInitialProps = async () => {
  const title = 'Billing';
  return { title };
};


export default Billings
