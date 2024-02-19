import React from "react";

interface Props {
    title: String;
    body: JSX.Element;
}

const SavingProjectionBox = (props: Props): React.ReactElement => {
    return <div className="flex flex-col rounded-md border-2 border-stack-bar-inner ">
        <div className="bg-stack-bar-inner w-100 text-center">
            <p className="text-tp-orange text-custom-lg1 py-2">{props.title}</p>
        </div>
        <div className="p-10">
            {props.body}
        </div>
    </div>
}
export default SavingProjectionBox;