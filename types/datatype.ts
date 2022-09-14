/* tslint:disable */


/**
 * AUTO-GENERATED FILE @ 2022-08-30 11:21:11 - DO NOT EDIT!
 *
 * This file was automatically generated by schemats v.3_0.3
 * $ schemats generate -c mysql://username:password@localhost/tp_cal_v2 -t ac_results -t customer -t ex_fa_results -t first_intermediary_table -t global_input -t outlet -t outlet_device_ac_input -t outlet_device_ex_fa_input -t outlet_device_live_date -t outlet_month -t outlet_month_shifts -t outlet_person_in_charge -t results -t rg_factors -t secondary_intermediary_table -t _prisma_migrations -s tp_cal_v2
 *
 */


export namespace ac_resultsFields {
    export type outlet_outlet_id = number;
    export type ac_num = string | null;
    export type factor = string | null;

}

export interface ac_results {
    outlet_outlet_id: ac_resultsFields.outlet_outlet_id;
    ac_num: ac_resultsFields.ac_num;
    factor: ac_resultsFields.factor;

}

export namespace customerFields {
    export type customer_id = number;
    export type name = string;
    export type pte_ltd_name = string | null;
    export type pic_name = string | null;
    export type pic_phone = string | null;
    export type country = string | null;
    export type city = string | null;
    export type current_address = string | null;
    export type postal_code = string | null;

}

export interface customer {
    [key: string]: any;
    customer_id: customerFields.customer_id;
    name: customerFields.name;
    pte_ltd_name: customerFields.pte_ltd_name;
    pic_name: customerFields.pic_name;
    pic_phone: customerFields.pic_phone;
    country: customerFields.country;
    city: customerFields.city;
    current_address: customerFields.current_address;
    postal_code: customerFields.postal_code;
}

export namespace customer_person_in_chargeFields {
    export type customer_id = number;
    export type contact_person_index = number;
    export type contact_person_name = string | null;
    export type contact_person_position = string | null;
    export type contact_person_address = string | null;
    export type contact_person_phone = string | null;
    export type primary_contact = boolean;
}

export interface customer_person_in_charge {
    [key: string]: any;
    customer_id?: customer_person_in_chargeFields.customer_id;
    contact_person_index: customer_person_in_chargeFields.contact_person_index;
    contact_person_name: customer_person_in_chargeFields.contact_person_name;
    contact_person_position: customer_person_in_chargeFields.contact_person_position;
    contact_person_address: customer_person_in_chargeFields.contact_person_address;
    contact_person_phone: customer_person_in_chargeFields.contact_person_phone;
    primary_contact: customer_person_in_chargeFields.primary_contact;
}

export namespace ex_fa_resultsFields {
    export type outlet_id = number;
    export type device_type = string;
    export type device_number = string;
    export type vfd_baseline_kW = string | null;
    export type vfd_low_kW = string | null;
    export type vfd_golden_kW = string | null;
    export type display_golden_kW = string | null;
    export type dmm_golden_kW = string | null;
    export type golden_kW = string | null;
    export type baseline_kW = string | null;

}

export interface ex_fa_results {
    outlet_id: ex_fa_resultsFields.outlet_id;
    device_type: ex_fa_resultsFields.device_type;
    device_number: ex_fa_resultsFields.device_number;
    vfd_baseline_kW: ex_fa_resultsFields.vfd_baseline_kW;
    vfd_low_kW: ex_fa_resultsFields.vfd_low_kW;
    vfd_golden_kW: ex_fa_resultsFields.vfd_golden_kW;
    display_golden_kW: ex_fa_resultsFields.display_golden_kW;
    dmm_golden_kW: ex_fa_resultsFields.dmm_golden_kW;
    golden_kW: ex_fa_resultsFields.golden_kW;
    baseline_kW: ex_fa_resultsFields.baseline_kW;

}

