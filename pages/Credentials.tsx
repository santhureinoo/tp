import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import { group } from '../types/datatype';
import ClientOnly from '../components/ClientOnly';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Checkbox, Input, InputRef, Row, Space } from 'antd';
import { Button } from 'flowbite-react';
import rfdc from 'rfdc';

interface GroupList {
  group_id: number;
  group_name: string;
  password: string;
  live_energy_measurement: JSX.Element;
  hide: JSX.Element;
}

const cloneDeep = rfdc();

const Groups: NextPage = () => {

  return (
    <React.Fragment>
      <ClientOnly>
        <EquipmentTable></EquipmentTable>
      </ClientOnly>
    </React.Fragment>
  )
}

const InputGroup = ({ initialGroup }: any): React.ReactElement => {
  const [group, setGroup] = React.useState<group>(initialGroup);
  const [isMyInputFocused, setIsMyInputFocused] = React.useState(false);
  const buttonRef = React.useRef(null);
  const updateOneGroupQuery = gql`
    mutation UpdateOneGroup($data: GroupUpdateInput!, $where: GroupWhereUniqueInput!) {
    updateOneGroup(data: $data, where: $where) {
      group_id
    }
  }`;

  const updateOneGroup = useMutation(updateOneGroupQuery);
  const updateURL = (live_energy_measurement: string) => {
    console.log(live_energy_measurement);
    const clonedGroup = cloneDeep(group);
    clonedGroup.live_energy_measurement = live_energy_measurement;
    setGroup(clonedGroup);
  }

  const submitURL = (wipe = false) => {
    console.log(wipe);
    if (wipe) {
      const clonedGroup = cloneDeep(group);
      clonedGroup.live_energy_measurement = "";
      setGroup(clonedGroup);
    }
    updateOneGroup[0]({
      variables: {
        "data": {
          "live_energy_measurement": {
            "set": wipe ? '' : group.live_energy_measurement
          }
        },
        "where": {
          "group_id": group.group_id
        }
      }
    });
    setIsMyInputFocused(false);
  }

  return <React.Fragment><Space.Compact style={{ width: '100%' }}>
    <Input addonBefore="http://" onBlur={(event) => { if (buttonRef.current !== event.relatedTarget) setIsMyInputFocused(false) }}
      onFocus={() => setIsMyInputFocused(true)} value={group.live_energy_measurement ? group.live_energy_measurement.replace('http://', '') : group.live_energy_measurement} onChange={val => { updateURL(val.currentTarget.value) }} />
    {(isMyInputFocused && group.live_energy_measurement !== '') ? <Button ref={buttonRef} type='button' onClick={() => submitURL()}>Submit</Button> : (!isMyInputFocused && group.live_energy_measurement && group.live_energy_measurement != ' ') ? <Button type='button' onClick={() => submitURL(true)}>Clear URL</Button> : <></>}
  </Space.Compact></React.Fragment>;
}

const ChkBox = ({ initialGroup }: any): React.ReactElement => {
  const [group, setGroup] = React.useState<group>(initialGroup);
  const updateOneGroupQuery = gql`
    mutation UpdateOneGroup($data: GroupUpdateInput!, $where: GroupWhereUniqueInput!) {
    updateOneGroup(data: $data, where: $where) {
      group_id
    }
  }`;

  const updateOneGroup = useMutation(updateOneGroupQuery);
  const updateHide = (chck: boolean) => {
    const clonedGroup = cloneDeep(group)
    clonedGroup.hide = chck;
    setGroup(clonedGroup);
  }

  return <Row justify={"center"}>
    <Checkbox checked={group.hide} onChange={(val) => {
      updateHide(val.target.checked);
      updateOneGroup[0]({
        variables: {
          "data": {
            "hide": {
              "set": val.target.checked
            }
          },
          "where": {
            "group_id": group.group_id
          }
        }
      });
    }}></Checkbox>
  </Row>
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
      live_energy_measurement
      hide
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
          hide: <ChkBox initialGroup={group} />,
          live_energy_measurement: <InputGroup initialGroup={group} />,
        })
      })
      setGroupList(currentGpList);
    }

  }, [getGroups.data, getGroupPasswords.data])


  return (
    <React.Fragment>
      <Table
        headers={['Group ID', 'Name', 'Password', 'Hide Live Energy URL', 'Customised URL for Live Energy']}
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
