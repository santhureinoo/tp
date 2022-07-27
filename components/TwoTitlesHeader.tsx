import React from "react";

interface Props {
    mainTitle: string;
    subTitle: string;
}

const TwoTitlesHeader = ({ mainTitle, subTitle }: Props) => {
    return (
        <React.Fragment>
            <div className="flex flex-col">
                <b>{mainTitle}</b>
                <span>{subTitle}</span>
            </div>
        </React.Fragment>
    )
}

export default TwoTitlesHeader;