export namespace first_intermediary_tableFields {
    export type outlet_id = number;
    export type outlet_month_year = string;
    export type day_of_month = string;
    export type ke_baseline_kW = string | null;
    export type ke_without_TP_kWh = string | null;
    export type ke_with_TP_kWh = string | null;
    export type ke_savings_kWh = string | null;
    export type ke_savings_expenses = string | null;
    export type ac_baseline_kWh = string | null;
    export type ac_without_TP_kWh = string | null;
    export type ac_with_TP_kWh = string | null;
    export type ac_savings_kWh = string | null;
    export type ac_savings_expenses = string | null;
    export type all_eqpt_without_TP_kWh = string | null;
    export type all_eqpt_with_TP_kWh = string | null;
    export type total_savings_kWh = string | null;
    export type total_savings_expenses = string | null;
    export type ke_ops_hours = string | null;
    export type ac_op_hours = string | null;

}

export interface first_intermediary_table {
    outlet_id: first_intermediary_tableFields.outlet_id;
    outlet_month_year: first_intermediary_tableFields.outlet_month_year;
    day_of_month: first_intermediary_tableFields.day_of_month;
    ke_baseline_kW: first_intermediary_tableFields.ke_baseline_kW;
    ke_without_TP_kWh: first_intermediary_tableFields.ke_without_TP_kWh;
    ke_with_TP_kWh: first_intermediary_tableFields.ke_with_TP_kWh;
    ke_savings_kWh: first_intermediary_tableFields.ke_savings_kWh;
    ke_savings_expenses: first_intermediary_tableFields.ke_savings_expenses;
    ac_baseline_kWh: first_intermediary_tableFields.ac_baseline_kWh;
    ac_without_TP_kWh: first_intermediary_tableFields.ac_without_TP_kWh;
    ac_with_TP_kWh: first_intermediary_tableFields.ac_with_TP_kWh;
    ac_savings_kWh: first_intermediary_tableFields.ac_savings_kWh;
    ac_savings_expenses: first_intermediary_tableFields.ac_savings_expenses;
    all_eqpt_without_TP_kWh: first_intermediary_tableFields.all_eqpt_without_TP_kWh;
    all_eqpt_with_TP_kWh: first_intermediary_tableFields.all_eqpt_with_TP_kWh;
    total_savings_kWh: first_intermediary_tableFields.total_savings_kWh;
    total_savings_expenses: first_intermediary_tableFields.total_savings_expenses;
    ke_ops_hours: first_intermediary_tableFields.ke_ops_hours;
    ac_op_hours: first_intermediary_tableFields.ac_op_hours;

}

export namespace global_inputFields {
    export type global_input_id = number;
    export type poss_tariff_increase = string;
    export type ke_factor_1_1 = string | null;
    export type ke_factor_1_2 = string | null;
    export type ke_factor_1f = string | null;
    export type ke_factor_2_1 = string | null;
    export type ke_factor_2_2 = string | null;
    export type ke_factor_2f = string | null;
    export type ke_factor_3_1 = string | null;
    export type ke_factor_3_2 = string | null;
    export type ke_factor_3f = string | null;
    export type ke_factor_4_1 = string | null;
    export type ke_factor_4_2 = string | null;
    export type ke_factor_4f = string | null;
    export type ke_factor_5_1 = string | null;
    export type ke_factor_5_2 = string | null;
    export type ke_factor_5f = string | null;
    export type ke_factor_6_1 = string | null;
    export type ke_factor_6_2 = string | null;
    export type ke_factor_6f = string | null;
    export type ke_factor_7f = string | null;
    export type ac_factor_p = string | null;
    export type ac_factor_m = string | null;

}

export interface global_input {
    [key: string]: any;
    global_input_id: global_inputFields.global_input_id;
    poss_tariff_increase: global_inputFields.poss_tariff_increase;
    ke_factor_1_1: global_inputFields.ke_factor_1_1;
    ke_factor_1_2: global_inputFields.ke_factor_1_2;
    ke_factor_1f: global_inputFields.ke_factor_1f;
    ke_factor_2_1: global_inputFields.ke_factor_2_1;
    ke_factor_2_2: global_inputFields.ke_factor_2_2;
    ke_factor_2f: global_inputFields.ke_factor_2f;
    ke_factor_3_1: global_inputFields.ke_factor_3_1;
    ke_factor_3_2: global_inputFields.ke_factor_3_2;
    ke_factor_3f: global_inputFields.ke_factor_3f;
    ke_factor_4_1: global_inputFields.ke_factor_4_1;
    ke_factor_4_2: global_inputFields.ke_factor_4_2;
    ke_factor_4f: global_inputFields.ke_factor_4f;
    ke_factor_5_1: global_inputFields.ke_factor_5_1;
    ke_factor_5_2: global_inputFields.ke_factor_5_2;
    ke_factor_5f: global_inputFields.ke_factor_5f;
    ke_factor_6_1: global_inputFields.ke_factor_6_1;
    ke_factor_6_2: global_inputFields.ke_factor_6_2;
    ke_factor_6f: global_inputFields.ke_factor_6f;
    ke_factor_7f: global_inputFields.ke_factor_7f;
    ac_factor_p: global_inputFields.ac_factor_p;
    ac_factor_m: global_inputFields.ac_factor_m;

}

