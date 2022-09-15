import type { NextComponentType, NextPage } from 'next'
import Table from '../components/Table'
import React from 'react';
import CustomerEdit from '../components/CustomerEdit'
import { DummyCustomerDataRow } from '../common/constant'
import CustomizedInput from '../components/CustomizedInput';
import { gql, useMutation, useQuery } from "@apollo/client";
import ClientOnly from '../components/ClientOnly';
import { global_input } from '../types/datatype';
import rfdc from 'rfdc';

const cloneDeep = rfdc();

const GeneralSettings: NextPage = () => {
    const [openCustomerEdit, setOpenCustomerEdit] = React.useState(false);

    const [global_input_state, setGlobal_input_state] = React.useState<global_input>({
        global_input_id: -1,
        poss_tariff_increase: "0",
        ke_factor_1_1: "",
        ke_factor_1_2: "",
        ke_factor_1f: "",
        ke_factor_2_1: "",
        ke_factor_2_2: "",
        ke_factor_2f: "",
        ke_factor_3_1: "",
        ke_factor_3_2: "",
        ke_factor_3f: "",
        ke_factor_4_1: "",
        ke_factor_4_2: "",
        ke_factor_4f: "",
        ke_factor_5_1: "",
        ke_factor_5_2: "",
        ke_factor_5f: "",
        ke_factor_6_1: "",
        ke_factor_6_2: "",
        ke_factor_6f: "",
        ke_factor_7f: "",
        ac_factor_p: "",
        ac_factor_m: "",

    });

    function getDummyCustomerData(): any[] {
        const dummyArr = [];
        for (var i = 0; i < 17; i++) {
            dummyArr.push(DummyCustomerDataRow);
        }
        return dummyArr;
    }

    return (
        <React.Fragment>
            <ClientOnly>
                <SettingComp setGlobal_input_state={setGlobal_input_state} global_input_state={global_input_state}></SettingComp>
            </ClientOnly>

        </React.Fragment >
    )
}

