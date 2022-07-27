import Image from "next/image";

interface Props {
    selectedData: any;
    onEdit(selectedData: any): void;
    onDelete(selectedData: any): void;
}

const TinyEditDeleteMenu = ({selectedData, onEdit, onDelete, }: Props) => {
    return (
        <div className="block z-10">
            <div className="bg-white border border-gray-300 rounded-lg flex flex-col py-1 px-1 text-black shadow-lg">
                <div onClick={e => onEdit(selectedData)} className="flex hover:bg-gray-100 py-1 px-2 rounded">
                    <div className="space-x-2">
                        <Image src="/asserts/main/edit.svg" alt="editSvg" width="15" height="15" />
                        <span>Edit</span>
                    </div>
                </div>
                <div onClick={e => onDelete(selectedData)} className="flex hover:bg-gray-100 py-1 px-2 rounded">
                    <div className="space-x-2">
                        <Image src="/asserts/main/delete.svg" alt="deleteSvg" width="15" height="16" />
                        <span>Delete</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TinyEditDeleteMenu;