export namespace outletFields {
    export type outlet_id = number;
    export type name = string;
    export type customer_id = number;
    export type outlet_status = string | null;
    export type outlet_address = string | null;
    export type outlet_type = string | null;

}

export interface outlet {
    [key: string]: any;
    outlet_id: outletFields.outlet_id;
    name: outletFields.name;
    customer_id: outletFields.customer_id;
    outlet_status: outletFields.outlet_status;
    outlet_address: outletFields.outlet_address;
    outlet_type: outletFields.outlet_type;
    customer?: customer;
    outlet_month?: outlet_month[];
    outlet_month_shifts?: outlet_month_shifts[];
    outlet_person_in_charges?: outlet_person_in_charge[];
    outlet_device_ex_fa_inputs?: outlet_device_ex_fa_input[];
    outlet_device_ac_inputs?: outlet_device_ac_input[];
}

export namespace outlet_device_ac_inputFields {
    export type outlet_id = number;
    export type od_device_input_id = number;
    export type outlet_date = string;
    export type device_num = string;
    export type ac_baseline_kW = string | null;
    export type ac_factor_a = string | null;
    export type name = string | null;
    export type last_update = string | null;
    export type eqpt_serial_no = string | null;
    export type eqpt_manufacturer = string | null;
    export type live_date = string | null;
    export type eqpt_model = string | null;
    export type eqpt_photo = string | null;

}

export interface outlet_device_ac_input {
    [key: string]: any;
    outlet_id: outlet_device_ac_inputFields.outlet_id;
    od_device_input_id: outlet_device_ac_inputFields.od_device_input_id;
    outlet_date: outlet_device_ac_inputFields.outlet_date;
    device_num: outlet_device_ac_inputFields.device_num;
    ac_baseline_kW: outlet_device_ac_inputFields.ac_baseline_kW;
    ac_factor_a: outlet_device_ac_inputFields.ac_factor_a;
    name: outlet_device_ac_inputFields.name;
    last_update: outlet_device_ac_inputFields.last_update;
    eqpt_serial_no: outlet_device_ac_inputFields.eqpt_serial_no;
    eqpt_manufacturer: outlet_device_ac_inputFields.eqpt_manufacturer;
    live_date: outlet_device_ac_inputFields.live_date;
    eqpt_model: outlet_device_ac_inputFields.eqpt_model;
    eqpt_photo: outlet_device_ac_inputFields.eqpt_photo;
}

export namespace outlet_device_ex_fa_inputFields {
    export type outlet_id = number;
    export type od_device_input_id = number;
    export type name = string;
    export type outlet_date = string;
    export type device_type = string;
    export type device_num = string;
    export type vfd_kW = string | null;
    export type display_baseline_kW = string | null;
    export type display_low_kW = string | null;
    export type dmm_baseline_kW = string | null;
    export type dmm_low_kW = string | null;
    export type caltr_type = string | null;
    export type last_update = string | null;
    export type eqpt_serial_no = string | null;
    export type eqpt_manufacturer = string | null;
    export type live_date = string | null;
    export type eqpt_model = string | null;
    export type eqpt_photo = string | null;

}



