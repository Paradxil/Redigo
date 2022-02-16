import { Text, Heading, Box, Image, HStack, Button, Spinner } from "@chakra-ui/react";
import Layout from "../components/layout";

import { FiPlus as AddProjectIcon } from "react-icons/fi";

import PROJECTS_QUERY from '../utils/queries/projects';
import { useQuery } from "@apollo/client";

export default function Dashboard() {
    const { loading, error, data } = useQuery(PROJECTS_QUERY);

    const ProjectCard = ({name, image}) => {
        return (
            <Box background={'white'} shadow='md' rounded={8} padding={4}>
                <Image src={image}></Image>
                <Text>{name}</Text>
            </Box>
        )
    }

    const Projects = () => {
        if(loading) {
            return (
                <Spinner/>
            )
        }

        return (
            data.projects.map(el => <ProjectCard name={el.name} image='' />)
        )
    }

    return (
        <Layout title='Dashboard'>
            <Button variant={'solid'} colorScheme='blue' leftIcon={<AddProjectIcon/>}>New Project</Button>
            <HStack wrap='wrap' marginTop={4}>
                <Projects/>
            </HStack>
        </Layout>
    )
}