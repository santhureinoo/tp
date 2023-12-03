import { Checkbox, Input } from "antd";
import React from "react"
import { Item, group } from "../../types/datatype";
import { InfoCircleOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import rfdc from "rfdc";
import { WatchQueryFetchPolicy, gql, useLazyQuery } from "@apollo/client";

interface Props {
    Items: Item[];
    Label: string;
    onSelected: (items: Item[]) => void;
}

const cloneDeep = rfdc();

const MultiItemSelector = ({ Items, Label, onSelected }: Props): React.ReactElement => {

    const indeterminate = React.useMemo(() => {
        return Items.length > 0 && Items.filter(item => item.checked).length > 0 && Items.filter(item => item.checked).length < Items.length;
    }, [Items])

    const checkAll = React.useMemo(() => {
        return Items.length > 0 && Items.every(item => item.checked);
    }, [Items])

    const onSelect = (index: number, checked: boolean, checkedAll?: boolean) => {
        const clonedItems = cloneDeep(Items);
        if (checkedAll !== undefined) {
            clonedItems.forEach(item => item.checked = checkedAll);
        } else {
            clonedItems[index].checked = checked;
        }
        onSelected(clonedItems);
    }

    const [searchText, setSearchText] = React.useState('');

    const list = React.useMemo(() => {
        return <div className="flex flex-col gap-y-1.5 h-[350px] overflow-y-scroll">
            {Items.map((item, index) => {
                if (searchText !== '') {
                    if (item.display.indexOf(searchText) === -1) {
                        return <></>
                    }
                }
                return <Checkbox key={"chk-" + index} value={item.value} checked={item.checked} onChange={(event) => onSelect(index, event.target.checked)}>{item.display}</Checkbox>
            })}
        </div>;
    }, [Items, searchText]);

    return <React.Fragment>
        <div className="border border-grey-500 flex flex-col px-2 py-3 max-h-3/5">
            <div className="flex justify-between min-w-[300px]">
                <Checkbox indeterminate={indeterminate} onChange={() => { onSelect(0, true, !checkAll) }} checked={checkAll}>
                    {Items.filter(item => item.checked).length}/{Items.length} items
                </Checkbox>
                <p>{Label}</p>
            </div>
            <div className="py-3">
                <Input placeholder="Search here" value={searchText} onChange={(e) => setSearchText(e.currentTarget.value)} suffix={<SearchOutlined rev={undefined}></SearchOutlined>} />
            </div>
            {list}
        </div>
    </React.Fragment>
}

export default MultiItemSelector