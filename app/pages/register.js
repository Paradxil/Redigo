import { Button, Center, FormControl, FormErrorMessage, Input, VStack } from "@chakra-ui/react";
import Logo from "../components/logo";

import Link from 'next/link';
import PasswordInput from "../components/passwordInput";
import EmailInput from "../components/emailInput";

import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useRouter } from 'next/router';


import REGISTER_QUERY from '../utils/queries/auth/register';

export default function Register() {
    const router = useRouter()

    const [register, { loading }] = useMutation(REGISTER_QUERY, {
        onCompleted: (data) => {
            if(data.createUser && data.createUser.id) {
                router.push('/login');
            }
        },
        onError: (error) => {
            if(error.message.match(/unique/i)) {
                setErrorMessage('A user with this username or email already exists.');
                return;
            }
            setErrorMessage('Unable to register user.');
        }
    });

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const submit = function () {
        setErrorMessage('');
        register({ variables: { username: username, password: password, email: email } });
    }
    return (
        <Center minH='100vh' w='full'>
            <VStack>
                <Logo />
                <Input size='lg' placeholder='username' onChange={e => setUsername(e.target.value)}></Input>
                <EmailInput size='lg' onChange={e => setEmail(e.target.value)} />
                <PasswordInput size='lg' onChange={e => setPassword(e.target.value)} />
                <FormControl isInvalid={errorMessage}>
                    <Button w='full' size='lg' onClick={submit}>Register</Button>
                    <FormErrorMessage>{errorMessage}</FormErrorMessage>
                </FormControl>
                <Link href='login'>
                    <Button variant='link'>login</Button>
                </Link>
            </VStack>
        </Center>
    )
}