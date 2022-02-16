import { useQuery } from '@apollo/client'
import { Center, Spinner } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import GET_USER from '../utils/queries/user'

export default function Home() {
    const router = useRouter();

    const {} = useQuery(GET_USER, {
        onCompleted: (data) => {
            if(data.user) {
                router.push('/dashboard');
                return
            }

            router.push('/login');
        }
    });

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
