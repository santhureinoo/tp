import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import TableOptionField from '../components/TableOptionField';
import Searchfield from '../components/Searchfield';
import EquipmentEdit from '../components/EquipmentEdit';
import { v4 as uuidv4 } from 'uuid';
import { outlet, outlet_device_ex_fa_input } from '../types/datatype';
import ClientOnly from '../components/ClientOnly';
import { gql, useQuery } from '@apollo/client';
import { DropdownProps } from '../common/types';

const Equipments: NextPage = () => {


  return (
    <React.Fragment>
      <ClientOnly>
        <EquipmentTable></EquipmentTable>
      </ClientOnly>
    </React.Fragment>
  )
}

Equipments.getInitialProps = async () => {
  const title = 'Equipment';
  return { title };
};

const EquipmentTable: any = () => {
  const [openEquipmentEdit, setOpenEquipmentEdit] = React.useState(false);
  const [selectedCustomerID, setSelectedCustomerID] = React.useState("");
  const [selectedOutletID, setSelectedOutletID] = React.useState("");
  const [selectedEqpt, setSelectedEqpt] = React.useState<outlet_device_ex_fa_input>();
  const [equipments, setEquipments] = React.useState<outlet_device_ex_fa_input[]>([]);
  const [filteredEquipmentsInArray, setFilteredEquipmentsInArray] = React.useState<any[][]>([]);
  const [equipmentsInArray, setEquipmentsInArray] = React.useState<any[][]>([]);

  const getCustomersQuery = gql`
  query Customers {
    customers {
      customer_id
      name
    }
  }`;

  const getOutletsQuery = gql`
  query Outlets($where: OutletWhereInput) {
    outlets(where: $where) {
      outlet_id
      name
    }
  }
  `;

  const getEqptsQuery = gql`
  query Outlet_device_ex_fa_inputs($where: Outlet_device_ex_fa_inputWhereInput) {
    outlet_device_ex_fa_inputs(where: $where) {
      outlet {
        name
        customer {
          name
        }
      }
      name
      device_type
      device_num
      live_date
      outlet_date
      od_ex_fa_input_id
    }
  }
  `;

  const getOutletsVariable = React.useMemo(() => {
    return {
      "variables": {
        "where":
        {
          "customer": {
            "is": {
              "customer_id": {
                "equals": selectedCustomerID ? parseInt(selectedCustomerID) : -1
              }
            }
          }
        }
      }
    }
  }, [selectedCustomerID]);

  const getEqptsVariable = React.useMemo(() => {
    return {
      "variables": {
        "where": {
          "outlet": {
            "is": {
              "customer_id": {
                "equals": selectedCustomerID
              },
              "outlet_id": {
                "equals": selectedOutletID
              }
            }
          }
        }
      }
    }
  }, [selectedCustomerID, selectedOutletID]);

  const outletsResult = useQuery(getOutletsQuery, getOutletsVariable);
  const customersResult = useQuery(getCustomersQuery);
  const eqptsResult = useQuery(getEqptsQuery, getEqptsVariable);

  const customerDropdown: DropdownProps[] = React.useMemo(() => {

    if (customersResult.data && customersResult.data.customers && customersResult.data.customers.length > 0) {
      setSelectedCustomerID(customersResult.data.customers[0].customer_id);
      return customersResult.data.customers.map((cust: any) => {
        return { key: cust.customer_id, value: cust.name }
      })
    } else {
      return [];
    }
  }, [customersResult.data]);

  const outletDropdown: DropdownProps[] = React.useMemo(() => {
    if (outletsResult.data && outletsResult.data.outlets.length > 0) {
      setSelectedOutletID(outletsResult.data.outlets[0].outlet_id)
      return outletsResult.data.outlets.map((outlet: outlet) => {
        return { key: outlet.outlet_id, value: outlet.name };
      })
    } else {
      return [];
    }
  }, [outletsResult.data]);

  // Hooks 
  React.useEffect(() => {
    if (eqptsResult.data && eqptsResult.data.outlet_device_ex_fa_inputs) {
      setEquipments(eqptsResult.data.outlet_device_ex_fa_inputs);
    }
  }, [eqptsResult.data]);

  React.useEffect(() => {
    if (equipments) {
      setFilteredEquipmentsInArray(equipments.map((eqpt) => [eqpt.device_num, eqpt.outlet?.customer?.name, eqpt.outlet?.name, eqpt.device_type, eqpt.name, eqpt.live_date]));
      setEquipmentsInArray(equipments.map((eqpt) => [eqpt.device_num, eqpt.outlet?.customer?.name, eqpt.outlet?.name, eqpt.device_type, eqpt.name, eqpt.live_date]));
    }
  }, [equipments]);

  return (
    <React.Fragment>
      <Table
        headers={['Equipment ID', 'Customer', 'Outlet', 'Equipment Type', 'Equipment Name', 'Valid as Of']}
        data={filteredEquipmentsInArray}
        leftSideElements={[
          <Searchfield data={equipmentsInArray} setFilteredData={setFilteredEquipmentsInArray} key={"eqpt_search"} IconFront={false} WithButton={false} ButtonText={'Search'} />
        ]}
        rightSideElements={[
          <TableOptionField key={uuidv4()} label={'Business'} onChange={(selectedValue: string) => { setSelectedCustomerID(selectedValue) }}
            selectedValue={selectedCustomerID} data={customerDropdown} />,
          <TableOptionField key={uuidv4()} label={'Outlet'} onChange={(selectedValue: string) => { setSelectedOutletID(selectedValue) }}
            selectedValue={selectedOutletID} data={outletDropdown} />,
        ]}
        handleAddNew={() => {
          setSelectedEqpt(undefined);
          setOpenEquipmentEdit(true);
        }} handleEdit={(selectedData) => { setSelectedEqpt(equipments.find(eqpt => eqpt.device_num === selectedData[0])); setOpenEquipmentEdit(true) }} handleDelete={() => setOpenEquipmentEdit(true)} buttonText={"+ Add New Equipment"} />
      <EquipmentEdit eqpt={selectedEqpt} afterOperation={() => eqptsResult.refetch()} selectedOutletID={selectedOutletID} selectedCustomerID={selectedCustomerID} setEqpt={setSelectedEqpt} openEquipmentEdit={openEquipmentEdit} setOpenEquipmentEdit={setOpenEquipmentEdit} />
    </React.Fragment>
  )
}

export default Equipments
