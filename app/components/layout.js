import { Box, Heading, HStack, IconButton, VStack } from "@chakra-ui/react";
import { FiLogOut as LogOutIcon, FiUser as UserIcon } from 'react-icons/fi';

import Head from 'next/head';

export default function Layout({ children, title }) {
    return (
        <>
            <Head>
                <title>{title} | Redigo</title>
            </Head>
            <Box w='full' minH='100vh' background='gray.100'>
                <HStack padding={4} background='white' boxShadow='sm'>
                    <Heading as='h1' size='lg' flex={1}>{title}</Heading>
                    <IconButton icon={<UserIcon />}></IconButton>
                </HStack>
                <Box>
                    {children}
                </Box>
            </Box>
        </>
    )
}