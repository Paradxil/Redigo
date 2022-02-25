import { Button, Center, FormControl, FormErrorMessage, Input, VStack } from "@chakra-ui/react";
import Logo from "../components/logo";

import Link from 'next/link';
import PasswordInput from "../components/passwordInput";
import { useMutation } from "@apollo/client";

import LOGIN_QUERY from '../utils/queries/auth/login';
import { useState } from "react";

import { useRouter } from 'next/router';
import client from "../utils/client";

export default function Login() {
    const router = useRouter()

    const [login, { loading }] = useMutation(LOGIN_QUERY, {
        onCompleted: (data) => {
            if(!data.loginResult) {
                setErrorMessage('Error logging in.')
                return true
            }

            if(data.loginResult.message) {
                setErrorMessage(data.loginResult.message);
                return true
            }

            client.resetStore();
            document.cookie = "keystonejs-session=" + data.loginResult.sessionToken + ";";
            router.push('/dashboard');
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    });

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const submit = function () {
        setErrorMessage('');
        login({ variables: { username: username, password: password } });
    }

    return (
        <Center minH='100vh' w='full'>
            <VStack>
                <Logo />
                <Input size='lg' placeholder='username' onChange={(e) => setUsername(e.target.value)}></Input>
                <PasswordInput size='lg' onChange={(e) => setPassword(e.target.value)} />
                <FormControl isInvalid={errorMessage}>
                    <Button w='full' size='lg' onClick={submit} isLoading={loading}>Login</Button>
                    <FormErrorMessage>{errorMessage}</FormErrorMessage>
                </FormControl>
                <Link href='register'>
                    <Button variant='link'>register</Button>
                </Link>
            </VStack>
        </Center>
    )
}