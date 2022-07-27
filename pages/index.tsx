import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import CustomerEdit from '../components/CustomerEdit'
import { DummyCustomerDataRow } from '../common/constant'

const Customers: NextPage = () => {
  const [openCustomerEdit, setOpenCustomerEdit] = React.useState(false);

  function getDummyCustomerData(): any[] {
    const dummyArr = [];
    for (var i = 0; i < 17; i++) {
      dummyArr.push(DummyCustomerDataRow);
    }
    return dummyArr;
  }

  return (
    <React.Fragment>
      <Table headers={['ID','Name','PIC Name','PIC Phone','Outlets','Equipment']} data={getDummyCustomerData()} handleAddNew={() => setOpenCustomerEdit(true)} handleEdit={(selectedData) => setOpenCustomerEdit(true)} handleDelete={() => setOpenCustomerEdit(true)} rightSideElements={[]} leftSideElements={[]} buttonText={'+ Add New Customer'} />
      <CustomerEdit openCustomerEdit={openCustomerEdit} setOpenCustomerEdit={setOpenCustomerEdit} />
    </React.Fragment >
  )
}

Customers.getInitialProps = async () => {
  const title = 'Customer';
  return { title };
};


export default Customers
