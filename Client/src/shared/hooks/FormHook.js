import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
    switch (action.type) {
        case "INPUT_CHANGE":
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: { value: action.value, isValid: action.isValid },
                },
                isValid: formIsValid,
            };
    
        case "SET_FORM":
            return {inputs: action.inputs, isValid: action.isValid};
        default:
            return state;
    }
};

export const useForm = (input, formValidity) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: input,
        isValid: formValidity
    });
    
    //this function must be inside useCallback as it is dependency of useEffect in Input element
    //So whenever NewPlace re renders new copy of below function is created
    //which triggers useEffect and hence trigger inputHandler again and loop runs again and again
    const inputHandler = useCallback((id, val, isValid) => {
        dispatch({
          type: "INPUT_CHANGE",
          value: val,
          isValid: isValid,
          inputId: id
        })
    }, []);
    //[] specifies under no dependency the above callBack should be recreated

    const setFormData = useCallback((input,formValidity)=>{
        dispatch({
            type:"SET_FORM",
            inputs: input,
            isValid: formValidity
        });
    },[])

    return [formState,inputHandler,setFormData];
};