export interface outlet_device_ex_fa_input {
    [key: string]: any;
    outlet_id: outlet_device_ex_fa_inputFields.outlet_id;
    od_device_input_id: outlet_device_ex_fa_inputFields.od_device_input_id;
    name: outlet_device_ex_fa_inputFields.name;
    outlet_date: outlet_device_ex_fa_inputFields.outlet_date;
    device_type: outlet_device_ex_fa_inputFields.device_type;
    device_num: outlet_device_ex_fa_inputFields.device_num;
    vfd_kW: outlet_device_ex_fa_inputFields.vfd_kW;
    display_baseline_kW: outlet_device_ex_fa_inputFields.display_baseline_kW;
    display_low_kW: outlet_device_ex_fa_inputFields.display_low_kW;
    dmm_baseline_kW: outlet_device_ex_fa_inputFields.dmm_baseline_kW;
    dmm_low_kW: outlet_device_ex_fa_inputFields.dmm_low_kW;
    caltr_type: outlet_device_ex_fa_inputFields.caltr_type;
    last_update: outlet_device_ex_fa_inputFields.last_update;
    eqpt_serial_no: outlet_device_ex_fa_inputFields.eqpt_serial_no;
    eqpt_manufacturer: outlet_device_ex_fa_inputFields.eqpt_manufacturer;
    live_date: outlet_device_ex_fa_inputFields.live_date;
    eqpt_model: outlet_device_ex_fa_inputFields.eqpt_model;
    eqpt_photo: outlet_device_ex_fa_inputFields.eqpt_photo;
    ac_baseline_kW: outlet_device_ac_inputFields.ac_baseline_kW;
    ac_factor_a: outlet_device_ac_inputFields.ac_factor_a;
    outlet?: outlet | any;
}



export interface outlet_device_ex_fa_ac_input {
    [key: string]: any;
    outlet_id: outlet_device_ex_fa_inputFields.outlet_id;
    od_device_input_id: outlet_device_ex_fa_inputFields.od_device_input_id;
    name: outlet_device_ex_fa_inputFields.name;
    outlet_date: outlet_device_ex_fa_inputFields.outlet_date;
    device_type: outlet_device_ex_fa_inputFields.device_type;
    device_num: outlet_device_ex_fa_inputFields.device_num;
    vfd_kW: outlet_device_ex_fa_inputFields.vfd_kW;
    display_baseline_kW: outlet_device_ex_fa_inputFields.display_baseline_kW;
    display_low_kW: outlet_device_ex_fa_inputFields.display_low_kW;
    dmm_baseline_kW: outlet_device_ex_fa_inputFields.dmm_baseline_kW;
    dmm_low_kW: outlet_device_ex_fa_inputFields.dmm_low_kW;
    caltr_type: outlet_device_ex_fa_inputFields.caltr_type;
    last_update: outlet_device_ex_fa_inputFields.last_update;
    eqpt_serial_no: outlet_device_ex_fa_inputFields.eqpt_serial_no;
    eqpt_manufacturer: outlet_device_ex_fa_inputFields.eqpt_manufacturer;
    live_date: outlet_device_ex_fa_inputFields.live_date;
    eqpt_model: outlet_device_ex_fa_inputFields.eqpt_model;
    eqpt_photo: outlet_device_ex_fa_inputFields.eqpt_photo;
    ac_baseline_kW: outlet_device_ac_inputFields.ac_baseline_kW;
    ac_factor_a: outlet_device_ac_inputFields.ac_factor_a;
    outlet?: outlet | any;
}

export namespace outlet_device_live_dateFields {
    export type outlet_id = number;
    export type outlet_date = string;
    export type ke_live_date = string | null;
    export type ac_live_date = string | null;

}

export interface outlet_device_live_date {
    outlet_id: outlet_device_live_dateFields.outlet_id;
    outlet_date: outlet_device_live_dateFields.outlet_date;
    ke_live_date: outlet_device_live_dateFields.ke_live_date;
    ac_live_date: outlet_device_live_dateFields.ac_live_date;

}

export namespace outlet_monthFields {
    export type outlet_date = string;
    export type outlet_outlet_id = number;
    export type percent_share_of_savings = string | null;
    export type last_avail_tariff = string | null;
    export type tariff_month = string | null;
    export type no_of_ex_in_outlet = number | null;
    export type no_of_fa_in_outlet = number | null;
    export type no_of_ac_in_outlet = number | null;
    export type no_of_ex_installed = number | null;
    export type no_of_fa_installed = number | null;
    export type no_of_ac_installed = number | null;
    export type remarks_on_eqpt_in_outlet_or_installed = string | null;
    export type remarks_on_overall_outlet = string | null;

}

