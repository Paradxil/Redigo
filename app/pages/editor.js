import {
    Input,
    Box,
    Flex,
    HStack,
    Stack,
    Spacer,
    Button,
    IconButton,
    Center,
    VStack,
    ButtonGroup,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Container,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text
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
    FiMove as DragIcon
} from "react-icons/fi";

import Layout from "../components/layout";

import {
    closestCenter,
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensors,
    useSensor
} from '@dnd-kit/core'

import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import Animator, { Track } from 'animator';
import { useEffect, useRef, useState } from "react";

function useTrack(name) {
    const [animations, setAnimations] = useState([]);

    useEffect(() => {
        Animator.addTrack(name, new Track());
    }, [])

    const pushAnimation = (type, n, obj, duration) => {
        Animator.getTrack(name).pushAnimation(type, n, obj, duration);
        setAnimations([...Animator.getTrack(name).getAnimations()]);
        Animator.update();
    }

    return [
        animations,
        pushAnimation
    ]
}

export default function Editor() {
    const canvasRef = useRef(null);
    const objWrapperRef = useRef(null);
    const videoInputRef = useRef(null);

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
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const [videoAnimations, pushVideoAnimation] = useTrack('video');

    useEffect(() => {
        Animator.init(canvasRef.current, objWrapperRef.current);
    }, []);

    const handleFileUpload = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0];
            var src = URL.createObjectURL(file);

            pushVideoAnimation('video', file.name, { src: src }, 20000)
        }
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
            >
                <IconButton variant='ghost' {...listeners} icon={<DragIcon/>}/>
                <Text>{name}</Text>
            </HStack>
        )
    }

    const VideoTrack = () => {
        return (
            <SortableContext
                items={videoAnimations.map(el => el.name)}
                strategy={verticalListSortingStrategy}
            >
                {videoAnimations.map(el => <VideoTrackItem key={el.name} id={el.name} name={el.name} />)}
            </SortableContext>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
        >
            <Layout title='Editor' subtitle='New Project' back='/dashboard'>
                <Container maxW='container.xl'>
                    <HStack bg='white' p={4} rounded={8} marginBottom={4}>
                        <Input size='lg' placeholder='name'></Input>
                        <Button size='lg'>Export</Button>
                        <IconButton icon={<SaveIcon />} size='lg' variant='ghost' />
                    </HStack>
                    <Stack w='full' direction={{ base: 'column', md: 'row' }}>
                        <VStack bg='white' p={4} rounded={8} flex='1'>
                            <div id='wrapper' ref={objWrapperRef}>
                                <canvas width='400px' height='400px' id='canvas' ref={canvasRef}></canvas>
                            </div>
                            <HStack>
                                <ButtonGroup isAttached>
                                    <IconButton icon={<PlayIcon />} />
                                    <IconButton icon={<PauseIcon />} />
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
                                <MenuButton as={Button} leftIcon={<AddIcon />}>Add Media</MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => videoInputRef.current.click()} icon={<VideoIcon />}>Video</MenuItem>
                                    <MenuItem icon={<ImageIcon />}>Image</MenuItem>
                                    <MenuItem icon={<BackgroundIcon />}>Solid Color</MenuItem>
                                </MenuList>
                            </Menu>
                            <Input type='file' ref={videoInputRef} id='video-input' hidden onChange={handleFileUpload} />
                            <VStack w='full' marginTop={4}>
                                <VideoTrack />
                            </VStack>
                        </Box>
                    </Stack>
                </Container>
            </Layout>
        </DndContext>
    )
}