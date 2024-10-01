import {useRouter} from "next/router";
import Link from "next/link";
import {
    FiCreditCard,
    FiFileText,
    FiHash,
    FiHome, FiLogOut,
    FiUsers,
} from "react-fi";
import Image from "next/image";

export default function SideNav(props) {
    return (
        <div
            className="bg-white shadow-[rgba(0,0,0,0.05)_1px_0px_2px_0px] sticky top-0 flex md:flex-col shrink-0 justify-center overflow-scroll md:justify-start z-20 md:w-56"
        >
            <div className="text-accent h-6 m-4 mx-auto hidden md:flex">
                <Image
                    src="./images/katha_logo.png"
                    height={0}
                    width={0}
                    alt=""
                    className="h-7 w-7 my-auto"
                />
                <div className="ml-2 text-xl my-auto">Katha Ads</div>
            </div>
            <SideNavCard
                icon={<FiHome size="1.2rem"/>}
                name="Dashboard"
                link="/"
                isSideNavExpanded={props.settings.isSideNavExpanded}
            />
            <SideNavCard
                icon={<FiHash size="1.2rem"/>}
                name="Campaigns"
                link="/campaigns"
                isSideNavExpanded={props.settings.isSideNavExpanded}
            />
            {props.settings.isAdmin && <SideNavCard
                icon={<FiFileText size="1.2rem"/>}
                name="Invoices"
                link="/invoices"
                isSideNavExpanded={props.settings.isSideNavExpanded}
            />}
            {props.settings.isAdmin && <SideNavCard
                icon={<FiCreditCard size="1.2rem"/>}
                name="Payment Details"
                link="/payment-details"
                isSideNavExpanded={props.settings.isSideNavExpanded}
            />}
            <SideNavCard
                icon={<FiUsers size="1.2rem"/>}
                name="Organization"
                link="/organization"
                isSideNavExpanded={props.settings.isSideNavExpanded}
            />
            <div className="grow"></div>
            <SideNavCard
                icon={<FiLogOut size="1.2rem"/>}
                name="Logout"
                link="/logout"
            />
        </div>
    );
}

function SideNavCard(props) {
    const router = useRouter();
    return (
        <Link href={props.link} target={props.target}>
            <div
                className={
                    `flex items-center my-1 py-2 pl-4 hover:bg-lbr ${(router.pathname === props.link ? "text-accent" : "")} rounded mx-2 transition border-lbr pr-4 md:pr-0`
                }
            >
                <div className="md:hidden">{props.icon}</div>
                <span className="py-1 grow hidden md:inline">{props.name}</span>
                {router.pathname === props.link && (
                    <span className="w-fit h-6 bg-accent rounded-l hidden"></span>
                )}
            </div>
        </Link>
    );
}
