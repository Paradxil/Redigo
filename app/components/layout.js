import { Box, Heading, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, VStack } from "@chakra-ui/react";
import { FiLogOut as LogOutIcon, FiUser as UserIcon, FiSettings as SettingsIcon, FiChevronLeft as BackIcon } from 'react-icons/fi';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";

import LOGOUT_MUTATION from '../utils/queries/logout'
import client from "../utils/client";

export default function Layout({ children, title, subtitle, back }) {
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
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
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
                    <HStack flex={1} alignItems='baseline'>
                        <Heading as='h1' size='lg'>{title}</Heading>
                        <Heading as='h2' size='md' color='gray.500' padding={1}>{subtitle}</Heading>
                    </HStack>
                    <UserMenu />
                </HStack>
                <Box padding={{base: 1, lg: 4}} py={4} w='full'>
                    {children}
                </Box>
            </Box>
        </>
    )
}