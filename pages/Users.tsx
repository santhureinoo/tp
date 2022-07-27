import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import { DummyBillingDataRow, DummyEquipmentDataRow } from '../common/constant'
import TableOptionField from '../components/TableOptionField';
import UserEdit from '../components/UserEdit';
import { v4 as uuidv4 } from 'uuid';
import Searchfield from '../components/Searchfield';

const Users: NextPage = () => {
  const [openUserEdit, setOpenUserEdit] = React.useState(false);

  function getDummyUserData(): any[] {
    const dummyArr = [];
    for (var i = 0; i < 17; i++) {
      dummyArr.push(DummyEquipmentDataRow);
    }
    return dummyArr;
  }

  return (
    <React.Fragment>
       <Table
        headers={['Equipment ID', 'Customer', 'Outlet', 'Equipment Type', 'Equipment Name', 'Valid as Of']}
        data={getDummyUserData()}
        leftSideElements={[
          <Searchfield key={uuidv4()} IconFront={false} WithButton={false} ButtonText={'Search'} />
        ]}
        rightSideElements={[
          <TableOptionField key={uuidv4()} label={'Business'} data={['All', 'Some']} />,
          <TableOptionField key={uuidv4()} label={'Outlet'} data={['All', 'Some']} />,
        ]}
        handleAddNew={() => {
          setOpenUserEdit(true);
        }} handleEdit={(selectedData) => setOpenUserEdit(true)} handleDelete={() => setOpenUserEdit(true)} buttonText={"+ Add New User"} />
      <UserEdit openUserEdit={openUserEdit} setOpenUserEdit={setOpenUserEdit} />
    </React.Fragment >
  )
}

Users.getInitialProps = async () => {
  const title = 'User';
  return { title };
};


export default Users
