import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import OutletEdit from '../components/OutletEdit';
import TableOptionField from '../components/TableOptionField';
import { DummyOutletDataRow } from '../common/constant';
import { v4 as uuidv4 } from 'uuid';
import { gql, useMutation, useQuery, WatchQueryFetchPolicy } from '@apollo/client';
import { customer, outlet } from '../types/datatype';
import ClientOnly from '../components/ClientOnly';
import { calculatePagination } from '../common/helper';
import { useRouter } from 'next/router';
import { EditOutlined } from '@ant-design/icons';
import { Badge, Tag } from 'antd';
import OutletCreate from '../components/OutletCreate';
import TableDynamicInput from '../components/TableDynamicInput';
// import SavingsEdit from '../components/outlet/SavingsEdit';

const Outlets: NextPage = () => {
  return (
    <React.Fragment>
      <ClientOnly>
        <OutletTable></OutletTable>
      </ClientOnly>
      {/* <SavingsEdit openOutletEdit={openOutletEdit} setOpenOutletEdit={setOpenOutletEdit} /> */}
    </React.Fragment>
  )
}

// Outlets.getInitialProps = async () => {
//   const title = 'Outlet';
//   return { title };
// };

const OutletTable: any = () => {

  const router = useRouter();

  const [outlets, setOutlets] = React.useState<outlet[]>([]);
  const [openOutletEdit, setOpenOutletEdit] = React.useState(false);
  const [selectedOutlet, setSelectedOutlet] = React.useState<outlet>();
  const [totalPage, setTotalpage] = React.useState(0);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [isOutletCreateModelOpen, setIsOutletCreateModelOpen] = React.useState(false);
  const [selectedCustomerID, setSelectedCustomerID] = React.useState("");

  // GraphQL
  const getOutletsQuery = gql`
  query Outlets($where: OutletWhereInput, $take: Int, $skip: Int) {
    outlets(where: $where,take: $take, skip: $skip) {
      outlet_id
      name
      customer_id
      outlet_status
      outlet_address
      outlet_type
      customer {
        name
      }
      outlet_month {
        percent_share_of_savings
        last_avail_tariff
        tariff_month
      }
    }
  }`;

  const getCustomersQuery = gql`
  query Customers {
    customers {
      customer_id
      name
    }
  }`;

  const getTotalQuery = gql`
  query _count($where: OutletWhereInput) {
    aggregateOutlet(where: $where) {
      _count {
        _all
      }
    }
  }`;

  const getTotalVariable = {
    "variables": {
      "where": {
        "customer_id": {
          "equals": selectedCustomerID ? parseInt(selectedCustomerID) : -1
        }
      },
      'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
    }
  }

  const mutate_delete_outlet_query = gql`
  mutation DeleteOneOutlet($where: OutletWhereUniqueInput!) {
    deleteOneOutlet(where: $where) {
      outlet_id
    }
  }`;

  const getOutletsVariable = React.useMemo(() => {
    return {
      "variables": {
        "where": {
          "customer_id": {
            "equals": selectedCustomerID ? parseInt(selectedCustomerID) : -1
          }
        },
        "take": 10,
        "skip": (currentPageIndex * 10) - 10,
        'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy
      }
    }
  }, [selectedCustomerID, currentPageIndex]);

  const outletsResult = useQuery(getOutletsQuery, getOutletsVariable);
  const getTotalResult = useQuery(getTotalQuery, getTotalVariable);
  const deleteOutletResult = useMutation(mutate_delete_outlet_query);
  const customersResult = useQuery(getCustomersQuery);

  // Hooks

  React.useEffect(() => {
    const { cus_id } = router.query;
    (cus_id && typeof cus_id === 'string') && setSelectedCustomerID(cus_id);
  }, [router.query])

  React.useEffect(() => {
    if (outletsResult.data && outletsResult.data.outlets) {
      setOutlets(outletsResult.data.outlets);
    } else {
      setOutlets([]);
    }
  }, [outletsResult.data]);

  React.useEffect(() => {
    if (getTotalResult.data && getTotalResult.data.aggregateOutlet) {
      setTotalpage(calculatePagination(getTotalResult.data.aggregateOutlet._count._all));
    } else {
      setTotalpage(0);
    }
  }, [getTotalResult.data]);

  React.useEffect(() => {
    getTotalResult.refetch();
    outletsResult.refetch();
  }, [currentPageIndex]);

  // const resultInArray = React.useMemo(() => {
  //   return outlets ? outlets.map((out) => [out.outlet_id, out.customer?.name, out.name, out.outlet_month ? out.outlet_month[0]?.last_avail_tariff : '', out.outlet_month ? out.outlet_month[0]?.tariff_month : "", out.outlet_month && out.outlet_month[0]?.percent_share_of_savings !== '' ? out.outlet_month[0]?.percent_share_of_savings + " %" : ""]) : [];
  // }, [outlets]);

  const resultInArray = [
    [
      <span className='text-blue-400 cursor-pointer' onClick={() => setOpenOutletEdit(true)}>Outlet 12</span>,
      <TableDynamicInput setText={() => { }} text='Group Name' />,
      <TableDynamicInput setText={() => { }} text='Company Pte Ltd' />,
      <Badge status="success" text="Live" />,
      <Tag color="green">Audit</Tag>,
      <Tag>Taiwan</Tag>,
      <Tag>GMT +8:00</Tag>,
      <div className='flex'>
        <Tag>Taipei</Tag><Tag>Xin Yang area</Tag>
      </div>,
      <div className='flex'>
        <Tag>DD Exhaust</Tag><Tag>Split-screen AC</Tag>
      </div>,
      <div className='flex'>
        <Tag color={"red"}>Split-screen AC</Tag>
      </div>
    ],
    [
      <span className='text-blue-400 cursor-pointer' onClick={() => setOpenOutletEdit(true)}>Outlet 12</span>,
      <TableDynamicInput setText={() => { }} text='Group Name' />,
      <TableDynamicInput setText={() => { }} text='Company Pte Ltd' />,
      <Badge status="success" text="Live" />,
      <Tag color="green">Audit</Tag>,
      <Tag>Taiwan</Tag>,
      <Tag>GMT +8:00</Tag>,
      <div className='flex'>
        <Tag>Taipei</Tag><Tag>Xin Yang area</Tag>
      </div>,
      <div className='flex'>
        <Tag>DD Exhaust</Tag><Tag>Split-screen AC</Tag>
      </div>,
      <div className='flex'>
        <Tag color={"red"}>Split-screen AC</Tag>
      </div>
    ],
    [
      <span className='text-blue-400 cursor-pointer' onClick={() => setOpenOutletEdit(true)}>Outlet 12</span>,
      <TableDynamicInput setText={() => { }} text='Group Name' />,
      <TableDynamicInput setText={() => { }} text='Company Pte Ltd' />,
      <Badge status="success" text="Live" />,
      <Tag color="green">Audit</Tag>,
      <Tag>Taiwan</Tag>,
      <Tag>GMT +8:00</Tag>,
      <div className='flex'>
        <Tag>Taipei</Tag><Tag>Xin Yang area</Tag>
      </div>,
      <div className='flex'>
        <Tag>DD Exhaust</Tag><Tag>Split-screen AC</Tag>
      </div>,
      <div className='flex'>
        <Tag color={"red"}>Split-screen AC</Tag>
      </div>
    ]
  ]

  const customerDropdown = React.useMemo(() => {
    if (customersResult.data && customersResult.data.customers && customersResult.data.customers.length > 0) {
      setSelectedCustomerID(customersResult.data.customers[0].customer_id)
      return customersResult.data.customers.map((cust: any) => {
        return { key: cust.customer_id.toString(), value: cust.name }
      })
    } else {
      return [];
    }
  }, [customersResult.data]);

  return (
    <React.Fragment>
      <OutletCreate isModelOpen={isOutletCreateModelOpen} setIsModelOpen={setIsOutletCreateModelOpen} />
      <Table
        headers={['Outlet', 'Group', 'Company', 'Status', 'IPMVP Stage', 'Country', 'Timezone', 'Other Tags', 'Equipment Types', 'Equipment Paused']}
        data={resultInArray}
        totalNumberOfPages={totalPage} setCurrentSelectedPage={setCurrentPageIndex} currentSelectedPage={currentPageIndex}
        openDetailContent={openOutletEdit}
        setOpenDetailContent={setOpenOutletEdit}
        openCreateContent={isOutletCreateModelOpen}
        setOpenCreateDetail={setIsOutletCreateModelOpen}
        detailContent={<OutletEdit outlet={selectedOutlet} customerDropdown={customerDropdown} afterOperation={() => { getTotalResult.refetch(); outletsResult.refetch(); }} openOutletEdit={openOutletEdit} setOpenOutletEdit={setOpenOutletEdit} selectedCustomerID={parseInt(selectedCustomerID)} />}
        leftSideElements={[
          // <TableOptionField key={uuidv4()} label={'Pte Ltd'} selectedValue={selectedCustomerID.toString()} data={customerDropdown} onChange={(selectedValue: string) => { setSelectedCustomerID(selectedValue) }} />
          <h3 className="text-3xl font-bold">Outlets</h3>
        ]}
        hideDetailMenu={true}
        handleAddNew={() => {
          setSelectedOutlet(undefined);
          setOpenOutletEdit(true);
        }} buttonText={"+ Create Outlet"} rightSideElements={[]} />

    </React.Fragment>
  )

}

export default Outlets
