import { Text, Heading, Box, Image, HStack, Button, Spinner } from "@chakra-ui/react";
import Layout from "../components/layout";

import { FiPlus as AddProjectIcon } from "react-icons/fi";

import PROJECTS_QUERY from '../utils/queries/projects';
import CREATE_PROJECT_MUTATION from '../utils/queries/createProject';

import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Dashboard(props) {
    const router = useRouter();

    const { loading, error, data } = useQuery(PROJECTS_QUERY, {fetchPolicy: 'cache-and-network'});
    const [createProject, { loading: loadingNewProject }] = useMutation(CREATE_PROJECT_MUTATION, {
        onCompleted: (d) => {
            console.log(d);
            router.push('/editor/' + d.createProject.id);
        }
    });

    const newProject = () => {
        createProject({ variables: { username: props.user.username, name: 'New Project' } });
    }

    const ProjectCard = ({ name, image, id }) => {
        return (
            <Link
                href={`/editor/${id}`}
            >
                <Box background={'white'} shadow='md' rounded={8} padding={4} cursor='pointer'>
                    <Image src={image}></Image>
                    <Text>{name}</Text>
                </Box>
            </Link>
        )
    }

    const Projects = () => {
        if (loading) {
            return (
                <Spinner />
            )
        }

        return (
            data.projects.map(el => <ProjectCard key={el.id} id={el.id} name={el.name} image='' />)
        )
    }

    return (
        <Layout title='Dashboard' subtitle={props.user.username}>
            <Button variant={'solid'} isLoading={loadingNewProject} colorScheme='blue' leftIcon={<AddProjectIcon />} onClick={newProject}>New Project</Button>
            <HStack wrap='wrap' marginTop={4}>
                <Projects />
            </HStack>
        </Layout>
    )
}