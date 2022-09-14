import type { NextPage } from 'next';
import Table from '../components/Table';
import React from 'react';
import CustomerEdit from '../components/CustomerEdit';
import ClientOnly from '../components/ClientOnly';
import { customer } from '../types/datatype';
import { gql, useMutation, useQuery } from '@apollo/client';

const Customers: NextPage = () => {
  return (
    <React.Fragment>
      <ClientOnly>
        <CustomerTable></CustomerTable>
      </ClientOnly>
    </React.Fragment >
  )
}

Customers.getInitialProps = async () => {
  const title = 'Customer';
  return { title };
};

const CustomerTable: any = () => {
  const [customers, setCustomers] = React.useState<customer[]>([]);
  const [openCustomerEdit, setOpenCustomerEdit] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<customer>();
  const getCustomersQuery = gql`
  query Customers {
    customers {
      customer_id
      name
      pte_ltd_name
      pic_name
      pic_phone
      country
      city
      current_address
      postal_code
      outlet {
        _count {
          results
        }
      }
    }
  }`;
  
  const mutate_delete_customer_query = gql`
    mutation DeleteOneCustomer($where: CustomerWhereUniqueInput!) {
        deleteOneCustomer(where: $where) {
          customer_id
        }
      }`;

  const { loading, error, data, refetch } = useQuery(getCustomersQuery);
  const [deleteMutationQuery, deleteMutationResult = { data, loading, error }] = useMutation(mutate_delete_customer_query);

  React.useEffect(() => {
    if (data && data.customers) {
      setCustomers(data.customers);
    }
  }, [data]);

  const resultInArray = React.useMemo(() => {
    return customers ? customers.map((cur) => [cur.customer_id, cur.name, cur.pic_name, cur.pic_phone, 0, 0]) : [];
  }, [customers]);


  return (
    <React.Fragment>
      <Table headers={['ID', 'Name', 'PIC Name', 'PIC Phone', 'Outlets', 'Equipment']} data={resultInArray} handleAddNew={() => { setSelectedCustomer(undefined); setOpenCustomerEdit(true) }} handleEdit={(selectedData) => { setOpenCustomerEdit(true); setSelectedCustomer(customers.find(customer => customer.customer_id === selectedData[0])) }} handleDelete={(selectedData) => {
        deleteMutationQuery({
          variables: {
            "where": {
              "customer_id": selectedData[0]
            },
          }
        }).then((value) => {
          refetch();
        })
      }} rightSideElements={[]} leftSideElements={[]} buttonText={'+ Add New Customer'} />
      <CustomerEdit afterOperation={() => refetch()} customer={selectedCustomer} openCustomerEdit={openCustomerEdit} setOpenCustomerEdit={setOpenCustomerEdit} />
    </React.Fragment>

  )

}


export default Customers
