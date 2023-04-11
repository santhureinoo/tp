import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import { group } from '../types/datatype';
import ClientOnly from '../components/ClientOnly';
import { gql, useQuery } from '@apollo/client';

interface GroupList {
  group_id: number;
  group_name: string;
  password: string;
}

const Groups: NextPage = () => {

  return (
    <React.Fragment>
      <ClientOnly>
        <EquipmentTable></EquipmentTable>
      </ClientOnly>
    </React.Fragment>
  )
}

Groups.getInitialProps = async () => {
  const title = 'Credentials';
  return { title };
};

const EquipmentTable: any = () => {
  const [totalPage, setTotalpage] = React.useState(0);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [groupList, setGroupList] = React.useState<GroupList[]>();

  const getGroupsQuery = gql`
  query Groups {
    groups {
      group_id
      group_name
    }
  }`;

  const getGroupPasswordsQuery = gql`
  query Group_passwords {
    group_passwords {
      password
      group_id
    }
  }`

  const getGroups = useQuery(getGroupsQuery);
  const getGroupPasswords = useQuery(getGroupPasswordsQuery);

  // Hooks 
  React.useEffect(() => {
    if (getGroups.data && getGroups.data.groups
      && getGroupPasswords.data && getGroupPasswords.data.group_passwords) {
      const currentGroups = getGroups.data.groups as group[];
      const currentGpPass = getGroupPasswords.data.group_passwords as any[];
      const currentGpList: GroupList[] = [];
      currentGroups.forEach((group) => {
        const currentPass = currentGpPass.find(pas => pas.group_id === group.group_id);
        currentGpList.push({
          group_id: group.group_id,
          group_name: group.group_name,
          password: currentPass ? currentPass.password : 'No password set!',
        })
      })

      setGroupList(currentGpList);
    }

  }, [getGroups.data, getGroupPasswords.data])


  return (
    <React.Fragment>
      <Table
        headers={['Group ID', 'Name', 'Password']}
        data={groupList || []}
        loading={groupList ? false : true}
        hideDetailMenu={true}
        rightSideElements={[]}
        leftSideElements={[]}
        totalNumberOfPages={totalPage} setCurrentSelectedPage={setCurrentPageIndex} currentSelectedPage={currentPageIndex}
      />

    </React.Fragment>
  )
}

export default Groups
