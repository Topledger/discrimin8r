import Image from "next/image";
import {Listbox, Transition} from "@headlessui/react";
import {Fragment} from "react";
import {FiCheck, FiChevronDown, FiLogIn} from "react-fi";

export default function Header(props) {
    return (
        <div className="sticky top-0 bg-lbp dark:bg-dbp shadow-sm z-20 text-base flex items-center pr-4 md:hidden">
            <span className="grow"></span>
            <span className="text-accent h-6 m-4 text-xl flex">
                <Image
                    src="./images/katha_logo.png"
                    height={0}
                    width={0}
                    alt=""
                    className="h-7 w-7 my-auto"
                />
                <div className="ml-2">Katha Ads</div>
            </span>
            <span className="grow"></span>
            {/*{!props.user && (*/}
            {/*    <div*/}
            {/*        className="flex items-center cursor-pointer hover:text-accent transition"*/}
            {/*        onClick={props.signIn}*/}
            {/*    >*/}
            {/*        <FiLogIn/>*/}
            {/*        <span className="ml-2">Sign In</span>*/}
            {/*    </div>*/}
            {/*)}*/}
            {/*{props.user &&*/}
            {/*    (!props.user.isAccManager ? (*/}
            {/*        <div className="flex items-center">*/}
            {/*            <div className="relative h-8 w-8 mr-4 md:mr-2 rounded-full overflow-hidden">*/}
            {/*                {!!props.user.photoURL && <Image*/}
            {/*                    alt=""*/}
            {/*                    src={props.user.photoURL}*/}
            {/*                    referrerPolicy="no-referrer"*/}
            {/*                    fill*/}
            {/*                    className="object-cover object-center"*/}
            {/*                />}*/}
            {/*            </div>*/}
            {/*            <span*/}
            {/*                className="cursor-pointer text-sm text-danger hover:opacity-80 transition"*/}
            {/*                title="Sign Out"*/}
            {/*                onClick={props.signOut}*/}
            {/*            >*/}
            {/*  Logout*/}
            {/*</span>*/}
            {/*        </div>*/}
            {/*    ) : (*/}
            {/*        <div className="flex items-center">*/}
            {/*<span className="hidden md:flex flex-col mr-4 text-right">*/}
            {/*  <span className="text-xs text-lts dark:text-dts">*/}
            {/*    Logged in as*/}
            {/*  </span>*/}
            {/*  <span className="text-xs text-accent">Account Manager</span>*/}
            {/*</span>*/}
            {/*            <span className="mr-4 md:mr-8">*/}
            {/*  <Listbox*/}
            {/*      value={props.user.authKey}*/}
            {/*  >*/}
            {/*    <div className="relative w-36 md:w-48">*/}
            {/*      <Listbox.Button*/}
            {/*          className="relative w-full cursor-pointer rounded bg-lbt dark:bg-dbt py-2 px-4 text-sm flex items-center">*/}
            {/*        <div className="text-left whitespace-nowrap overflow-hidden text-ellipsis grow">*/}
            {/*          {props.user.activeClientName}*/}
            {/*        </div>*/}
            {/*        <span className="text-accent ml-2">*/}
            {/*          <FiChevronDown/>*/}
            {/*        </span>*/}
            {/*      </Listbox.Button>*/}
            {/*      <Transition*/}
            {/*          as={Fragment}*/}
            {/*          leave="transition ease-in duration-100"*/}
            {/*          leaveFrom="opacity-100"*/}
            {/*          leaveTo="opacity-0"*/}
            {/*      >*/}
            {/*        <Listbox.Options className="absolute mt-1 w-full rounded bg-lbt dark:bg-dbt py-2 shadow-sm text-sm">*/}
            {/*          {props.user.clients.map((client, clientIndex) => (*/}
            {/*              <Listbox.Option*/}
            {/*                  key={clientIndex}*/}
            {/*                  className={({active}) =>*/}
            {/*                      `select-none p-2 cursor-pointer transition ${*/}
            {/*                          active ? "bg-lbp dark:bg-dbp" : ""*/}
            {/*                      }`*/}
            {/*                  }*/}
            {/*                  value={client.auth_key}*/}
            {/*              >*/}
            {/*                  {({selected}) => (*/}
            {/*                      <div className="flex items-center">*/}
            {/*                          <div*/}
            {/*                              className={*/}
            {/*                                  "mr-2 " +*/}
            {/*                                  (selected*/}
            {/*                                      ? "text-accent"*/}
            {/*                                      : "text-transparent")*/}
            {/*                              }*/}
            {/*                          >*/}
            {/*                              <FiCheck/>*/}
            {/*                          </div>*/}
            {/*                          <div className="whitespace-nowrap overflow-hidden text-ellipsis">*/}
            {/*                              {client.name}*/}
            {/*                          </div>*/}
            {/*                      </div>*/}
            {/*                  )}*/}
            {/*              </Listbox.Option>*/}
            {/*          ))}*/}
            {/*        </Listbox.Options>*/}
            {/*      </Transition>*/}
            {/*    </div>*/}
            {/*  </Listbox>*/}
            {/*</span>*/}
            {/*            <span*/}
            {/*                className="cursor-pointer hover:text-accent transition"*/}
            {/*                title="Sign Out"*/}
            {/*                onClick={props.signOut}*/}
            {/*            >*/}
            {/*  Logout*/}
            {/*</span>*/}
            {/*        </div>*/}
            {/*    ))}*/}
        </div>
    );
}
