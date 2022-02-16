import { Input, Box } from "@chakra-ui/react";
import Layout from "../components/layout";

export default function Editor() {
    return (
        <Layout title='Editor' back='/dashboard'>
            <Box background='white' padding={4} rounded={8}>
                <Input size='lg' placeholder='name'></Input>
            </Box>
        </Layout>
    )
}