export interface outlet_month {
    [key: string]: any;
    outlet_date: outlet_monthFields.outlet_date;
    outlet_outlet_id: outlet_monthFields.outlet_outlet_id;
    percent_share_of_savings: outlet_monthFields.percent_share_of_savings;
    last_avail_tariff: outlet_monthFields.last_avail_tariff;
    tariff_month: outlet_monthFields.tariff_month;
    no_of_ex_in_outlet: outlet_monthFields.no_of_ex_in_outlet;
    no_of_fa_in_outlet: outlet_monthFields.no_of_fa_in_outlet;
    no_of_ac_in_outlet: outlet_monthFields.no_of_ac_in_outlet;
    no_of_ex_installed: outlet_monthFields.no_of_ex_installed;
    no_of_fa_installed: outlet_monthFields.no_of_fa_installed;
    no_of_ac_installed: outlet_monthFields.no_of_ac_installed;
    remarks_on_eqpt_in_outlet_or_installed: outlet_monthFields.remarks_on_eqpt_in_outlet_or_installed;
    remarks_on_overall_outlet: outlet_monthFields.remarks_on_overall_outlet;

}

export namespace outlet_month_shiftsFields {
    export type outlet_id = number;
    export type outlet_date = string;
    export type day_of_week = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'holiday';
    export type shift_num = number;
    export type startTime = string | null;
    export type endTime = string | null;
    export type remarks_on_op_hours = string | null;

}

export interface outlet_month_shifts {
    [key: string]: any;
    outlet_id: outlet_month_shiftsFields.outlet_id;
    outlet_date: outlet_month_shiftsFields.outlet_date;
    day_of_week: outlet_month_shiftsFields.day_of_week;
    shift_num: outlet_month_shiftsFields.shift_num;
    startTime: outlet_month_shiftsFields.startTime;
    endTime: outlet_month_shiftsFields.endTime;
    remarks_on_op_hours: outlet_month_shiftsFields.remarks_on_op_hours;

}

export namespace outlet_person_in_chargeFields {
    export type outlet_id = number;
    export type contact_person_index = number;
    export type contact_person_name = string | null;
    export type contact_person_position = string | null;
    export type contact_person_address = string | null;
    export type contact_person_phone = string | null;
    export type primary_contact = boolean;
}

export interface outlet_person_in_charge {
    [key: string]: any;
    outlet_id?: outlet_person_in_chargeFields.outlet_id;
    contact_person_index: outlet_person_in_chargeFields.contact_person_index;
    contact_person_name: outlet_person_in_chargeFields.contact_person_name;
    contact_person_position: outlet_person_in_chargeFields.contact_person_position;
    contact_person_address: outlet_person_in_chargeFields.contact_person_address;
    contact_person_phone: outlet_person_in_chargeFields.contact_person_phone;
    primary_contact: outlet_person_in_chargeFields.primary_contact;
}

export namespace resultsFields {
    export type outlet_id = number;
    export type outlet_date = string;
    export type ke_measured_savings_kWh = string | null;
    export type ac_measured_savings_kWh = string | null;
    export type acmv_measured_savings_kWh = string | null;
    export type outlet_measured_savings_kWh = string | null;
    export type outlet_measured_savings_expenses = string | null;
    export type outlet_measured_savings_percent = string | null;
    export type co2_savings_kg = string | null;
    export type savings_tariff_expenses = string | null;
    export type tp_sales_expenses = string | null;
    export type ke_eqpt_energy_baseline_avg_hourly_kW = string | null;
    export type ac_eqpt_energy_baseline_avg_hourly_kW = string | null;
    export type acmv_eqpt_energy_baseline_avg_hourly_kW = string | null;
    export type ke_eqpt_energy_baseline_avg_hourly_as_date = string | null;
    export type ac_eqpt_energy_baseline_avg_hourly_as_date = string | null;
    export type acmv_eqpt_energy_baseline_avg_hourly_as_date = string | null;
    export type ke_eqpt_energy_usage_without_TP_month_kW = string | null;
    export type ac_eqpt_energy_usage_without_TP_month_kW = string | null;
    export type outlet_eqpt_energy_usage_without_TP_month_kW = string | null;
    export type outlet_eqpt_energy_usage_without_TP_month_expenses = string | null;
    export type ke_eqpt_energy_usage_with_TP_month_kW = string | null;
    export type ac_eqpt_energy_usage_with_TP_month_kW = string | null;
    export type outlet_eqpt_energy_usage_with_TP_month_kW = string | null;
    export type outlet_eqpt_energy_usage_with_TP_month_expenses = string | null;
    export type acmv_25percent_benchmark_comparison_kWh = string | null;
    export type acmv_25percent_benchmark_comparison_expenses = string | null;
    export type acmv_10percent_benchmark_comparison_kWh = string | null;
    export type acmv_10percent_benchmark_comparison_expenses = string | null;
    export type ke_and_ac__25percent_benchmark_comparison_kWh = string | null;
    export type ke_and_ac__25percent_benchmark_comparison_expenses = string | null;
    export type monday = string | null;
    export type tuesday = string | null;
    export type wednesday = string | null;
    export type thursday = string | null;
    export type friday = string | null;
    export type saturday = string | null;
    export type sunday = string | null;
    export type holiday = string | null;

}

