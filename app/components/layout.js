import { Box, Heading, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, VStack } from "@chakra-ui/react";
import { FiLogOut as LogOutIcon, FiUser as UserIcon, FiSettings as SettingsIcon, FiChevronLeft as BackIcon } from 'react-icons/fi';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";

import LOGOUT_MUTATION from '../utils/queries/logout'
import client from "../utils/client";

export default function Layout({ children, title, back }) {
    const router = useRouter();

    const [logout] = useMutation(LOGOUT_MUTATION, {
        onCompleted: async (data) => {
            if (data.endSession) {
                await client.clearStore();
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
                    <MenuItem icon={<LogOutIcon />} onClick={logout}>
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
                    {
                        back ?
                            <Link href={back}>
                                <IconButton variant='ghost' icon={<BackIcon />} />
                            </Link>
                            : ''
                    }
                    <Heading as='h1' size='lg' flex={1}>{title}</Heading>
                    <UserMenu />
                </HStack>
                <Box padding={4}>
                    {children}
                </Box>
            </Box>
        </>
    )
}