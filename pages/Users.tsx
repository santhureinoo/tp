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
        headers={['Name', 'Email', 'Position/Title', 'Role', 'Assigned', 'Invoice Access', 'Edit User', 'Reset Password', 'Delete User']}
        data={getDummyUserData()}
        leftSideElements={[
          <h3 className="text-3xl font-bold">Users</h3>
        ]}
        rightSideElements={[

        ]}
        hideDetailMenu={true}
        handleAddNew={() => {
          setOpenUserEdit(true);
        }} handleEdit={(selectedData) => setOpenUserEdit(true)} handleDelete={() => setOpenUserEdit(true)} buttonText={"+ Add New User"} />
      <UserEdit openUserEdit={openUserEdit} setOpenUserEdit={setOpenUserEdit} />
    </React.Fragment >
  )
}

// Users.getInitialProps = async () => {
//   const title = 'User';
//   return { title };
// };


export default Users
