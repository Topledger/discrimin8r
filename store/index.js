import { create } from 'zustand';

// Define the initial state and actions for your global store
// We'll start with a simple example. You'll add specific state slices here later.
const useStore = create((set) => ({
    // Example state: A counter
    count: 0,
    increaseCount: () => set((state) => ({ count: state.count + 1 })),

    // State for Instruction Name page
    instructionNameInput: "",
    setInstructionNameInput: (input) => set({ instructionNameInput: input }),
    instructionNameResult: null,
    setInstructionNameResult: (result) => set({ instructionNameResult: result }),

    // State for Instruction Discriminator page
    discriminatorInput: "",
    setDiscriminatorInput: (input) => set({ discriminatorInput: input }),
    discriminatorResult: null,
    setDiscriminatorResult: (result) => set({ discriminatorResult: result }),

    // State for Verify IDL page
    verifyIdlDappAddress: "",
    setVerifyIdlDappAddress: (address) => set({ verifyIdlDappAddress: address }),
    verifyIdlBlockSlot: "",
    setVerifyIdlBlockSlot: (slot) => set({ verifyIdlBlockSlot: slot }),
    verifyIdlFileContent: null,
    setVerifyIdlFileContent: (idl) => set({ verifyIdlFileContent: idl }),
    verifyIdlFileName: "",
    setVerifyIdlFileName: (name) => set({ verifyIdlFileName: name }),
    verifyIdlResult: null,
    setVerifyIdlResult: (result) => set({ verifyIdlResult: result }),

    // You will need to migrate other relevant state here as needed
    // e.g., modalConfig, dappDetailsInProgress, verified, form inputs etc.

    // Example state: User preferences (replace with actual state needed)
    // theme: 'light',
    // setTheme: (newTheme) => set({ theme: newTheme }),

    // Add other state variables and actions as needed for your application
    // Example:
    // formInputValues: {},
    // setFormInputValue: (formId, inputName, value) => set((state) => ({
    //   formInputValues: {
    //     ...state.formInputValues,
    //     [formId]: {
    //       ...(state.formInputValues[formId] || {}),
    //       [inputName]: value,
    //     },
    //   },
    // })),
}));

export default useStore; 