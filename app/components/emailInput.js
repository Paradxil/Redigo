import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useState } from "react";

export default function EmailInput(props) {
    const [edited, setEdited] = useState(false);

    const [input, setInput] = useState('');
    const handleInputChange = (e) => { setInput(e.target.value); setEdited(true); props.onChange ? props.onChange(e) : '';};

    const emailRegex = /^.+@.+\..+$/i;
    const valid = input.match(emailRegex);

    return (
        <FormControl isInvalid={!valid&&edited}>
            <Input
                {...props}
                type={'email'}
                placeholder='email'
                onChange={handleInputChange}
            />
            <FormErrorMessage>Invalid email.</FormErrorMessage>
        </FormControl>
    )
}