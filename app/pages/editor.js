import { Input, Box, Flex, HStack, Stack, Spacer, Button, IconButton, Center, VStack, ButtonGroup, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Container, Menu, MenuButton, MenuList, MenuItem, Text } from "@chakra-ui/react";
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
    FiBox as BackgroundIcon
} from "react-icons/fi";
import Layout from "../components/layout";

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

    const VideoTrackItem = ({ name }) => {
        return (
            <Box w='full' bg='white' p={4} rounded={8} shadow='sm'><Text>{name}</Text></Box>
        )
    }

    const VideoTrack = () => {
        return (
            videoAnimations.map(el => <VideoTrackItem key={el.name} name={el.name}/>)
        )
    }

    return (
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
                                <MenuItem onClick={() => videoInputRef.current.click()} icon={<VideoIcon/>}>Video</MenuItem>
                                <MenuItem icon={<ImageIcon />}>Image</MenuItem>
                                <MenuItem icon={<BackgroundIcon />}>Solid Color</MenuItem>
                            </MenuList>
                        </Menu>
                        <Input type='file' ref={videoInputRef} id='video-input' hidden onChange={handleFileUpload} />
                        <VStack w='full' marginTop={4}>
                            <VideoTrack/>
                        </VStack>
                    </Box>
                </Stack>
            </Container>
        </Layout>
    )
}