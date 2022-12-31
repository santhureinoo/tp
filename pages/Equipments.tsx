import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import TableOptionField from '../components/TableOptionField';
import Searchfield from '../components/Searchfield';
import EquipmentEdit from '../components/EquipmentEdit';
import { v4 as uuidv4 } from 'uuid';
import { outlet, outlet_device_ac_input, outlet_device_ex_fa_input, outlet_month_shifts } from '../types/datatype';
import ClientOnly from '../components/ClientOnly';
import { gql, useLazyQuery, useMutation, useQuery, WatchQueryFetchPolicy } from '@apollo/client';
import { DropdownProps } from '../common/types';
import { cloneDeep } from '@apollo/client/utilities';
import { calculatePagination } from '../common/helper';

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
  const [totalPage, setTotalpage] = React.useState(0);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
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

  const deleteAcEqptQuery = gql`
  mutation DeleteOneOutlet_device_ac_input($where: Outlet_device_ac_inputWhereUniqueInput!) {
    deleteOneOutlet_device_ac_input(where: $where) {
      outlet_id
      od_device_input_id
    }
  }`;

  const deleteFaEqptQuery = gql`
  mutation DeleteOneOutlet_device_ex_fa_input($where: Outlet_device_ex_fa_inputWhereUniqueInput!) {
    deleteOneOutlet_device_ex_fa_input(where: $where) {
      outlet_id
      od_device_input_id
    }
  }
  `

  const getEqptsQuery = gql`
  query OutletsWithEqpt($where: OutletWhereInput, $take: Int, $skip: Int) {
    outlets(where: $where, take: $take, skip: $skip) {
      outlet_device_ac_input {
        outlet_id
        od_device_input_id
        outlet_date
        device_num
        ac_baseline_kW
        ac_factor_a
        name
        last_update
        eqpt_serial_no
        eqpt_manufacturer
        live_date
        eqpt_model
        eqpt_photo
        outlet {
          name
          customer {
            name
          }
        }
      }
      outlet_device_ex_fa_input {
        outlet_id
        od_device_input_id
        name
        outlet_date
        device_type
        device_num
        vfd_kW
        display_baseline_kW
        display_low_kW
        dmm_baseline_kW
        dmm_low_kW
        caltr_type
        last_update
        eqpt_serial_no
        eqpt_manufacturer
        live_date
        eqpt_model
        eqpt_photo
        outlet {
          name
          customer {
            name
          }
        }
      }
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
          "customer_id": {
            "equals": selectedCustomerID
          },
          "outlet_id": {
            "equals": selectedOutletID
          }
        },
        "take": 5,
        "skip": (currentPageIndex * 5) - 5
      }
    }
  }, [selectedCustomerID, selectedOutletID, currentPageIndex]);

  const getTotalAcQuery = gql`
  query AggregateOutlet_device_ac_input($where: Outlet_device_ac_inputWhereInput) {
    aggregateOutlet_device_ac_input(where: $where) {
      _count {
        _all
      }
    }
  }
  `;

  const getTotalAcExFaVariable = {
    "variables": {
      "where": {
        "outlet_id": {
          "equals": selectedOutletID
        }
      }
    }
  };

  const getTotalExFaQuery = gql`
  query AggregateOutlet_device_ex_fa_input($where: Outlet_device_ex_fa_inputWhereInput) {
    aggregateOutlet_device_ex_fa_input(where: $where) {
      _count {
        _all
      }
    }
  }
  `



  const outletsResult = useQuery(getOutletsQuery, getOutletsVariable);
  const customersResult = useQuery(getCustomersQuery);
  const eqptsResult = useLazyQuery(getEqptsQuery, getEqptsVariable);
  const deleteAcEqptResult = useMutation(deleteAcEqptQuery);
  const deleteFaEqptResult = useMutation(deleteFaEqptQuery);
  const getTotalAcResult = useQuery(getTotalAcQuery, getTotalAcExFaVariable);
  const getTotalExFaResult = useQuery(getTotalExFaQuery, getTotalAcExFaVariable);

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
    eqptsResult[0]().then(res => {
      if (res.data && res.data.outlets) {
        const outletsWithEqpts = res.data.outlets as outlet[];
        let eqptList: any[] = [];

        outletsWithEqpts.map(oe => {
          let ac_list = oe.outlet_device_ac_input as any[];
          if (ac_list.length > 0) {
            ac_list = ac_list.map(ac => {
              const cloned_ac = cloneDeep(ac);
              cloned_ac.device_type = 'ac';
              return cloned_ac;
            })
          }

          eqptList = [...oe.outlet_device_ex_fa_input || [], ...ac_list || []];
        })
        setEquipments(eqptList);
        getTotalAcResult.refetch();
        getTotalExFaResult.refetch();
      }

    })
  }, [selectedCustomerID, selectedOutletID, currentPageIndex,eqptsResult,getTotalAcResult]);

  React.useEffect(() => {
    if (getTotalExFaResult.data && getTotalAcResult.data && getTotalExFaResult.data.aggregateOutlet_device_ex_fa_input && getTotalAcResult.data.aggregateOutlet_device_ac_input) {
      setTotalpage(calculatePagination(getTotalExFaResult.data.aggregateOutlet_device_ex_fa_input._count._all, getTotalAcResult.data.aggregateOutlet_device_ac_input._count._all));
    } else {
      setTotalpage(0);
    }
  }, [getTotalExFaResult.data && getTotalAcResult.data]);

  React.useEffect(() => {
    if (equipments) {
      setFilteredEquipmentsInArray(equipments.map((eqpt: outlet_device_ex_fa_input) => [eqpt.device_num, eqpt.outlet?.customer?.name, eqpt.outlet?.name, eqpt.device_type, eqpt.name, eqpt.live_date, eqpt.od_device_input_id]));
      setEquipmentsInArray(equipments.map((eqpt: outlet_device_ex_fa_input) => {
        return [eqpt.device_num, eqpt.outlet?.customer?.name, eqpt.outlet?.name, eqpt.device_type, eqpt.name, eqpt.live_date, eqpt.od_device_input_id];
      }));
    }
  }, [equipments]);

  return (
    <React.Fragment>
      <Table
        headers={['Equipment ID', 'Customer', 'Outlet', 'Equipment Type', 'Equipment Name', 'Valid as Of']}
        hiddenDataCol={['od_device_input_id']}
        hiddenDataColIndex={[6]}
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
        // totalNumberOfPages={totalPage} setCurrentSelectedPage={setCurrentPageIndex} currentSelectedPage={currentPageIndex}
        handleAddNew={() => {
          setSelectedEqpt(undefined);
          setOpenEquipmentEdit(true);
        }} handleEdit={(selectedData) => { setSelectedEqpt((equipments as any[]).find((eqpt: any) => eqpt.device_num === selectedData[0])); setOpenEquipmentEdit(true) }} handleDelete={(data) => {
          const id = data[6];
          const type = data[3];

          if (type === "ac") {
            deleteAcEqptResult[0]({
              variables: {
                "where": {
                  "od_device_input_id": id
                },
              }
            }).then(res => {
              eqptsResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
                if (res.data && res.data.outlets) {
                  const outletsWithEqpts = res.data.outlets as outlet[];
                  let eqptList: any[] = [];

                  outletsWithEqpts.map(oe => {
                    let ac_list = oe.outlet_device_ac_input as any[];
                    if (ac_list.length > 0) {
                      ac_list = ac_list.map(ac => {
                        const cloned_ac = cloneDeep(ac);
                        cloned_ac.device_type = 'ac';
                        return cloned_ac;
                      })
                    }

                    eqptList = [...oe.outlet_device_ex_fa_input || [], ...ac_list || []];
                  })
                  setEquipments(eqptList);
                  getTotalAcResult.refetch();
                  getTotalExFaResult.refetch();
                }

              })
            })
          } else {
            deleteFaEqptResult[0]({
              variables: {
                "where": {
                  "od_device_input_id": id
                },
              }
            }).then(res => {
              eqptsResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
                if (res.data && res.data.outlets) {
                  const outletsWithEqpts = res.data.outlets as outlet[];
                  let eqptList: any[] = [];

                  outletsWithEqpts.map(oe => {
                    let ac_list = oe.outlet_device_ac_input as any[];
                    if (ac_list.length > 0) {
                      ac_list = ac_list.map(ac => {
                        const cloned_ac = cloneDeep(ac);
                        cloned_ac.device_type = 'ac';
                        return cloned_ac;
                      })
                    }

                    eqptList = [...oe.outlet_device_ex_fa_input || [], ...ac_list || []];
                  })
                  setEquipments(eqptList);
                  getTotalAcResult.refetch();
                  getTotalExFaResult.refetch();
                }

              })
            })
          }
        }} buttonText={"+ Add New Equipment"} />
      <EquipmentEdit eqpt={selectedEqpt} afterOperation={() => {
        eqptsResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
          if (res.data && res.data.outlets) {
            const outletsWithEqpts = res.data.outlets as outlet[];
            let eqptList: any[] = [];

            outletsWithEqpts.map(oe => {
              let ac_list = oe.outlet_device_ac_input as any[];
              if (ac_list.length > 0) {
                ac_list = ac_list.map(ac => {
                  const cloned_ac = cloneDeep(ac);
                  cloned_ac.device_type = 'ac';
                  return cloned_ac;
                })
              }

              eqptList = [...oe.outlet_device_ex_fa_input || [], ...ac_list || []];
            })
            setEquipments(eqptList);
            getTotalAcResult.refetch();
            getTotalExFaResult.refetch();
          }

        })
      }} selectedOutletID={selectedOutletID} selectedCustomerID={selectedCustomerID} setEqpt={setSelectedEqpt} openEquipmentEdit={openEquipmentEdit} setOpenEquipmentEdit={setOpenEquipmentEdit} />
    </React.Fragment>
  )
}

export default Equipments
