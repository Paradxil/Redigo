import { Text, Heading, Box, Image, VStack, Button, Spinner, Center, HStack, Container, ButtonGroup, IconButton, Checkbox } from "@chakra-ui/react";
import Layout from "../components/layout";

import {
    FiPlus as AddProjectIcon,
    FiBookmark as ProjectIcon,
    FiEdit2 as EditIcon,
    FiDelete as DeleteIcon
} from "react-icons/fi";

import PROJECTS_QUERY from '../utils/queries/projects';
import CREATE_PROJECT_MUTATION from '../utils/queries/createProject';
import DElETE_PROJECT_MUTATION from '../utils/queries/deleteProject';

import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import client from "../utils/client";

export default function Dashboard(props) {
    const router = useRouter();

    const { loading, error, data } = useQuery(PROJECTS_QUERY, { fetchPolicy: 'cache-and-network' });
    const [createProject, { loading: loadingNewProject }] = useMutation(CREATE_PROJECT_MUTATION, {
        onCompleted: (d) => {
            console.log(d);
            router.push('/editor/' + d.createProject.id);
        }
    });

    const [deleteProject, { loading: deletingProject }] = useMutation(DElETE_PROJECT_MUTATION, {
        onCompleted: () => {
            client.refetchQueries({include: [PROJECTS_QUERY]});
        }
    });

    const newProject = () => {
        createProject({ variables: { username: props.user.username, name: 'New Project' } });
    }

    const ProjectCard = ({ name, image, id }) => {
        return (
            <HStack w='full' bg='white' padding={4} shadow='sm' rounded={8}>
                <Checkbox />
                {
                    image ?
                        <Image src={image}></Image>
                        :
                        ''
                }
                <Text flex={1}>{name}</Text>
                <ButtonGroup isAttached={true}>
                    <Link
                        href={`/editor/${id}`}
                    >
                        <IconButton icon={<EditIcon />} />
                    </Link>
                    <IconButton onClick={() => deleteProject({variables: {id: id}})} icon={<DeleteIcon />} />
                </ButtonGroup>
            </HStack>
        )
    }

    const Projects = () => {
        if (loading&&!data) {
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
            <Container maxW='container.lg'>
                <Button variant={'solid'} isLoading={loadingNewProject} colorScheme='blue' leftIcon={<AddProjectIcon />} onClick={newProject}>New Project</Button>
                <VStack wrap='wrap' marginTop={4}>
                    <Projects />
                </VStack>
            </Container>
        </Layout>
    )
}