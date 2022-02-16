import { Button, Center, FormControl, FormErrorMessage, Input, VStack } from "@chakra-ui/react";
import { FiLoader as LoadingIcon } from "react-icons/fi";
import Logo from "../components/logo";

import Link from 'next/link';
import PasswordInput from "../components/passwordInput";
import { useMutation } from "@apollo/client";

import LOGIN_QUERY from '../utils/queries/login';
import { useState } from "react";

export default function Login() {
    const [login, { loading, error, data }] = useMutation(LOGIN_QUERY);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = function () {
        login({ variables: { username: username, password: password } });
    }

    return (
        <Center minH='100vh' w='full'>
            <VStack>
                <Logo />
                <Input size='lg' placeholder='username' onChange={(e) => setUsername(e.target.value)}></Input>
                <PasswordInput size='lg' onChange={(e) => setPassword(e.target.value)} />
                <FormControl isInvalid={error||data.message}>
                    <Button w='full' size='lg' onClick={submit} isLoading={loading}>Login</Button>
                    <FormErrorMessage>{data.authenticateUserWithPassword.message||error}</FormErrorMessage>
                </FormControl>
                <Link href='register'>
                    <Button variant='link'>register</Button>
                </Link>
            </VStack>
        </Center>
    )
}