export interface results {
    outlet_id: resultsFields.outlet_id;
    outlet_date: resultsFields.outlet_date;
    ke_measured_savings_kWh: resultsFields.ke_measured_savings_kWh;
    ac_measured_savings_kWh: resultsFields.ac_measured_savings_kWh;
    acmv_measured_savings_kWh: resultsFields.acmv_measured_savings_kWh;
    outlet_measured_savings_kWh: resultsFields.outlet_measured_savings_kWh;
    outlet_measured_savings_expenses: resultsFields.outlet_measured_savings_expenses;
    outlet_measured_savings_percent: resultsFields.outlet_measured_savings_percent;
    co2_savings_kg: resultsFields.co2_savings_kg;
    savings_tariff_expenses: resultsFields.savings_tariff_expenses;
    tp_sales_expenses: resultsFields.tp_sales_expenses;
    ke_eqpt_energy_baseline_avg_hourly_kW: resultsFields.ke_eqpt_energy_baseline_avg_hourly_kW;
    ac_eqpt_energy_baseline_avg_hourly_kW: resultsFields.ac_eqpt_energy_baseline_avg_hourly_kW;
    acmv_eqpt_energy_baseline_avg_hourly_kW: resultsFields.acmv_eqpt_energy_baseline_avg_hourly_kW;
    ke_eqpt_energy_baseline_avg_hourly_as_date: resultsFields.ke_eqpt_energy_baseline_avg_hourly_as_date;
    ac_eqpt_energy_baseline_avg_hourly_as_date: resultsFields.ac_eqpt_energy_baseline_avg_hourly_as_date;
    acmv_eqpt_energy_baseline_avg_hourly_as_date: resultsFields.acmv_eqpt_energy_baseline_avg_hourly_as_date;
    ke_eqpt_energy_usage_without_TP_month_kW: resultsFields.ke_eqpt_energy_usage_without_TP_month_kW;
    ac_eqpt_energy_usage_without_TP_month_kW: resultsFields.ac_eqpt_energy_usage_without_TP_month_kW;
    outlet_eqpt_energy_usage_without_TP_month_kW: resultsFields.outlet_eqpt_energy_usage_without_TP_month_kW;
    outlet_eqpt_energy_usage_without_TP_month_expenses: resultsFields.outlet_eqpt_energy_usage_without_TP_month_expenses;
    ke_eqpt_energy_usage_with_TP_month_kW: resultsFields.ke_eqpt_energy_usage_with_TP_month_kW;
    ac_eqpt_energy_usage_with_TP_month_kW: resultsFields.ac_eqpt_energy_usage_with_TP_month_kW;
    outlet_eqpt_energy_usage_with_TP_month_kW: resultsFields.outlet_eqpt_energy_usage_with_TP_month_kW;
    outlet_eqpt_energy_usage_with_TP_month_expenses: resultsFields.outlet_eqpt_energy_usage_with_TP_month_expenses;
    acmv_25percent_benchmark_comparison_kWh: resultsFields.acmv_25percent_benchmark_comparison_kWh;
    acmv_25percent_benchmark_comparison_expenses: resultsFields.acmv_25percent_benchmark_comparison_expenses;
    acmv_10percent_benchmark_comparison_kWh: resultsFields.acmv_10percent_benchmark_comparison_kWh;
    acmv_10percent_benchmark_comparison_expenses: resultsFields.acmv_10percent_benchmark_comparison_expenses;
    ke_and_ac__25percent_benchmark_comparison_kWh: resultsFields.ke_and_ac__25percent_benchmark_comparison_kWh;
    ke_and_ac__25percent_benchmark_comparison_expenses: resultsFields.ke_and_ac__25percent_benchmark_comparison_expenses;
    monday: resultsFields.monday;
    tuesday: resultsFields.tuesday;
    wednesday: resultsFields.wednesday;
    thursday: resultsFields.thursday;
    friday: resultsFields.friday;
    saturday: resultsFields.saturday;
    sunday: resultsFields.sunday;
    holiday: resultsFields.holiday;
    outlet: outlet;
}

