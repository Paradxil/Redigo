import { Button, Center, Input, VStack } from "@chakra-ui/react";
import Logo from "../components/logo";

import Link from 'next/link';
import PasswordInput from "../components/passwordInput";
import EmailInput from "../components/emailInput";

export default function Register() {
    return (
        <Center minH='100vh' w='full'>
            <VStack>
                <Logo />
                <Input size='lg' placeholder='username'></Input>
                <EmailInput size='lg' />
                <PasswordInput size='lg' />
                <Button w='full' size='lg'>Register</Button>
                <Link href='login'>
                    <Button variant='link'>login</Button>
                </Link>
            </VStack>
        </Center>
    )
}