import { Image } from "antd";
import { NextPage } from "next";
import React from "react";

const Index: NextPage = () => {
    return <React.Fragment>
        <div className="h-screen bg-cover bg-[url('/grouplogin.jpg')] bg-bottom">
            <div className="absolute left-0 bottom-36 bg-tp-orange p-10">
                <Image width={'195px'} height={'45px'} preview={false} src="/logowhite.png"></Image>
                <h2 className="text-stack-bar-inner text-[50px] leading-[62.5px]">Energy Savings Projection</h2>
            </div>
        </div>

    </React.Fragment>
}

export default Index;