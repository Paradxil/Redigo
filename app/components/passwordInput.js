import React, {useState} from 'react'
import { InputGroup, Input, InputRightElement, IconButton, FormControl, FormErrorMessage } from '@chakra-ui/react'
import { FiEye as ShowIcon } from 'react-icons/fi'

export default function PasswordInput(props) {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    const [edited, setEdited] = useState(false);

    const [input, setInput] = useState('');
    const handleInputChange = (e) => { setInput(e.target.value); setEdited(true); props.onChange?props.onChange(e):''; };

    const valid = input.length > 8;

    return (
        <FormControl isInvalid={!valid&&edited}>
            <InputGroup {...props}>
                <Input
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='Enter password'
                    onChange={handleInputChange}
                />
                <InputRightElement width='4.5rem'>
                    <IconButton h='1.75rem' size='sm' icon={<ShowIcon />} onClick={handleClick}>
                        {show ? 'Hide' : 'Show'}
                    </IconButton>
                </InputRightElement>
            </InputGroup>
            <FormErrorMessage>Password must be 8 characters long.</FormErrorMessage>
        </FormControl>
    )
}