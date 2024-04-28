import Link from "next/link";
import React from "react";
import { useRouter } from 'next/router';
import Image from "next/image";
import Icon from "@ant-design/icons/lib/components/Icon";
import tp from '../public/asserts/main/tp.svg';

interface Props {
    sidebarOpen: boolean;
    setSidebarOpen(sidebarOpen: boolean): void;
}


const getLinkContent = (label: string, isActive: boolean, imageFileName: string, imageIcon?: JSX.Element): JSX.Element => {
    return (
        <a className={isActive ? "link-active" : "link"}>
            {imageIcon ? imageIcon : <Image alt="selectSvg" src={`/asserts/sidebar/${imageFileName}${isActive ? '_select.svg' : '.svg'}`} width="25" height="25" />}
            <span className="mx-3">{label}</span>
        </a>
    )
}

const userIcon = () => (<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="13" r="13" fill="#E8F2FF" />
    <g clipPath="url(#clip0_887_8866)">
        <path d="M12.9137 12.7804C13.7079 12.7804 14.3955 12.4956 14.9574 11.9337C15.5192 11.3718 15.8041 10.6843 15.8041 9.89013C15.8041 9.09618 15.5192 8.40862 14.9573 7.84658C14.3953 7.28482 13.7078 7 12.9137 7C12.1195 7 11.4321 7.28482 10.8702 7.84668C10.3083 8.40853 10.0234 9.09609 10.0234 9.89013C10.0234 10.6843 10.3083 11.3719 10.8703 11.9338C11.4322 12.4955 12.1198 12.7804 12.9137 12.7804Z" fill="#147CFC" />
        <path d="M17.9717 16.2278C17.9555 15.994 17.9228 15.7389 17.8745 15.4696C17.8258 15.1982 17.7631 14.9417 17.688 14.7072C17.6105 14.4649 17.505 14.2255 17.3746 13.9962C17.2393 13.7582 17.0804 13.5509 16.902 13.3803C16.7155 13.2019 16.4872 13.0584 16.2232 12.9538C15.9601 12.8497 15.6685 12.797 15.3565 12.797C15.234 12.797 15.1156 12.8472 14.8868 12.9962C14.746 13.088 14.5813 13.1942 14.3974 13.3117C14.2402 13.4118 14.0273 13.5057 13.7643 13.5906C13.5076 13.6737 13.2471 13.7158 12.9899 13.7158C12.7327 13.7158 12.4723 13.6737 12.2154 13.5906C11.9526 13.5058 11.7397 13.4119 11.5827 13.3118C11.4006 13.1954 11.2358 13.0892 11.0929 12.9961C10.8643 12.8471 10.7458 12.7969 10.6233 12.7969C10.3113 12.7969 10.0198 12.8497 9.75674 12.9539C9.49288 13.0583 9.26446 13.2018 9.07779 13.3804C8.89953 13.5511 8.74051 13.7583 8.60537 13.9962C8.4751 14.2255 8.36963 14.4648 8.29199 14.7073C8.21701 14.9418 8.1543 15.1982 8.10559 15.4696C8.05734 15.7385 8.02457 15.9937 8.00836 16.2281C7.99243 16.4577 7.98438 16.696 7.98438 16.9367C7.98438 17.5631 8.1835 18.0702 8.57617 18.4442C8.96399 18.8132 9.47714 19.0005 10.1012 19.0005H15.8792C16.5032 19.0005 17.0162 18.8133 17.4041 18.4442C17.7969 18.0705 17.996 17.5633 17.996 16.9366C17.9959 16.6948 17.9878 16.4563 17.9717 16.2278Z" fill="#147CFC" />
    </g>
    <defs>
        <clipPath id="clip0_887_8866">
            <rect width="12" height="12" fill="white" transform="translate(7 7)" />
        </clipPath>
    </defs>
</svg>);

const logOut = () => (
    <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.5239 12.5233C26.1587 11.8885 26.1587 10.8576 25.5239 10.2228L19.0236 3.72245C18.3888 3.08765 17.3579 3.08765 16.7231 3.72245C16.0883 4.35724 16.0883 5.38815 16.7231 6.02295L20.4506 9.75048H9.75048C8.8516 9.75048 8.1254 10.4767 8.1254 11.3756C8.1254 12.2744 8.8516 13.0006 9.75048 13.0006H20.4506L16.7231 16.7282C16.0883 17.363 16.0883 18.3939 16.7231 19.0287C17.3579 19.6635 18.3888 19.6635 19.0236 19.0287L25.5239 12.5283V12.5233ZM8.1254 3.25016C9.02427 3.25016 9.75048 2.52395 9.75048 1.62508C9.75048 0.726207 9.02427 0 8.1254 0H4.87524C2.1837 0 0 2.1837 0 4.87524V17.8759C0 20.5674 2.1837 22.7511 4.87524 22.7511H8.1254C9.02427 22.7511 9.75048 22.0249 9.75048 21.126C9.75048 20.2272 9.02427 19.501 8.1254 19.501H4.87524C3.97637 19.501 3.25016 18.7747 3.25016 17.8759V4.87524C3.25016 3.97637 3.97637 3.25016 4.87524 3.25016H8.1254Z" fill="black" />
    </svg>);


const Sidebar = ({ sidebarOpen, setSidebarOpen }: Props) => {
    const router = useRouter();
    return (
        <>
            <div onClick={e => {
                setSidebarOpen(!sidebarOpen);
            }} className={`${sidebarOpen ? 'block' : 'hidden'} drop-shadow-lg fixed z-20 inset-0 bg-white opacity-50 transition-opacity lg:hidden`}></div>
            <div className={`${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'} flex flex-row justify-between z-30 px-8 pb-6 inset-y-0 left-0 right-0 w-full transition duration-300 transform bg-white overflow-y-auto lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex flex-row">
                    <div className="flex items-start">
                        <Image src={tp}>
                            
                        </Image>
                        {/* <div className="flex">
                            <h2 className="text-3xl mx-2 font-bold">Welcome,<br />Admin</h2>
                        </div> */}
                    </div>
                    <div className="flex flex-row h-full justify-between">
                        <nav className="flex flex-row gap-y-2.5">
                            <Link href="/Outlets">
                                {getLinkContent('Outlets', router.pathname == "/Outlets", 'outlet')}
                            </Link>
                            <Link href="/Users">
                                {getLinkContent('User Management', router.pathname == "/Users", 'user')}
                            </Link>
                            <Link href="/Reports">
                                {getLinkContent('Reports', router.pathname == "/Reports", 'report')}
                            </Link>
                            <Link href="/Credentials">
                                {getLinkContent('Credentials', router.pathname == "/Credentials", 'customer')}
                            </Link>
                            <Link href="/GeneralSettings">
                                {getLinkContent('General Setting', router.pathname == "/GeneralSettings", 'general_setting')}
                            </Link>
                        </nav>
                    </div>
                </div>
                <div className="flex flex-col justify-items-center gap-y-1">
                    <h2 className="flex justify-center gap-x-2">
                        <Icon rev={undefined} component={userIcon}></Icon>Burget King Holdings
                    </h2>
                    <div className="flex flex-items-center justify-center justify-items-center gap-x-2">
                        <span>
                            Terms of Service
                        </span>
                        <span className="flex justify-center gap-x-1">
                            <Icon rev={undefined} component={logOut}></Icon>Logout
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;