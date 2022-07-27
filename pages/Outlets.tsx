import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import OutletEdit from '../components/OutletEdit';
import TableOptionField from '../components/TableOptionField';
import { DummyOutletDataRow } from '../common/constant';
import { v4 as uuidv4 } from 'uuid';
// import SavingsEdit from '../components/outlet/SavingsEdit';

const Outlets: NextPage = () => {
  const [openOutletEdit, setOpenOutletEdit] = React.useState(false);

  function getDummyOutletData(): any[] {
    const dummyArr = [];
    for (var i = 0; i < 17; i++) {
      dummyArr.push(DummyOutletDataRow);
    }
    return dummyArr;
  }
  return (
    <React.Fragment>
      <Table
        headers={['Outlet ID', 'Customer', 'Outlet Name', 'Tariff Rate', 'Date of Tariff', 'Share of Savings']}
        data={getDummyOutletData()}
        leftSideElements={[
          <TableOptionField key={uuidv4()} label={'Outlet'} data={['KFC Indonesia']} />
        ]}
        handleAddNew={() => {
          setOpenOutletEdit(true);
        }} handleEdit={(selectedData) => setOpenOutletEdit(true)} handleDelete={() => setOpenOutletEdit(true)} buttonText={"+ Add New Outlet"} rightSideElements={[]} />
      <OutletEdit openOutletEdit={openOutletEdit} setOpenOutletEdit={setOpenOutletEdit} />
      {/* <SavingsEdit openOutletEdit={openOutletEdit} setOpenOutletEdit={setOpenOutletEdit} /> */}
    </React.Fragment>
  )
}

Outlets.getInitialProps = async () => {
  const title = 'Outlet';
  return { title };
};

export default Outlets
