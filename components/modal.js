import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "./button";

export default function Modal(props) {
  return (
    <Transition appear show as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={props.modalConfig.secondaryAction}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded bg-lbp dark:bg-dbp p-8 text-left align-middle shadow transition-all flex flex-col">
                <Dialog.Title className="text-xl md:text-2xl font-bold mb-2">
                  {props.modalConfig.title}
                </Dialog.Title>

                <div className="text-lts dark:text-dts">
                  {props.modalConfig.description}
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-lbr dark:border-dbr">
                  <span onClick={props.modalConfig.primaryAction}>
                    <Button text={props.modalConfig.primaryActionText} />
                  </span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