const SettingComp: any = ({ setGlobal_input_state, global_input_state }: any) => {
    const QUERY = gql`
    query Global_inputs($take: Int) {
        global_inputs(take: $take) {
          global_input_id
          poss_tariff_increase
          ke_factor_1_1
          ke_factor_1_2
          ke_factor_1f
          ke_factor_2_1
          ke_factor_2_2
          ke_factor_2f
          ke_factor_3_1
          ke_factor_3_2
          ke_factor_3f
          ke_factor_4_1
          ke_factor_4_2
          ke_factor_4f
          ke_factor_5_1
          ke_factor_5_2
          ke_factor_5f
          ke_factor_6_1
          ke_factor_6_2
          ke_factor_6f
          ke_factor_7f
          ac_factor_p
          ac_factor_m
        }
      }
    `;

    const mutate_query = gql`
    mutation Mutation($data: Global_inputUpdateInput!, $where: Global_inputWhereUniqueInput!) {
        updateOneGlobal_input(data: $data, where: $where) {
            global_input_id
          poss_tariff_increase
          ke_factor_1_1
          ke_factor_1_2
          ke_factor_1f
          ke_factor_2_1
          ke_factor_2_2
          ke_factor_2f
          ke_factor_3_1
          ke_factor_3_2
          ke_factor_3f
          ke_factor_4_1
          ke_factor_4_2
          ke_factor_4f
          ke_factor_5_1
          ke_factor_5_2
          ke_factor_5f
          ke_factor_6_1
          ke_factor_6_2
          ke_factor_6f
          ke_factor_7f
          ac_factor_p
          ac_factor_m
        }
    }`;

    const mutate_create_query = gql`
    mutation CreateOneGlobal_input($data: Global_inputCreateInput!) {
        createOneGlobal_input(data: $data) {
          global_input_id
          poss_tariff_increase
          ke_factor_1_1
          ke_factor_1_2
          ke_factor_1f
          ke_factor_2_1
          ke_factor_2_2
          ke_factor_2f
          ke_factor_3_1
          ke_factor_3_2
          ke_factor_3f
          ke_factor_4_1
          ke_factor_4_2
          ke_factor_4f
          ke_factor_5_1
          ke_factor_5_2
          ke_factor_5f
          ke_factor_6_1
          ke_factor_6_2
          ke_factor_6f
          ke_factor_7f
          ac_factor_p
          ac_factor_m
        }
      }`;

    const VARIABLES = {
        variables: {
            "take": 1
        }
    }

    const { data, loading, error } = useQuery(QUERY, VARIABLES);
    const [updatedAttributes, setUpdatedAttributes] = React.useState<string[]>([]);
    const [updateMutationQuery, updateMutationResult = { data, loading, error }] = useMutation(mutate_query);
    const [createMutationQuery, createMutationResult = { data, loading, error }] = useMutation(mutate_create_query);
    let errorElem;

    React.useEffect(() => {
        if (data) {
            const { global_inputs } = data;
            global_inputs && global_inputs.length > 0 && setGlobal_input_state(global_inputs[0]);
            errorElem = undefined;
        } else {
            if (loading) {
                errorElem = <h2>Loading Data...</h2>;
            } else if (error) {
                errorElem = <h2>Sorry, there's been an error...</h2>;
            } else {
                errorElem = <></>;
            }
        }

    }, [loading, error, data]);

    const onChange = (value: string, attributeName: string) => {
        const cloned_global_input: global_input = cloneDeep(global_input_state);
        cloned_global_input[attributeName] = value;
        setGlobal_input_state(cloned_global_input);
        !updatedAttributes.includes(attributeName) && setUpdatedAttributes([...updatedAttributes, attributeName]);
    }

    const onBlur = (value: string, attributeName: string) => {
    }

    const onClick = (event: any) => {
        if (global_input_state.global_input_id !== -1) {
            const MUTATE_VARIABLES = {
                variables: {
                    "where": {
                        "global_input_id": global_input_state.global_input_id
                    },
                    "data": {
                        "poss_tariff_increase": {
                            "set": global_input_state.poss_tariff_increase
                        },
                        "ke_factor_1_1": {
                            "set": global_input_state.ke_factor_1_1
                        },
                        "ke_factor_1_2": {
                            "set": global_input_state.ke_factor_1_2
                        },
                        "ke_factor_1f": {
                            "set": global_input_state.ke_factor_1f
                        },
                        "ke_factor_2_1": {
                            "set": global_input_state.ke_factor_2_1
                        },
                        "ke_factor_2_2": {
                            "set": global_input_state.ke_factor_2_2
                        },
                        "ke_factor_2f": {
                            "set": global_input_state.ke_factor_2f
                        },
                        "ke_factor_3_1": {
                            "set": global_input_state.ke_factor_3_1
                        },
                        "ke_factor_3_2": {
                            "set": global_input_state.ke_factor_3_2
                        },
                        "ke_factor_3f": {
                            "set": global_input_state.ke_factor_3f
                        },
                        "ke_factor_4_1": {
                            "set": global_input_state.ke_factor_4_1
                        },
                        "ke_factor_4_2": {
                            "set": global_input_state.ke_factor_4_2
                        },
                        "ke_factor_4f": {
                            "set": global_input_state.ke_factor_4f
                        },
                        "ke_factor_5_1": {
                            "set": global_input_state.ke_factor_5_1
                        },
                        "ke_factor_5_2": {
                            "set": global_input_state.ke_factor_5_2
                        },
                        "ke_factor_5f": {
                            "set": global_input_state.ke_factor_5f
                        },
                        "ke_factor_6_1": {
                            "set": global_input_state.ke_factor_6_1
                        },
                        "ke_factor_6_2": {
                            "set": global_input_state.ke_factor_6_2
                        },
                        "ke_factor_6f": {
                            "set": global_input_state.ke_factor_6f
                        },
                        "ke_factor_7f": {
                            "set": global_input_state.ke_factor_7f
                        },
                        "ac_factor_p": {
                            "set": global_input_state.ac_factor_p
                        },
                        "ac_factor_m": {
                            "set": global_input_state.ac_factor_m
                        },
                    }
                }
            };
            updateMutationQuery(MUTATE_VARIABLES);
        } else {
            const MUTATE_VARIABLES = {
                variables: {
                    "data": {
                        "ke_factor_1_1": global_input_state.ke_factor_1_1,
                        "ke_factor_1_2": global_input_state.ke_factor_1_2,
                        "ke_factor_1f": global_input_state.ke_factor_1f,
                        "ke_factor_2_1": global_input_state.ke_factor_2_1,
                        "ke_factor_2_2": global_input_state.ke_factor_2_2,
                        "ke_factor_2f": global_input_state.ke_factor_2f,
                        "ke_factor_3_1": global_input_state.ke_factor_3_1,
                        "ke_factor_3_2": global_input_state.ke_factor_3_2,
                        "ke_factor_3f": global_input_state.ke_factor_3f,
                        "ke_factor_4_1": global_input_state.ke_factor_4_1,
                        "ke_factor_4_2": global_input_state.ke_factor_4_2,
                        "ke_factor_4f": global_input_state.ke_factor_4f,
                        "ke_factor_5_1": global_input_state.ke_factor_5_1,
                        "ke_factor_5_2": global_input_state.ke_factor_5_2,
                        "ke_factor_5f": global_input_state.ke_factor_5f,
                        "ke_factor_6_1": global_input_state.ke_factor_6_1,
                        "ke_factor_6_2": global_input_state.ke_factor_6_2,
                        "ke_factor_6f": global_input_state.ke_factor_6f,
                        "ke_factor_7f": global_input_state.ke_factor_7f,
                        "ac_factor_p": global_input_state.ac_factor_p,
                        "ac_factor_m": global_input_state.ac_factor_m,
                        "poss_tariff_increase": global_input_state.poss_tariff_increase
                    }
                }
            };
            createMutationQuery(MUTATE_VARIABLES);
        }

    }

    return !errorElem ? (<div className="flex flex-col gap-y-2">
        <div className="drop-shadow-lg rounded-lg p-4 bg-white">
            <CustomizedInput label={"Poss tariff increase"} inputType="text" onChange={(val) => onChange(val, 'poss_tariff_increase')} value={global_input_state.poss_tariff_increase} />
        </div>
        <div className="drop-shadow-lg rounded-lg p-4 bg-white">
            <div className="edit-sub-container">
                <div className="flex justify-between">
                    <h2><b>Kitchen</b><br /> Exhaust</h2>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_1_1')} label={"KE Factor 1.1"} inputType="text" value={global_input_state.ke_factor_1_1} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_1_2')} label={"KE Factor 1.2"} inputType="text" value={global_input_state.ke_factor_1_2} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_1f')} label={"KE Factor 1.f"} inputType="text" value={global_input_state.ke_factor_1f} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_2_1')} label={"KE Factor 2.1"} inputType="text" value={global_input_state.ke_factor_2_1} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_2_2')} label={"KE Factor 2.2"} inputType="text" value={global_input_state.ke_factor_2_2} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_2f')} label={"KE Factor 2.f"} inputType="text" value={global_input_state.ke_factor_2f} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_3_1')} label={"KE Factor 3.1"} inputType="text" value={global_input_state.ke_factor_3_1} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_3_2')} label={"KE Factor 3.2"} inputType="text" value={global_input_state.ke_factor_3_2} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_3f')} label={"KE Factor 3.f"} inputType="text" value={global_input_state.ke_factor_3f} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_4_1')} label={"KE Factor 4.1"} inputType="text" value={global_input_state.ke_factor_4_1} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_4_2')} label={"KE Factor 4.2"} inputType="text" value={global_input_state.ke_factor_4_2} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_4f')} label={"KE Factor 4.f"} inputType="text" value={global_input_state.ke_factor_4f} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_5_1')} label={"KE Factor 5.1"} inputType="text" value={global_input_state.ke_factor_5_1} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_5_2')} label={"KE Factor 5.2"} inputType="text" value={global_input_state.ke_factor_5_2} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_5f')} label={"KE Factor 5.f"} inputType="text" value={global_input_state.ke_factor_5f} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_6_1')} label={"KE Factor 6.1"} inputType="text" value={global_input_state.ke_factor_6_1} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_6_2')} label={"KE Factor 6.2"} inputType="text" value={global_input_state.ke_factor_6_2} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_6f')} label={"KE Factor 6.f"} inputType="text" value={global_input_state.ke_factor_6f} />
                    <CustomizedInput onChange={(val) => onChange(val, 'ke_factor_7f')} label={"KE Factor 7.f"} inputType="text" value={global_input_state.ke_factor_7f} />
                </div>
            </div>
        </div>
        <div className="drop-shadow-lg rounded-lg p-4 bg-white grid grid-cols-3 gap-2">
            <div className="flex justify-between">
                <h2><b>Air</b><br />Conditioning</h2>
            </div>
            <CustomizedInput onChange={(val) => onChange(val, 'ac_factor_p')} label={"AC Factor P"} inputType="text" value={global_input_state.ac_factor_p} />
            <CustomizedInput onChange={(val) => onChange(val, 'ac_factor_m')} label={"AC Factor M"} inputType="text" value={global_input_state.ac_factor_m} />
        </div>
        <div className="drop-shadow-lg rounded-lg p-4 bg-white w-100 flex flex-row justify-center gap-x-3 w-full">
            {/* <button type='button' className="bg-white text-blue-500 border border-neutral-400 rounded-lg w-full text-sm h-11 text-center">Reset</button> */}
            <button type='button' onClick={(e) => { onClick(e) }} className="bg-blue-500 text-white rounded-lg w-1/3 text-sm h-11 text-center">{updateMutationResult.loading || createMutationResult.loading ? 'Loading' : 'Save'}</button>
        </div>
    </div>) : <React.Fragment>
        {errorElem}
    </React.Fragment>
}


// export async function getStaticProps() {
//     const { data } = await client.query({
//         query: gql`
//         query Countries {
//           countries {
//             code
//             name
//             emoji
//           }
//         }
//       `,
//     });

//     return {
//         props: {
//             countries: data.countries.slice(0, 4),
//         },
//     };
// }

GeneralSettings.getInitialProps = async () => {
    const title = 'General Settings';
    return { title };
};


export default GeneralSettings
