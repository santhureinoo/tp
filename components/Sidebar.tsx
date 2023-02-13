import Link from "next/link";
import React from "react";
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faUserGroup, faBriefcase, faUser, faWallet, fas, fa2 } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";

interface Props {
    sidebarOpen: boolean;
    setSidebarOpen(sidebarOpen: boolean): void;
}


const getLinkContent = (label: string, isActive: boolean, imageFileName: string): JSX.Element => {
    return (
        <a className={isActive ? "link-active" : "link"}>
            <Image alt="selectSvg" src={`/asserts/sidebar/${imageFileName}${isActive ? '_select.svg' : '.svg'}`} width="25" height="25" />
            <span className="mx-3">{label}</span>
        </a>
    )
}


const Sidebar = ({ sidebarOpen, setSidebarOpen }: Props) => {
    const router = useRouter();
    return (
        <>
            <div onClick={e => {
                setSidebarOpen(!sidebarOpen);
            }} className={`${sidebarOpen ? 'block' : 'hidden'} drop-shadow-lg fixed z-20 inset-0 bg-white opacity-50 transition-opacity lg:hidden`}></div>
            <div className={`${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'} fixed flex flex-col z-30 inset-y-0 left-0 w-1/6 transition duration-300 transform bg-white overflow-y-auto lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-start pt-8 px-4">
                    <div className="flex">
                        <h2 className="text-3xl mx-2 font-bold">Welcome,<br />Admin</h2>
                    </div>
                </div>
                <div className="flex flex-col h-full justify-between">
                    <nav className="mt-10 flex flex-col gap-y-2.5 py-3 px-2.5">
                        <Link href="/Reports">
                            {getLinkContent('Reports', router.pathname == "/Reports", 'billing')}
                        </Link>
                        {/* <Link href="/">
                        {getLinkContent('Customer', router.pathname == "/", 'customer')}
                    </Link>
                    <Link href="/Outlets">
                        {getLinkContent('Outlet', router.pathname == "/Outlets", 'outlet')}
                    </Link>
                    <Link href="/Equipments">
                        {getLinkContent('Equipments', router.pathname == "/Equipments", 'equipment')}
                    </Link>
                    <Link href="/Users">
                        {getLinkContent('User', router.pathname == "/Users", 'user')}
                    </Link>*/}

                        {/* <Link href="/Billings">
                        {getLinkContent('Billing', router.pathname == "/Billings", 'billing')}
                    </Link> */}
                    </nav>
                    <nav className="mt-10 flex flex-col gap-y-2.5 py-3 px-2.5">
                        <Link href="/GeneralSettings">
                            {getLinkContent('General Setting', router.pathname == "/GeneralSettings", 'general_setting')}
                        </Link>
                    </nav>
                </div>

            </div>
        </>
    )
}

export default Sidebar;