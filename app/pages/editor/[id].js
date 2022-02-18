import {
    Input,
    Box,
    HStack,
    Stack,
    Button,
    IconButton,
    VStack,
    ButtonGroup,
    Container,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Editable,
    EditablePreview,
    EditableInput
} from "@chakra-ui/react";

import {
    FiCheck as SaveIcon,
    FiSmartphone as PhoneIcon,
    FiInstagram as InstagramIcon,
    FiYoutube as YoutubeIcon,
    FiPlay as PlayIcon,
    FiPause as PauseIcon,
    FiPlus as AddIcon,
    FiImage as ImageIcon,
    FiVideo as VideoIcon,
    FiBox as BackgroundIcon,
    FiMove as DragIcon,
    FiEdit2 as EditIcon
} from "react-icons/fi";

import Layout from "../../components/layout";

import {
    closestCenter,
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensors,
    useSensor
} from '@dnd-kit/core'

import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import createAnimator, { TrackItem } from 'animator';
import { useEffect, useRef, useState } from "react";

import GET_PROJECT_QUERY from '../../utils/queries/project';
import UPDATE_NAME_MUTATION from '../../utils/queries/updateProjectName';
import CREATE_TRACK_ITEM_MUTATION from '../../utils/queries/createTrackItem';
import UPDATE_PROJECT_TRACK_MUTATION from '../../utils/queries/updateProjectTrack';

import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import MediaSelect from "../../components/mediaSelect";

function useAnimator(canvas, objWrapper) {
    const [animator] = useState(createAnimator());
    const [trackItems, setTrackItems] = useState({});

    useEffect(() => {
        animator.init(canvas.current, objWrapper.current);
    }, []);

    const setTrackItem = (item) => {
        trackItems[item.id] = item;
        setTrackItems({ ...trackItems });
        animator.setTrackItem(item);
    }

    const setInitialTrackItems = (items) => {
        for(let data of items||[]) {
            //id, name, type, data, duration, file
            let item = new TrackItem(data.id, data.name, data.type, data.data, data.duration, data.file.file.url);
            setTrackItem(item);
        }
    }

    const getTrackItem = (id) => {
        animator.getTrackItem(id);
    }

    const play = () => {
        animator.play();
    }

    const pause = () => {
        animator.pause();
    }

    const useTrack = (name, projectid) => {
        const [updateTrack, { loading }] = useMutation(UPDATE_PROJECT_TRACK_MUTATION);
        const [track, setTrack] = useState([]);

        useEffect(() => {
            animator.setTrack(name, track);
        }, []);

        const sendTrackUpdates = (t) => {
            updateTrack({ variables: { id: projectid, track: t } });
        }

        const setInitialTrack = (t) => {
            setTrack([...(t||[])]);
            animator.setTrack(name, t||[]);
            animator.update();
        }

        const pushTrackItem = (id) => {
            track.push(id);
            setTrack([...track]);
            animator.setTrack(name, track);
            animator.update();
            sendTrackUpdates(track);
        }

        const reorderTrackItems = (id1, id2) => {
            let oldIndex = track.findIndex(id => id === id1);
            let newIndex = track.findIndex(id => id === id2);

            let tmpTrack = arrayMove(track, oldIndex, newIndex);
            setTrack([...tmpTrack]);
            animator.setTrack(name, tmpTrack);
            animator.update();
            sendTrackUpdates(tmpTrack);
        }

        return {
            setInitialTrack,
            reorderTrackItems,
            pushTrackItem,
            track,
            loading,
            play,
            pause
        }
    }

    return {
        setTrackItem,
        setInitialTrackItems,
        getTrackItem,
        trackItems,
        useTrack,
    }
}