export namespace rg_factorsFields {
    export type outlet_id = number;
    export type ke_factor_rg1 = string | null;
    export type ke_factor_rg2 = string | null;
    export type ke_factor_rg3 = string | null;
    export type ke_factor_rg4 = string | null;
    export type ac_factor_rg1 = string | null;
    export type ac_factor_rg2 = string | null;
    export type ac_factor_rg3 = string | null;
    export type ac_factor_rg4 = string | null;

}

export interface rg_factors {
    outlet_id: rg_factorsFields.outlet_id;
    ke_factor_rg1: rg_factorsFields.ke_factor_rg1;
    ke_factor_rg2: rg_factorsFields.ke_factor_rg2;
    ke_factor_rg3: rg_factorsFields.ke_factor_rg3;
    ke_factor_rg4: rg_factorsFields.ke_factor_rg4;
    ac_factor_rg1: rg_factorsFields.ac_factor_rg1;
    ac_factor_rg2: rg_factorsFields.ac_factor_rg2;
    ac_factor_rg3: rg_factorsFields.ac_factor_rg3;
    ac_factor_rg4: rg_factorsFields.ac_factor_rg4;

}

export namespace secondary_intermediary_tableFields {
    export type outlet_id = number;
    export type outlet_month_year = string;
    export type day_of_month = string;
    export type time = string | null;
    export type ke_without_TP_kWh = string | null;
    export type ke_baseline_kW = string | null;
    export type ac_without_TP_kWh = string | null;
    export type ac_baseline_kW = string | null;
    export type acmv_without_TP_kWh = string | null;
    export type acmv_baseline_kW = string | null;

}

export interface secondary_intermediary_table {
    outlet_id: secondary_intermediary_tableFields.outlet_id;
    outlet_month_year: secondary_intermediary_tableFields.outlet_month_year;
    day_of_month: secondary_intermediary_tableFields.day_of_month;
    time: secondary_intermediary_tableFields.time;
    ke_without_TP_kWh: secondary_intermediary_tableFields.ke_without_TP_kWh;
    ke_baseline_kW: secondary_intermediary_tableFields.ke_baseline_kW;
    ac_without_TP_kWh: secondary_intermediary_tableFields.ac_without_TP_kWh;
    ac_baseline_kW: secondary_intermediary_tableFields.ac_baseline_kW;
    acmv_without_TP_kWh: secondary_intermediary_tableFields.acmv_without_TP_kWh;
    acmv_baseline_kW: secondary_intermediary_tableFields.acmv_baseline_kW;

}

export namespace _prisma_migrationsFields {
    export type id = string;
    export type checksum = string;
    export type finished_at = Date | null;
    export type migration_name = string;
    export type logs = string | null;
    export type rolled_back_at = Date | null;
    export type started_at = Date;
    export type applied_steps_count = number;

}

export interface _prisma_migrations {
    id: _prisma_migrationsFields.id;
    checksum: _prisma_migrationsFields.checksum;
    finished_at: _prisma_migrationsFields.finished_at;
    migration_name: _prisma_migrationsFields.migration_name;
    logs: _prisma_migrationsFields.logs;
    rolled_back_at: _prisma_migrationsFields.rolled_back_at;
    started_at: _prisma_migrationsFields.started_at;
    applied_steps_count: _prisma_migrationsFields.applied_steps_count;

}
