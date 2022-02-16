import '../styles/globals.css'

import { ChakraProvider, Spinner, Center } from '@chakra-ui/react'
import { ApolloProvider, useQuery } from '@apollo/client'
import client from '../utils/client';
import { useState } from 'react';

import GET_USER from '../utils/queries/user'
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const { loading } = useQuery(GET_USER, {
        onCompleted: (data) => {
            if (data.user) {
                setUser(data.user);
                if (router.pathname === '/' || router.pathname === '') {
                    router.push('/dashboard');
                }
                return
            }

            if(!isAllowed()) {
                router.push('/login');
            }
        },
        client: client
    });

    const isAllowed = () => {
        if (user == null) {
            if (['/login', '/register'].includes(router.pathname)) {
                return true;
            }
        }

        return user != null
    }

    const DisplayPage = () => {
        // Show loading icon while redirecting
        // if not allowed to visit a page.
        if(loading || !isAllowed()) {
            return (
                <Center minH='100vh'>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Center>
            )
        }

        return (
            <Component {...pageProps} loggedIn={user != null} user={user} />
        )
    }

    return (
        <ChakraProvider>
            <ApolloProvider client={client}>
                <DisplayPage/>
            </ApolloProvider>
        </ChakraProvider>
    )
}

export default MyApp