export default function Editor({ user }) {
    const router = useRouter();
    const { id: projectid } = router.query;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [uploading, setUploading] = useState(false);

    const canvasRef = useRef(null);
    const objWrapperRef = useRef(null);
    const videoInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const {
        setTrackItem,
        setInitialTrackItems,
        trackItems,
        useTrack,
        play,
        pause
    } = useAnimator(canvasRef, objWrapperRef);

    const {
        track: videoTrack,
        setInitialTrack,
        pushTrackItem,
        reorderTrackItems,
        loading: loadingTrack
    } = useTrack('video', projectid);

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

    const handleFileUpload = (event, type = 'video') => {
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0];
            var src = URL.createObjectURL(file);

            //pushVideoAnimation(type, file.name, { src: src }, 5000)
        }
    }

    const selectFile = (file, upload, type = 'video') => {
        if (upload) {
            return
        }

        createTrackItem({
            variables: {
                projectid: projectid,
                name: file.file.filename,
                file: file.id,
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

    const updateTrackItem = (file, type = 'video') => {
        createTrackItem({
            variables: {
                projectid: projectid,
                name: file.file.filename,
                file: file.id,
                duration: 5000
            },
            onCompleted: (d) => {
                let itemData = d.createTrackItem;
                let item = new TrackItem(itemData.id, itemData.name, type, itemData.data, itemData.duration, itemData.file.file.url);
                setTrackItem(item);
                pushTrackItem(item.id);
            }
        });
        setUploading(false);
    }

    const VideoTrackItem = ({ name, id }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
        } = useSortable({ id: id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <HStack
                w='full'
                bg='white'
                rounded={8}
                shadow='sm'
                ref={setNodeRef}
                {...attributes}
                style={style}
                id={id}
                p={2}
            >
                <IconButton variant='ghost' {...listeners} icon={<DragIcon />} />
                <Editable flex={1} defaultValue={name} overflow='hidden'>
                    <EditablePreview />
                    <EditableInput padding={2} />
                </Editable>
                <ButtonGroup>
                    <IconButton variant='ghost' icon={<EditIcon />} />
                </ButtonGroup>
            </HStack>
        )
    }

    const VideoTrack = () => {
        const sensors = useSensors(
            useSensor(MouseSensor, {
                // Require the mouse to move by 10 pixels before activating
                activationConstraint: {
                    distance: 10,
                },
            }),
            useSensor(TouchSensor, {
                // Press delay of 250ms, with tolerance of 5px of movement
                activationConstraint: {
                    tolerance: 5,
                },
            })
        );

        function handleDragEnd(event) {
            const { active, over } = event;

            if (active.id !== over.id) {
                reorderTrackItems(active.id, over.id);
            }
        }

        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={videoTrack.map(id => id)}
                    strategy={verticalListSortingStrategy}
                >
                    {videoTrack.map(id => {
                        let item = trackItems[id];
                        return <VideoTrackItem key={item.id} id={item.id} name={item.name} />
                    })}
                </SortableContext>
            </DndContext>
        )
    }

    return (
        <Layout title='Editor' subtitle='New Project' back='/dashboard'>
            <Container maxW='container.xl'>
                <HStack bg='white' p={4} rounded={8} marginBottom={4}>
                    <Input size='lg' placeholder='name' defaultValue={data?.project.name} onChange={setName}></Input>
                    <Button size='lg'>Export</Button>
                    <IconButton isLoading={loading || loadingName || uploading || creatingItem || loadingTrack} icon={<SaveIcon />} size='lg' variant='ghost' />
                </HStack>
                <Stack w='full' direction={{ base: 'column', md: 'row' }}>
                    <VStack bg='white' p={4} rounded={8} flex='1'>
                        <div id='wrapper' ref={objWrapperRef}>
                            <canvas width='400px' height='400px' id='canvas' ref={canvasRef}></canvas>
                        </div>
                        <HStack>
                            <ButtonGroup isAttached>
                                <IconButton icon={<PlayIcon />} onClick={play} />
                                <IconButton icon={<PauseIcon />} onClick={pause} />
                            </ButtonGroup>
                            <ButtonGroup isAttached>
                                <IconButton icon={<PhoneIcon />} />
                                <IconButton icon={<InstagramIcon />} />
                                <IconButton icon={<YoutubeIcon />} />
                            </ButtonGroup>
                        </HStack>
                    </VStack>
                    <Box p={4} flex='1'>
                        <Menu>
                            <MenuButton as={Button} leftIcon={<AddIcon />} disabled={loading}>Add Media</MenuButton>
                            <MenuList>
                                <MenuItem onClick={onOpen} icon={<VideoIcon />}>Video</MenuItem>
                                <MenuItem onClick={() => imageInputRef.current.click()} icon={<ImageIcon />}>Image</MenuItem>
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
                        <Input type='file' ref={videoInputRef} id='video-input' hidden onChange={handleFileUpload} accept="video/*" />
                        <Input type='file' ref={imageInputRef} id='image-input' hidden onChange={e => handleFileUpload(e, 'image')} accept="image/*" />
                        <VStack w='full' marginTop={4}>
                            <VideoTrack />
                        </VStack>
                    </Box>
                </Stack>
            </Container>
        </Layout>
    )
}