import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import OutletEdit from '../components/OutletEdit';
import TableOptionField from '../components/TableOptionField';
import { DummyEquipmentDataRow } from '../common/constant';
import Searchfield from '../components/Searchfield';
import EquipmentEdit from '../components/EquipmentEdit';
import { v4 as uuidv4 } from 'uuid';

const Equipments: NextPage = () => {
  const [openEquipmentEdit, setOpenEquipmentEdit] = React.useState(false);

  function getDummyEquipmentData(): any[] {
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
        data={getDummyEquipmentData()}
        leftSideElements={[
          <Searchfield key={uuidv4()} IconFront={true} WithButton={false} ButtonText={'Search'} />
        ]}
        rightSideElements={[
          <TableOptionField key={uuidv4()} label={'Business'} data={['All', 'Some']} />,
          <TableOptionField key={uuidv4()} label={'Outlet'} data={['All', 'Some']} />,
        ]}
        handleAddNew={() => {
          setOpenEquipmentEdit(true);
        }} handleEdit={() => setOpenEquipmentEdit(true)} handleDelete={() => setOpenEquipmentEdit(true)} buttonText={"+ Add New Equipment"} />
      <EquipmentEdit openEquipmentEdit={openEquipmentEdit} setOpenEquipmentEdit={setOpenEquipmentEdit} />
    </React.Fragment>
  )
}

Equipments.getInitialProps = async () => {
  const title = 'Equipment';
  return { title };
};

export default Equipments
