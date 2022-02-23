import { useRef, useState, useEffect } from "react";
import createAnimator, { TrackItem } from 'animator';
import { VStack, HStack, ButtonGroup, IconButton, Center } from "@chakra-ui/react";

import {
    FiSmartphone as PhoneIcon,
    FiInstagram as InstagramIcon,
    FiYoutube as YoutubeIcon,
    FiPlay as PlayIcon,
    FiPause as PauseIcon
} from "react-icons/fi";

export const useAnimator = (canvas, objWrapper) => {
    const [animator] = useState(createAnimator());
    const [trackItems, setTrackItems] = useState({});

    const initAnimator = (canvasRef, wrapperRef) => {
        animator.init(canvasRef.current, wrapperRef.current);
    }

    const setTrackItem = (item) => {
        trackItems[item.id] = item;
        setTrackItems({ ...trackItems });
        animator.setTrackItem(item);
    }

    const setInitialTrackItems = (items) => {
        for (let data of items || []) {
            //id, name, type, data, duration, file
            let type = file?.type.split('/')[0]||data.type;
            let item = new TrackItem(data.id, data.name, type, data.data, data.duration, data.file.file.url);
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

    return {
        animator,
        initAnimator,
        play,
        pause,
        setTrackItem,
        setInitialTrackItems,
        getTrackItem,
        trackItems
    }
}

export default function Animator({ play, pause, initAnimator }) {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);

    const [canvasH, setCanvasHeight] = useState(400);

    const resizeCanvas = (aspectRatio = 1) => {
        setCanvasHeight(aspectRatio * canvasRef.current.width);
    }

    useEffect(() => {
        window.addEventListener('resize', resizeCanvas.bind(this), false);
        resizeCanvas();

        initAnimator(canvasRef, wrapperRef);
    }, []);

    return (
        <VStack bg='white' p={4} rounded={8} flex='1' width='full'>
            <Center ref={wrapperRef} w='100%' maxW='400px'>
                <canvas
                    style={{ width: '100%' }}
                    height={canvasH + 'px'}
                    ref={canvasRef}
                >
                </canvas>
            </Center>
            <HStack>
                <ButtonGroup isAttached>
                    <IconButton icon={<PlayIcon />} onClick={() => play()} />
                    <IconButton icon={<PauseIcon />} onClick={() => pause()} />
                </ButtonGroup>
                <ButtonGroup isAttached>
                    <IconButton icon={<PhoneIcon />} onClick={() => resizeCanvas(16/9)} />
                    <IconButton icon={<InstagramIcon />} onClick={() => resizeCanvas(1)} />
                    <IconButton icon={<YoutubeIcon />} onClick={() => resizeCanvas(9/16)} />
                </ButtonGroup>
            </HStack>
        </VStack>
    )
}