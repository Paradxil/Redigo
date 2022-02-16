import { Box, Heading, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, VStack } from "@chakra-ui/react";
import { FiLogOut as LogOutIcon, FiUser as UserIcon, FiSettings as SettingsIcon } from 'react-icons/fi';

import Head from 'next/head';
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";

import LOGOUT_MUTATION from '../utils/queries/logout'

export default function Layout({ children, title }) {
    const router = useRouter();

    const [logout] = useMutation(LOGOUT_MUTATION, {
        onCompleted: (data) => {
            if(data.endSession) {
                router.push('/login');
            }
        }
    });

    const UserMenu = () => {
        return (
            <Menu>
                <MenuButton
                    as={IconButton}
                    icon={<UserIcon />}
                />
                <MenuList>
                    <MenuItem icon={<SettingsIcon />}>
                        Settings
                    </MenuItem>
                    <MenuItem icon={<LogOutIcon/>} onClick={logout}>
                        Logout
                    </MenuItem>
                </MenuList>
            </Menu>
        )
    }

    return (
        <>
            <Head>
                <title>{title} | Redigo</title>
            </Head>
            <Box w='full' minH='100vh' background='gray.100'>
                <HStack padding={4} background='white' boxShadow='sm'>
                    <Heading as='h1' size='lg' flex={1}>{title}</Heading>
                    <UserMenu />
                </HStack>
                <Box>
                    {children}
                </Box>
            </Box>
        </>
    )
}