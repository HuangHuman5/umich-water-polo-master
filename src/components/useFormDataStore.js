import { useState } from "react";

export default function useFormDataStore() {
    // eslint-disable-next-line
    const [store, setStore] = useState({})

    // We intentionally create and set soft copies because this is a store
    const createHandler = key => {
        let newStore = store
        if (!(key in store)) {
            newStore[key] = { value: undefined, isValid: false }
        }
        return {
            saveValue: value => {
                let newStore = store
                newStore[key].value = value
            },
            setIsValid: value => {
                let newStore = store
                newStore[key].isValid = value
            },
            storeValue: store[key]?.value
        }
    };
    
    return { store: store, createHandler };
}