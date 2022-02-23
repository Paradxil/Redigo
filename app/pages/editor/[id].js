import {
    Input,
    Box,
    HStack,
    Stack,
    Button,
    IconButton,
    VStack,
    Container,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverBody,
    PopoverContent,
    Text,
    PopoverArrow
} from "@chakra-ui/react";

import {
    FiCheck as SaveIcon,
    FiPlus as AddIcon,
    FiImage as ImageIcon,
    FiVideo as VideoIcon,
    FiBox as BackgroundIcon
} from "react-icons/fi";

import Layout from "../../components/layout";

import { useEffect, useRef, useState } from "react";

import GET_PROJECT_QUERY from '../../utils/queries/project';
import UPDATE_NAME_MUTATION from '../../utils/queries/updateProjectName';
import CREATE_TRACK_ITEM_MUTATION from '../../utils/queries/createTrackItem';

import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import MediaSelect from "../../components/mediaSelect";
import Animator, { useAnimator } from "../../components/animator";
import Track, { useTrack } from "../../components/track";
import { TrackItem } from "../../../animator/src/animator";


export default function Editor({ user }) {
    const router = useRouter();
    const { id: projectid } = router.query;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [uploading, setUploading] = useState(false);

    const {
        animator,
        play,
        pause,
        setTrackItem,
        setInitialTrackItems,
        initAnimator,
        trackItems
    } = useAnimator();

    const {
        track,
        setInitialTrack,
        pushTrackItem,
        reorderTrackItems,
        loading: updatingTrack
    } = useTrack('videoTrack', projectid, animator)

    const { loading, data } = useQuery(GET_PROJECT_QUERY, {
        variables: { id: projectid },
        fetchPolicy: 'network-only',
        onCompleted: (d) => {
            setInitialTrackItems(d.project.trackItems);
            setInitialTrack(d.project.track);
        }
    });

    const [updateName, { loading: loadingName }] = useMutation(UPDATE_NAME_MUTATION);
    const [createTrackItem, { loading: creatingItem }] = useMutation(CREATE_TRACK_ITEM_MUTATION);

    const setName = (e) => {
        updateName({ variables: { id: projectid, name: e.target.value } });
    }

    const selectFile = (file, upload) => {
        if (upload) {
            return
        }
        addTrackItem(file);
    }

    const updateTrackItem = (file) => {
        addTrackItem(file);
        setUploading(false);
    }

    const addTrackItem = (file) => {
        // Parse the type
        let type = file.type.split('/');

        createTrackItem({
            variables: {
                projectid: projectid,
                name: file.file.filename,
                file: file.id,
                type: type,
                duration: 5000
            },
            onCompleted: (d) => {
                let itemData = d.createTrackItem;
                let item = new TrackItem(itemData.id, itemData.name, type, itemData.data, itemData.duration, itemData.file.file.url);
                setTrackItem(item);
                pushTrackItem(item.id);
            }
        });
    }

    const isLoading = () => {
        return loading
            || loadingName
            || uploading
            || creatingItem
            || updatingTrack;
    }

    return (
        <Layout title='Editor' subtitle='New Project' back='/dashboard'>
            <Container maxW='container.xl'>
                <HStack bg='white' p={4} rounded={8} marginBottom={4}>
                    <Input size='lg' placeholder='name' defaultValue={data?.project.name} onChange={setName}></Input>
                    <Button size='lg'>Export</Button>
                    <Popover
                        placement='bottom-end'
                    >
                        <PopoverTrigger>
                            <IconButton isLoading={isLoading()} icon={<SaveIcon />} size='lg' variant='ghost' />
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow/>
                            <PopoverBody>
                                {
                                    isLoading()
                                        ? <Text>Saving changes.</Text>
                                        : <Text>Changes saved!</Text>
                                }
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </HStack>
                <Stack w='full' direction={{ base: 'column', md: 'row' }}>
                    <Animator initAnimator={initAnimator} play={play} pause={pause} />
                    <Box p={4} flex='1'>
                        <Menu>
                            <MenuButton as={Button} marginBottom={2} leftIcon={<AddIcon />} disabled={loading}>Add Media</MenuButton>
                            <MenuList>
                                <MenuItem onClick={onOpen} icon={<VideoIcon />}>Video</MenuItem>
                                <MenuItem onClick={onOpen} icon={<ImageIcon />}>Image</MenuItem>
                                <MenuItem icon={<BackgroundIcon />}>Solid Color</MenuItem>
                            </MenuList>
                            <MediaSelect
                                isOpen={isOpen}
                                onClose={onClose}
                                username={user.username}
                                onFileSelect={selectFile}
                                onUploadStarted={() => setUploading(true)}
                                onUploadCompleted={updateTrackItem}
                            />
                        </Menu>
                        <Track track={track} trackItems={trackItems} reorderTrackItems={reorderTrackItems} />
                    </Box>
                </Stack>
            </Container>
        </Layout>
    )
}