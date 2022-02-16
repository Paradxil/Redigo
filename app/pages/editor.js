import { Input, Box, Flex, HStack, Stack, Spacer, Button, IconButton, Center, VStack, ButtonGroup, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Container } from "@chakra-ui/react";
import { FiSave as SaveIcon, FiSmartphone as PhoneIcon, FiInstagram as InstagramIcon, FiYoutube as YoutubeIcon, FiPlay as PlayIcon, FiPause as PauseIcon } from "react-icons/fi";
import Layout from "../components/layout";

import Animator, { Track } from 'animator';
import { useEffect, useRef, useState } from "react";

export default function Editor() {
    const canvasRef = useRef(null);
    const objWrapperRef = useRef(null);
    const videoInputRef = useRef(null);
    const videos = [];
    const videoTrack = new Track();

    useEffect(() => {
        Animator.init(canvasRef.current, objWrapperRef.current);
        Animator.addTrack('video', videoTrack);
    });

    const handleFileUpload = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0];
            videos.push(URL.createObjectURL(file));
            Animator.getTrack('video').pushAnimation('video', { src: videos[0] }, 20000);
            Animator.animate();
        }
    }

    return (
        <Layout title='Editor' subtitle='New Project' back='/dashboard'>
            <Container maxW='container.xl'>
                <HStack bg='white' p={4} rounded={8} marginBottom={4}>
                    <Input size='lg' placeholder='name'></Input>
                    <Button size='lg'>Export</Button>
                    <IconButton icon={<SaveIcon />} size='lg' variant='ghost' />
                </HStack>
                <Stack w='full' direction={{base: 'column', md: 'row'}}>
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
                    <Box bg='white' p={4} rounded={8} flex='1'>
                        <Button onClick={() => videoInputRef.current.click()}>Add Video</Button>
                        <Input type='file' ref={videoInputRef} id='video-input' hidden onChange={handleFileUpload} />
                    </Box>
                </Stack>
            </Container>
        </Layout>
    )
}