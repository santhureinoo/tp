import type { NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import TableOptionField from '../components/TableOptionField';
import { v4 as uuidv4 } from 'uuid';
import { customer, group, invoice, outlet, reports, results } from '../types/datatype';
import ClientOnly from '../components/ClientOnly';
import { gql, useLazyQuery, useQuery, WatchQueryFetchPolicy } from '@apollo/client';
import { DropdownProps } from '../common/types';
import ReportEdit from '../components/ReportEdit';
import PillButton from '../components/PillButton';
import CustomizedDropDown from '../components/CustomizedDropDown';
import ReportSteps from '../components/report/ReportSteps';
import InvoiceEdit from '../components/InvoiceEdit';
import { dateValueForQuery, formatCurrency, numberWithCommas } from '../common/helper';
import axios from 'axios';

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
  const title = "Reports";
  return { title };
};

const ReportTable: any = () => {
  const [openReportEdit, setOpenReportEdit] = React.useState(false);
  const [selectedSubTitle, setSelectedSubTitle] = React.useState("Generate");
  const [selectedOutletID, setSelectedOutletID] = React.useState("");
  const [results, setResults] = React.useState<results[]>([]);
  const [selectedResult, setSelectedResult] = React.useState<results>();

  //Invoice
  const [selectedInvoicePte, setSelectedInvoicePte] = React.useState(0);
  const [selectedInvoiceMonth, setSelectedInvoiceMonth] = React.useState("All");
  const [selectedInvoiceYear, setSelectedInvoiceYear] = React.useState("All");
  const [totalInvoicePage, setTotalInvoicePage] = React.useState(1);
  const [selectedInvoicePageIndex, setSelectedInvoicePageIndex] = React.useState(1);
  const [allPte, setAllPte] = React.useState<DropdownProps[]>([]);
  const [invoices, setInvoices] = React.useState<invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = React.useState<invoice>();

  //Savings
  const [selectedCustomerType, setSelectedCustomerType] = React.useState<'Group' | 'Outlet'>('Group');
  const [selectedCustomerId, setSelectedCustomerId] = React.useState("");
  const [selectedSavingsOutletID, setSelectedSavingsOutletID] = React.useState("");
  const [selectedSavingsMonth, setSelectedSavingsMonth] = React.useState("All");
  const [selectedSavingsYear, setSelectedSavingsYear] = React.useState("All");
  const [savingReportData, setSavingReportData] = React.useState<any[]>([]);
  const [selectedReportID, setSelectedReportID] = React.useState({
    reportId: 0,
    selectedMonth: "",
    selectedYear: "",
  });
  const [totalSavingPage, setTotalSavingPage] = React.useState(1);
  const [selectedSavingPageIndex, setSelectedSavingPageIndex] = React.useState(1);
  const [isGlobalRecalculating, setIsGlobalRecalculating] = React.useState(0);

  //Generate 
  const [selectedGenerateMonth, setSelectedGenerateMonth] = React.useState("01");
  const [selectedGenerateYear, setSelectedGenerateYear] = React.useState("2023");
  const [reports, setReports] = React.useState<reports[]>([]);
  const [totalGeneratePage, setTotalGeneratePage] = React.useState(1);
  const [selectedGeneratePageIndex, setSelectedGeneratePageIndex] = React.useState(1);

  //Loading
  const [tableLoading, setTableLoading] = React.useState(false);


  const getReportsQuery = gql`
  query FindManyReports($where: ReportsWhereInput) {
    findManyReports(where: $where) {
      updated_at
      year
      input_type
      month
      report_id
      status
      total_updated_outlets
      total_error_found
      invoice_status
      report_status
    }
  }`;

  const getReportsVariable = {
    "variables": {
      "where": {
        ...(selectedGenerateMonth !== 'All') && {
          "month": {
            "equals": selectedGenerateMonth
          }
        },
        ...(selectedGenerateYear !== 'All') && {
          "year": {
            "equals": selectedGenerateYear
          }
        },
      }
    }
  };


  const getInvoicesQuery = gql`
  query Invoices($where: InvoiceWhereInput) {
    invoices(where: $where) {
      invoice_id
      customer_id
      month
      year
      outlet_ids
      outlet_count
      last_available_tariff
      outlet_measured_savings_kWh
      outlet_measured_savings_expenses
      outlet_measured_savings_percent
      eqpt_energy_usage_without_TP_month_kW
      eqpt_energy_usage_without_TP_month_expenses
      eqpt_energy_usage_with_TP_month_kW
      eqpt_energy_usage_with_TP_month_expenses
      customer {
        name
        pte_ltd_name
        current_address
      }
    }
  }`;

  const getInvoicesVariable = {
    "variables": {
      "where": {
        "customer_id": {
          "equals": selectedInvoicePte
        },
        ...(selectedInvoiceMonth !== 'All') && {
          "month": {
            "equals": selectedInvoiceMonth
          }
        },
        ...(selectedInvoiceYear !== 'All') && {
          "year": {
            "equals": selectedInvoiceYear
          }
        },
      },
      "take": 10,
      "skip": (selectedInvoicePageIndex * 5) - 5,
    }
  }

  const getInvoiceTotalQuery = gql`
  query _count($where: InvoiceWhereInput) {
    aggregateInvoice(where: $where) {
      _count {
        _all
      }
    }
  }`

  const getInvoiceTotalVariable =
  {
    "variables": {
      "where": {
        "customer_id": {
          "equals": selectedInvoicePte
        },
        ...(selectedInvoiceMonth !== 'All') && {
          "month": {
            "equals": selectedSavingsMonth
          }
        },
        ...(selectedInvoiceYear !== 'All') && {
          "year": {
            "equals": selectedSavingsYear
          }
        },
      }
    }
  }

  const getOutletsQuery = gql`
  query Outlets{
    outlets {
      outlet_id
      name
    }
  }
  `;

  const getCustomerQuery = gql`query Customers {
    customers {
      customer_id
      pte_ltd_name
      name
      outlet {
        outlet_id
        name
      }
    }
  }`;

  const getReportsByOutletIDVariable = {
    "variables": {
      "where": {
        "outlet_ids": {
          "contains": selectedSavingsOutletID.toString()
        },
        ...(selectedSavingsMonth !== 'All') && {
          "month": {
            "equals": selectedSavingsMonth
          }
        },
        ...(selectedSavingsYear !== 'All') && {
          "year": {
            "equals": selectedSavingsYear
          }
        },

      },
      // "take": 10,
      // "skip": (selectedSavingPageIndex * 5) - 5,
      "customersWhere2": {
        "customer_id": {
          "equals": parseInt(selectedCustomerId),
        }
      },
      "outletWhere2": {
        "outlet_id": {
          "equals": parseInt(selectedSavingsOutletID)
        }
      },
      // "outletMonthWhere2": {
      //   "outlet_date": {
      //     "equals": `01/${selectedSavingsMonth}/${selectedSavingsYear}`
      //   }
      // }
    },
  };

  const getReportsByOutletIdQuery = gql`
  query FindManyReports($where: ReportsWhereInput, $take: Int, $skip: Int, $customersWhere2: CustomerWhereInput, $outletWhere2: OutletWhereInput, $outletMonthWhere2: Outlet_monthWhereInput) {
    findManyReports(where: $where, take: $take, skip: $skip) {
      id
      report_id
      year
      month
      outlet_ids
      outlet_measured_savings_expenses
      outlet_measured_savings_kWh
      outlet_measured_savings_percent
      total_updated_outlets
      last_avail_tariff
      invoice_status
      input_type
      group {
        customers(where: $customersWhere2) {
          outlet(where: $outletWhere2) {
            outlet_id
            name
            outlet_month(where: $outletMonthWhere2) {
              outlet_date
              no_of_ex_installed
              no_of_fa_installed
              no_of_ac_installed
            }
          }
          name
        }
      }
      group_id
    }
  }`;

  const groupBy = (arr: any[], groupByKey: string) => {
    arr.reduce(function (r, a) {
      r[a[groupByKey]] = r[a[groupByKey]] || [];
      r[a[groupByKey]].push(a);
      return r;
    }, Object.create(null));
  }
  const getGroupsVariable = {
    "variables": {
      "where": {
        ...(selectedSavingsMonth !== 'All') && {
          "month": {
            "equals": selectedSavingsMonth
          }
        },
        ...(selectedSavingsYear !== 'All') && {
          "year": {
            "equals": selectedSavingsYear
          }
        },
      },
      ...(dateValueForQuery(selectedSavingsMonth, selectedSavingsYear) !== '') && {
        "resultsWhere2": {
          "outlet_date": {
            "equals": dateValueForQuery(selectedSavingsMonth, selectedSavingsYear)
          }
        }
      }
    },
  };

  const reportTotalVariable = {
    "variables": {
      "where": {
        "outlet_ids": {
          "contains": selectedSavingsOutletID.toString()
        },
        ...(selectedSavingsMonth !== 'All') && {
          "month": {
            "equals": selectedSavingsMonth
          }
        },
        ...(selectedSavingsYear !== 'All') && {
          "year": {
            "equals": selectedSavingsYear
          }
        },

      },
    },
  };

  const reportTotalQuery = gql`
  query _count($where: ReportsWhereInput) {
    aggregateReports(where: $where) {
      _count {
        _all
      }
    }
  }`;


  const groupReportTotalVariable = {
    "variables": {
      "where": {
        ...(selectedSavingsMonth !== 'All') && {
          "month": {
            "equals": selectedSavingsMonth
          }
        },
        ...(selectedSavingsYear !== 'All') && {
          "year": {
            "equals": selectedSavingsYear
          }
        },

      },
    },
  };

  const groupReportTotalQuery = gql`
  query _count($where: GroupWhereInput) {
    aggregateGroup(where: $where) {
      _count {
        _all
      }
    }
  }`;


  const getGroupsQuery = gql`
  query getGroups($where: ReportsWhereInput, $resultsWhere2: ResultsWhereInput) {
    groups {
      group_id
      group_name
      customers {
        outlet {
          outlet_id
          results(where: $resultsWhere2) {
            savings_tariff_expenses
            outlet_date
          }
        }
      }
      reports(where: $where) {
        month
        year
        outlet_measured_savings_expenses
        outlet_measured_savings_kWh
        outlet_measured_savings_percent
        last_avail_tariff
        total_updated_outlets
      }
    }
  }`;

  const getGenerateTotalVariable = {
    "variables": {
      "where": {
        ...(selectedGenerateMonth !== 'All') && {
          "month": {
            "equals": selectedGenerateMonth
          }
        },
        ...(selectedGenerateYear !== 'All') && {
          "year": {
            "equals": selectedGenerateYear
          }
        },

      },
    },
  };

  const getGenerateTotalQuery = gql`
  query _count($where: ReportsWhereInput) {
    aggregateReports(where: $where) {
      _count {
        _all
      }
    }
  }`;

  const getResultsVariable = React.useMemo(() => {
    return {
      "variables": {
        "where": {
          "outlet_id": {
            "equals": parseInt(selectedOutletID)
          }
        },
        "omWhere": {
          "outlet_outlet_id": {
            "equals": parseInt(selectedOutletID)
          }
        }
      }
    }
  }, [selectedOutletID]);

  const getResultsQuery = gql`
  query FindManyResults($where: ResultsWhereInput,$omWhere: Outlet_monthWhereInput) {
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
      ke_and_ac_25percent_benchmark_comparison_kWh
      ke_and_ac_25percent_benchmark_comparison_expenses
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
        outlet_device_ac_input {
          od_device_input_id
        }
        outlet_month(where: $omWhere) {
          last_avail_tariff
        }
      }
    }
  }
  `;

  const getPteQuery = gql`
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
      group_id
    }
  }`;

  const outletsResult = useQuery(getOutletsQuery);
  const resultsResult = useQuery(getResultsQuery, getResultsVariable);
  const getReportsByOutletIdResult = useLazyQuery(getReportsByOutletIdQuery, getReportsByOutletIDVariable);
  const getGroupsResult = useLazyQuery(getGroupsQuery, getGroupsVariable);
  // const getReportsByCustomerIdResult = useLazyQuery(getReportsByCustomerIDQuery, getReportsByCustomerIDVariable);
  const customerResult = useQuery(getCustomerQuery);
  const reportTotalResult = useLazyQuery(reportTotalQuery, reportTotalVariable);
  const groupReportTotalResult = useLazyQuery(groupReportTotalQuery, groupReportTotalVariable);
  const getInvoicesResult = useLazyQuery(getInvoicesQuery, getInvoicesVariable);
  const invoiceTotalResult = useLazyQuery(getInvoiceTotalQuery, getInvoiceTotalVariable);
  const getPteResult = useLazyQuery(getPteQuery);
  const getGenerateResult = useLazyQuery(getReportsQuery, getReportsVariable);
  const getGenerateTotalResult = useLazyQuery(getGenerateTotalQuery, getGenerateTotalVariable);


  const globalRecalculate = () => {
    axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}:4001/recalculate_outlet_group_results`,
      {
        'outlet_date': `01/${selectedSavingsMonth === 'All' ? '' : selectedSavingsMonth}/${selectedSavingsYear === 'All' ? '' : selectedSavingsYear}`
      } // !!!
    ).then((response) => {
      setIsGlobalRecalculating(isGlobalRecalculating + 1);
    }).catch(err => {
      setIsGlobalRecalculating(isGlobalRecalculating + 1);
    })
  }

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

  const pteDropdown: DropdownProps[] = React.useMemo(() => {
    if (customerResult.data && customerResult.data.customers.length > 0) {
      setSelectedCustomerId(customerResult.data.customers[0].customer_id);
      return customerResult.data.customers.map((customer: any) => {
        return { key: customer.customer_id, value: customer.name };
      })
    } else {
      return [];
    }
  }, [customerResult.data]);

  const savingOutletDropdown: DropdownProps[] = React.useMemo(() => {
    if (customerResult.data && customerResult.data.customers.length > 0) {
      const customerData: any[] = customerResult.data.customers;

      const selectedOutlets = customerData.filter((dat: any) => {
        if (dat.customer_id === selectedCustomerId) {
          return true;
        } else {
          return false;
        }
      }).map((dat: any) => {
        return dat.outlet;
      })

      let data = [];

      if (selectedOutlets.length > 0) {
        data = selectedOutlets[0].map((outlet: any) => {
          return { key: outlet.outlet_id, value: outlet.name };
        })
      }
      return data;
    } else {
      return [];
    }
  }, [customerResult.data, selectedCustomerId]);

  // Hooks 
  React.useEffect(() => {
    if (resultsResult.data && resultsResult.data.findManyResults) {
      setResults(resultsResult.data.findManyResults);
    }
  }, [resultsResult]);

  React.useEffect(() => {
    if (savingOutletDropdown.length > 0) {
      setSelectedSavingsOutletID(savingOutletDropdown[0].key);
    }
  }, [savingOutletDropdown]);

  // Need to use Lazy Query on each sub title changes instead of fetching all at once.
  React.useEffect(() => {
    if (selectedSubTitle === 'Invoice') {
      getPteResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
        if (res.data && res.data.customers) {
          const customers: customer[] = res.data.customers;
          setAllPte(customers.map((cus, index) => {
            if (index === 0) {
              setSelectedInvoicePte(cus.customer_id);
            }
            return {
              key: cus.customer_id.toString(),
              value: cus.name || ''
            }
          }))
        }
      })
    } else if (selectedSubTitle === 'Generate') {
      getGenerateTotalResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(totalRes => {
        if (totalRes.data && totalRes.data.aggregateInvoice && totalRes.data.aggregateInvoice._count._all) {
          const total = totalRes.data.aggregateInvoice._count._all;
          const pageCount = total != 0 ? Math.ceil(total / 10) : 1;
          setTotalInvoicePage(pageCount);
        }
        getGenerateResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
          if (res.data && res.data.findManyReports) {
            setReports(res.data.findManyReports);
          }
        })
      })
    }
  }, [selectedSubTitle]);

  //Invoice Hooks
  React.useEffect(() => {
    if (selectedInvoicePte !== 0) {
      invoiceTotalResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(totalRes => {
        if (totalRes.data && totalRes.data.aggregateInvoice && totalRes.data.aggregateInvoice._count._all) {
          const total = totalRes.data.aggregateInvoice._count._all;
          const pageCount = total != 0 ? Math.ceil(total / 10) : 1;
          setTotalInvoicePage(pageCount);
        }
        getInvoicesResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
          if (res && res.data && res.data.invoices) {
            setInvoices(res.data.invoices as invoice[]);
          }
        })
      })
    }

  }, [selectedInvoicePte, selectedInvoiceMonth, selectedInvoiceYear])

  //Generate Hooks
  React.useEffect(() => {
    getGenerateTotalResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(totalRes => {
      if (totalRes.data && totalRes.data.aggregateInvoice && totalRes.data.aggregateInvoice._count._all) {
        const total = totalRes.data.aggregateInvoice._count._all;
        const pageCount = total != 0 ? Math.ceil(total / 10) : 1;
        setTotalInvoicePage(pageCount);
      }
      getGenerateResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
        if (res.data && res.data.findManyReports) {
          setReports(res.data.findManyReports);
        }
      })
    })
  }, [selectedGenerateMonth, selectedGenerateYear])

  const month: DropdownProps[] = [
    { key: 'All', value: 'All' },
    { key: '01', value: 'Jan' },
    { key: '02', value: 'Feb' },
    { key: '03', value: 'Mar' },
    { key: '04', value: 'Apr' },
    { key: '05', value: 'May' },
    { key: '06', value: 'Jun' },
    { key: '07', value: 'Jul' },
    { key: '08', value: 'Aug' },
    { key: '09', value: 'Sep' },
    { key: '10', value: 'Oct' },
    { key: '11', value: 'Nov' },
    { key: '12', value: 'Dec' }
  ];

  const generateTable = React.useMemo(() => {
    const generateRows = (): any[][] => {
      const uniqueArr: any[][] = [];
      reports.forEach((rep, index) => {
        const foundUni = uniqueArr.find((uni: any[]) => uni[4] === rep.report_id);
        if (foundUni) {
          foundUni[6] += rep.total_updated_outlets;
          foundUni[7] += rep.total_error_found;
        } else {
          uniqueArr.push(
            [
              rep.updated_at, rep.year, rep.month, rep.input_type, rep.report_id, <span key={`status-${index}`} className='text-custom-active-link'>{rep.status}</span>, rep.total_updated_outlets, rep.total_error_found, <span key={`rp-status-${index}`} className='text-custom-active-link'>{rep.report_status}</span>, <span key={`invoice-status-${index}`} className='text-custom-active-link'>{rep.invoice_status}</span>
            ]
          )
        }

      });

      return uniqueArr;
    }
    return <React.Fragment>
      <Table
        headers={['Uploaded at', 'Year', 'Month', 'Input Type', 'Report ID', 'Status', 'Total Updated Outlet', 'Total Error Found', 'Report Status', 'Invoice Status']}
        onlyShowButton={true}
        data={generateRows()}
        leftSideElements={[]}
        loading={tableLoading}
        hideDetailMenu={true}
        totalNumberOfPages={totalGeneratePage}
        setCurrentSelectedPage={setSelectedGeneratePageIndex}
        currentSelectedPage={selectedGeneratePageIndex}
        rightSideElements={[
          <TableOptionField key={uuidv4()} label={'Select Month'} onChange={(selectedValue: string) => { setSelectedGenerateMonth(selectedValue) }}
            selectedValue={selectedGenerateMonth} data={month} />,
          <TableOptionField key={uuidv4()} label={'Select Year'} onChange={(selectedValue: string) => { setSelectedGenerateYear(selectedValue) }}
            selectedValue={selectedGenerateYear} data={['All', '2021', '2020', '2022', '2023']} />,
          <span key={uuidv4()} className='w-12'></span>,
          // <TableOptionField key={uuidv4()} label={'Action'} onChange={(selectedValue: string) => { setSelectedOutletID(selectedValue) }}
          //   selectedValue={"Delete"} data={action} />
        ]}
        handleEdit={(selectedData) => { setSelectedResult(results.find(res => res.outlet_date === selectedData[7])); setOpenReportEdit(true) }} handleDelete={() => setOpenReportEdit(true)} />
    </React.Fragment>
  }, [reports, selectedGenerateMonth, tableLoading, selectedGenerateYear]);

  React.useEffect(() => {
    const arr: any[] = [];
    if (selectedSubTitle === 'Savings') {
      if (selectedCustomerType === 'Group') {
        setTableLoading(true);
        getGroupsResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then((res: any) => {
          const arr: any[] = [];
          if (res && res.data && res.data.groups) {
            const groups = res.data.groups as group[];
            groups.forEach(group => {

              if (group.reports) {
                let innerArr: any[] = [];
                group.reports.reduce((previousValue, currentValue) => {
                  const index = previousValue.findIndex(prev => prev.month === currentValue.month);
                  if (index >= 0) {
                    previousValue.splice(index, 1, currentValue);
                  } else {
                    previousValue.push(currentValue);
                  }
                  return previousValue;
                }, [] as reports[]).forEach(report => {
                  let isFound = -1;
                  if (isFound < 0) {
                    innerArr.push(group.group_id);
                    innerArr.push(group.group_name);
                    innerArr.push(report.month, report.year);
                    let totalSavingTariff = 0;
                    innerArr.push(report.total_updated_outlets);

                    if (group.customers) {
                      group.customers.forEach(customer => {
                        if (customer.outlet) {
                          customer.outlet.forEach(out => {
                            if (out.results) {
                              out.results.forEach(res => {
                                if (res.outlet_date.split('/')[1] === report.month) {
                                  totalSavingTariff += Number(res.savings_tariff_expenses || '0');
                                }

                              });
                            }
                          })
                        }
                      })
                    }
                    innerArr.push('$' + formatCurrency(totalSavingTariff));
                    innerArr.push(<div className='flex flex-row gap-x-4'>
                      <div className='flex flex-col'>
                        <span className='text-custom-xs'>
                          (kWH)
                        </span>
                        <span>
                          {numberWithCommas(parseInt(report.outlet_measured_savings_kWh || "0"))}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-custom-xs'>
                          ($)
                        </span>
                        <span>
                          $ {numberWithCommas(parseInt(report.outlet_measured_savings_expenses || "0"))}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-custom-xs'>
                          (%)
                        </span>
                        <span>
                          {numberWithCommas(Number(report.outlet_measured_savings_percent || "0"), 2)}%
                        </span>
                      </div>
                    </div>);
                    arr.push(innerArr);
                    innerArr = [];
                  } else {
                    innerArr = []
                  }
                });
              }
            })
            setSavingReportData(arr);
            setTableLoading(false);
          } else {
            setSavingReportData([]);
            setTableLoading(false);
          }
        });
        setTotalSavingPage(0);
      } else {
        setTableLoading(true);
        customerResult.refetch().then(res => {
          getReportsByOutletIdResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then((res: any) => {
            const arr = [];
            if (res && res.data && res.data.findManyReports) {
              const reports = res.data.findManyReports as reports[];
              for (let i = 0; i < reports.length; i++) {
                const cur = reports[i];
                if (cur.group && cur.group.customers && cur.group.customers.length > 0 && cur.group.customers[0].outlet
                  && cur.group.customers[0].outlet.length && cur.group.customers[0].outlet[0].outlet_month) {
                  const outlet_month = cur.group.customers[0].outlet[0].outlet_month.find(om => om.outlet_date === `01/${cur.month}/${cur.year}`);
                  let outlet_total_eqpt = 0;
                  if (outlet_month) {
                    outlet_total_eqpt = (outlet_month.no_of_ac_installed || 0) + (outlet_month.no_of_ex_installed || 0) + (outlet_month.no_of_fa_installed || 0);
                  }
                  arr.push([
                    cur.id, cur.report_id, cur.group.customers[0]?.outlet[0]?.outlet_id, cur.group.customers[0]?.outlet[0]?.name, cur.month, cur.year, outlet_total_eqpt, `$ ${cur.last_avail_tariff}`,
                    <div key={'frag ' + i} className='flex flex-row gap-x-4'>
                      <div className='flex flex-col'>
                        <span className='text-custom-xs'>
                          (kWH)
                        </span>
                        <span>
                          {cur.outlet_measured_savings_kWh}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-custom-xs'>
                          ($)
                        </span>
                        <span>
                          ${cur.outlet_measured_savings_expenses}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-custom-xs'>
                          (%)
                        </span>
                        <span>
                          {numberWithCommas(Number(cur.outlet_measured_savings_percent), 2)}%
                        </span>
                      </div>
                    </div>
                  ]);
                }

              }
              setSavingReportData(arr);
              setTableLoading(false);

            } else {
              setSavingReportData([]);
              setTableLoading(false);
            }
          });
        })

      }
    }
  }, [isGlobalRecalculating, selectedCustomerType, selectedSavingsMonth, selectedSavingsYear, selectedSavingsOutletID, selectedSavingPageIndex, selectedSubTitle])

  React.useEffect(() => {
    if (selectedCustomerType === "Outlet" && selectedSavingsOutletID !== '') {
      reportTotalResult[0]({ 'fetchPolicy': 'no-cache' as WatchQueryFetchPolicy }).then(res => {
        if (res.data && res.data.aggregateReports._count._all) {
          const total = res.data.aggregateReports._count._all;
          const pageCount = total != 0 ? Math.ceil(total / 10) : 1;
          setTotalSavingPage(pageCount > 1 ? pageCount : 0);
          setSelectedSavingPageIndex(1);
        } else {
          setTotalSavingPage(0);
        }
      })
    }

  }, [isGlobalRecalculating, selectedSavingsOutletID, selectedCustomerType, selectedSavingsMonth, selectedSavingsYear]);

  const savingTable = React.useCallback((detailElem: any) => {

    const headers = () => {
      if (selectedCustomerType === 'Outlet') {
        return ['Report ID', 'Outlet Name', 'Month', 'Year', 'Equipment', 'Last Avaiable Tariff ($/kWh)', 'Measured Energy Savings'];
      } else {
        return ['Group ID', 'Group Name', 'Month', 'Year', 'Live Outlets', 'Savings @ Tariff', 'Measured Energy Savings'];
      }
    }

    const savingsSubMenu = (): React.ReactElement => {
      return (<div className={`flex flex-row ${selectedCustomerType === 'Outlet' ? 'justify-between' : 'justify-end'}`}>
        {selectedCustomerType === 'Outlet' && <div className='flex flex-row gap-x-2'>
          <TableOptionField key={uuidv4()} label={'Pte Ltd'} onChange={(selectedValue: string) => { setSelectedCustomerId(selectedValue) }}
            selectedValue={selectedCustomerId} data={pteDropdown} />
          <TableOptionField key={uuidv4()} label={'Outlet'} onChange={(selectedValue: string) => { setSelectedSavingsOutletID(selectedValue) }}
            selectedValue={selectedSavingsOutletID} data={savingOutletDropdown} />
        </div>}
        <div className='flex flex-row gap-x-2'>
          <TableOptionField key={uuidv4()} label={'Month'} onChange={(selectedValue: string) => { setSelectedSavingsMonth(selectedValue) }}
            selectedValue={selectedSavingsMonth} data={month} />
          <TableOptionField key={uuidv4()} label={'Year'} onChange={(selectedValue: string) => { setSelectedSavingsYear(selectedValue) }}
            selectedValue={selectedSavingsYear} data={['All', '2021', '2020', '2022', '2023']} />
        </div>
      </div>)
    }

    return <React.Fragment>
      <Table
        headers={headers()}
        loading={tableLoading}
        onlyShowButton={true}
        data={savingReportData}
        hiddenDataColIndex={selectedCustomerType === 'Outlet' ? [0, 2] : []}
        totalNumberOfPages={0}
        openDetailContent={openReportEdit}
        setOpenDetailContent={setOpenReportEdit}
        detailContent={detailElem}
        setCurrentSelectedPage={setSelectedSavingPageIndex}
        currentSelectedPage={selectedSavingPageIndex}
        leftSideElements={[<div className='flex flex-row justify-between'>
          <TableOptionField key={uuidv4()} label={'Customer Type'} onChange={(selectedValue: any) => { setSelectedCustomerType(selectedValue); setSelectedSavingsMonth("All"); setSelectedSavingsYear("All") }}
            selectedValue={selectedCustomerType} data={['Group', 'Outlet']} />
          <PillButton key={'recal'} onClick={globalRecalculate} className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-40 h-10`} text={"Global Recalculate"}></PillButton>
        </div>, savingsSubMenu()]}
        leftSideFlexDirection={"Vertical"}
        rightSideElements={[]}
        handleEdit={(selectedData) => {
          setSelectedOutletID(selectedCustomerType === 'Outlet' ? selectedData[2] : selectedData[0])
          setSelectedReportID({
            reportId: parseInt(selectedData[0]),
            selectedMonth: selectedCustomerType === 'Outlet' ? selectedData[4] : selectedData[2],
            selectedYear: selectedCustomerType === 'Outlet' ? selectedData[5] : selectedData[3]
          }); setOpenReportEdit(true)
        }} handleDelete={() => setOpenReportEdit(true)} />
    </React.Fragment>
  }, [isGlobalRecalculating, selectedCustomerType, tableLoading, selectedCustomerId, openReportEdit, setOpenReportEdit, selectedSavingPageIndex, totalSavingPage, savingReportData, selectedSavingsOutletID, selectedSavingsMonth, selectedSavingsYear, savingOutletDropdown]);

  const invoiceTable = React.useCallback((detailElem: any) => {
    const invoiceRows = (): any[][] => {
      return invoices.map(inv => {
        return [
          inv.invoice_id, inv.customer?.name, inv.month, inv.year, inv.outlet_count, inv.last_available_tariff,
          <div key={'frag ' + inv.invoice_id} className='flex flex-row gap-x-4'>
            <div className='flex flex-col'>
              <span className='text-custom-xs'>
                (kWH)
              </span>
              <span>
                {numberWithCommas(parseInt(inv.outlet_measured_savings_kWh))}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-custom-xs'>
                ($)
              </span>
              <span>
                ${numberWithCommas(parseInt(inv.outlet_measured_savings_expenses))}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-custom-xs'>
                (%)
              </span>
              <span>
                {numberWithCommas(Number(inv.outlet_measured_savings_percent), 2)}%
              </span>
            </div>
          </div>
        ];
      });
    }
    return <React.Fragment>
      <Table
        headers={['Invoice ID', 'Pte Ltd Name', 'Month', 'Year', 'Outlets', 'Last Avaiable Tariff', 'Measured Energy Savings']}
        hiddenDataColIndex={[7]}
        onlyShowButton={true}
        data={invoiceRows()}
        loading={tableLoading}
        openDetailContent={openReportEdit}
        setOpenDetailContent={setOpenReportEdit}
        detailContent={detailElem}
        totalNumberOfPages={totalInvoicePage}
        leftSideElements={[<TableOptionField key={uuidv4()} label={'Pte Ltd'} onChange={(selectedValue: string) => { setSelectedInvoicePte(parseInt(selectedValue)) }}
          selectedValue={selectedInvoicePte.toString() || ''} data={allPte} />,]}
        rightSideElements={[
          <TableOptionField key={uuidv4()} label={'Month'} onChange={(selectedValue: string) => { setSelectedInvoiceMonth(selectedValue) }}
            selectedValue={selectedInvoiceMonth} data={month} />,
          <TableOptionField key={uuidv4()} label={'Year'} onChange={(selectedValue: string) => { setSelectedInvoiceYear(selectedValue) }}
            selectedValue={selectedInvoiceYear} data={["All", "2023", "2022", "2020"]} />,
        ]}
        handleEdit={(selectedData) => { setSelectedInvoice(invoices.find(inv => inv.invoice_id === selectedData[0])); setOpenReportEdit(true) }} handleDelete={() => setOpenReportEdit(true)} />
    </React.Fragment>
  }, [selectedInvoiceMonth, selectedInvoiceYear, tableLoading, openReportEdit, setOpenReportEdit, selectedInvoicePte, selectedInvoice, setSelectedInvoicePte, allPte, invoices]);

  return (
    <React.Fragment >
      <div className='flex flex-row'>
        <h3 className="text-gray-700 text-3xl font-bold">Reports: </h3>
        <CustomizedDropDown hideBorder={true} customCSS='text-3xl' inputType={'dropdown'} hidePrefixIcons={true} data={["Generate", "Savings", "Invoice", "ReportStep"]} selected={selectedSubTitle} setSelected={(selected: string) => { setSelectedSubTitle(selected) }} />
      </div>

      <div className="flex flex-col mt-8">
        <div className="-my-2 py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div
            className="align-middle inline-block min-w-full sm:rounded-lg">
            {selectedSubTitle === "Generate" ?
              generateTable
              : selectedSubTitle === "Savings" ?
                savingTable(<ReportEdit selectedID={selectedReportID.reportId} selectedCustomerID={selectedCustomerId ? parseInt(selectedCustomerId) : 0} selectedOutletID={selectedOutletID ? parseInt(selectedOutletID) : 0} result={selectedResult} openReportEdit={openReportEdit} customerType={selectedCustomerType} setOpenReportEdit={setOpenReportEdit} month={selectedReportID.selectedMonth} year={selectedReportID.selectedYear} />) :
                selectedSubTitle === "Invoice" ? invoiceTable(<InvoiceEdit openReportEdit={openReportEdit} setOpenReportEdit={setOpenReportEdit} invoice={selectedInvoice} month={selectedInvoice?.month || 'All'} year={selectedInvoice?.year || 'All'} />) : <React.Fragment><ReportSteps></ReportSteps></React.Fragment>
            }
          </div>
        </div>
      </div>
    </React.Fragment >
  )
}

export default Reports
