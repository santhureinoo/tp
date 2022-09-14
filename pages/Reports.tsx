import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import TableOptionField from '../components/TableOptionField';
import Searchfield from '../components/Searchfield';
import EquipmentEdit from '../components/EquipmentEdit';
import { v4 as uuidv4 } from 'uuid';
import { outlet, outlet_device_ex_fa_input, results } from '../types/datatype';
import ClientOnly from '../components/ClientOnly';
import { gql, useQuery } from '@apollo/client';
import { DropdownProps } from '../common/types';
import ReportEdit from '../components/ReportEdit';
import PillButton from '../components/PillButton';

const Reports: NextPage = () => {


  return (
    <React.Fragment>
      <ClientOnly>
        <ReportTable></ReportTable>
      </ClientOnly>
    </React.Fragment>
  )
}

Reports.getInitialProps = async () => {
  const title = 'Reports';
  return { title };
};

const ReportTable: any = () => {
  const [openReportEdit, setOpenReportEdit] = React.useState(false);
  const [selectedOutletID, setSelectedOutletID] = React.useState("");
  const [results, setResults] = React.useState<results[]>([]);
  const [equipments, setEquipments] = React.useState<outlet_device_ex_fa_input[]>([]);
  const [selectedResult, setSelectedResult] = React.useState<results>();

  const getOutletsQuery = gql`
  query Outlets{
    outlets {
      outlet_id
      name
    }
  }
  `;

  const getResultsVariable = React.useMemo(() => {
    return {
      "variables": {
        "where": {
          "outlet_id": {
            "equals": parseInt(selectedOutletID)
          }
        }
      }
    }
  }, [selectedOutletID]);

  const getResultsQuery = gql`
  query FindManyResults($where: ResultsWhereInput) {
    findManyResults(where: $where) {
      outlet_id
      outlet_date
      ke_measured_savings_kWh
      ac_measured_savings_kWh
      acmv_measured_savings_kWh
      outlet_measured_savings_kWh
      outlet_measured_savings_expenses
      outlet_measured_savings_percent
      co2_savings_kg
      savings_tariff_expenses
      tp_sales_expenses
      ke_eqpt_energy_baseline_avg_hourly_kW
      ac_eqpt_energy_baseline_avg_hourly_kW
      acmv_eqpt_energy_baseline_avg_hourly_kW
      ke_eqpt_energy_baseline_avg_hourly_as_date
      ac_eqpt_energy_baseline_avg_hourly_as_date
      acmv_eqpt_energy_baseline_avg_hourly_as_date
      ke_eqpt_energy_usage_without_TP_month_kW
      ac_eqpt_energy_usage_without_TP_month_kW
      outlet_eqpt_energy_usage_without_TP_month_kW
      outlet_eqpt_energy_usage_without_TP_month_expenses
      ke_eqpt_energy_usage_with_TP_month_kW
      ac_eqpt_energy_usage_with_TP_month_kW
      outlet_eqpt_energy_usage_with_TP_month_kW
      outlet_eqpt_energy_usage_with_TP_month_expenses
      acmv_25percent_benchmark_comparison_kWh
      acmv_25percent_benchmark_comparison_expenses
      acmv_10percent_benchmark_comparison_kWh
      acmv_10percent_benchmark_comparison_expenses
      ke_and_ac__25percent_benchmark_comparison_kWh
      ke_and_ac__25percent_benchmark_comparison_expenses
      monday
      tuesday
      wednesday
      thursday
      friday
      saturday
      sunday
      holiday
      outlet {
        name
        outlet_device_ex_fa_input {
          od_device_input_id
        }
        outlet_month {
          last_avail_tariff
        }
      }
    }
  }
  `;



  const outletsResult = useQuery(getOutletsQuery);
  const resultsResult = useQuery(getResultsQuery, getResultsVariable);
  // const customersResult = useQuery(getCustomersQuery);

  // const customerDropdown: DropdownProps[] = React.useMemo(() => {

  //   if (customersResult.data && customersResult.data.customers && customersResult.data.customers.length > 0) {
  //     setSelectedCustomerID(customersResult.data.customers[0].customer_id);
  //     return customersResult.data.customers.map((cust: any) => {
  //       return { key: cust.customer_id, value: cust.name }
  //     })
  //   } else {
  //     return [];
  //   }
  // }, [customersResult.data]);

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
    if (resultsResult.data && resultsResult.data.findManyResults) {
      setResults(resultsResult.data.findManyResults);
    }
  }, [resultsResult]);

  const resultInArray = React.useMemo(() => {
    return results.map(res => {
      return ["--", res.outlet.name, "--", "--", res.outlet.outlet_device_ex_fa_inputs?.length, res.outlet.outlet_month?.length ? res.outlet.outlet_month[0].last_avail_tariff : "--", "---", res.outlet_date]
    })
  }, [results])

  return (
    <React.Fragment>
      <Table
        headers={['Report ID', 'Outlet Name', 'Month', 'Year', 'Equipment', 'Last Avaiable Tariff ($/kWh)', 'Measured Energy']}
        hiddenDataCol={['outlet_date']}
        data={resultInArray}
        leftSideElements={[]}
        rightSideElements={[
          <TableOptionField key={uuidv4()} label={'Outlet'} onChange={(selectedValue: string) => { setSelectedOutletID(selectedValue) }}
            selectedValue={selectedOutletID} data={outletDropdown} />,
        ]}
        handleEdit={(selectedData) => { setSelectedResult(results.find(res => res.outlet_date === selectedData[7])); setOpenReportEdit(true) }} handleDelete={() => setOpenReportEdit(true)} />
      <ReportEdit result={selectedResult} openReportEdit={openReportEdit} setOpenReportEdit={setOpenReportEdit} billingData={{
        IID: 'Set-2095860',
        CUS: 'KFC Holding Indonesia',
        PER: 'Sep, 2022',
        OUT: '5',
        TSF: '$485.09',
        TSS: '$250',
        TSK: (<div className="flex flex-row gap-x-6 items-center justify-between"><span>470</span><PillButton className={"text-yellow-600 bg-yellow-500 w-40 h-8"} text={"Invoice Generated"} /></div>),
        STA: 'Generated',
      }} />
    </React.Fragment>
  )
}

export default Reports
