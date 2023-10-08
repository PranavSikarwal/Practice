import React from "react";
import Input from "../../shared/components/FormElements/Input";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/FormHook";

const Auth = (props) => {
    const [formState, inputHandler] = useForm(
        {
            email: {
                value: "",
                isValid: false,
            },
            password: {
                value: "",
                isValid: false,
            },
        },
        false
    );
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                console.log(formState);
            }}
        >
            <Input
                id="email"
                element="input"
                type="text"
                placeholder="Email"
                label="E-Mail"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Must Enter Email to perform Login..."
                onInput={inputHandler}
                value={formState.inputs.email.value}
            />
            <Input
                id="password"
                element="input"
                type="password"
                placeholder="Password"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Minimum 5 characters required."
                onInput={inputHandler}
                value={formState.inputs.password.value}
            />
            <button type="submit" disabled={!formState.isValid}>LOGIN</button>
        </form>
    );
};

export default Auth;
