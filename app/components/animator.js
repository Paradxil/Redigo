import { useRef, useState, useEffect } from "react";
import createAnimator, { TrackItem } from 'animator';
import { VStack, HStack, ButtonGroup, IconButton, Center } from "@chakra-ui/react";

import {
    FiSmartphone as PhoneIcon,
    FiInstagram as InstagramIcon,
    FiYoutube as YoutubeIcon,
    FiPlay as PlayIcon,
    FiPause as PauseIcon,
    FiRotateCcw as RestartIcon
} from "react-icons/fi";

export const useAnimator = (canvas, objWrapper) => {
    const [animator] = useState(createAnimator());
    const [trackItems, setTrackItems] = useState({});
    const [paused, setPaused] = useState(true);

    const initAnimator = (canvasRef, wrapperRef) => {
        animator.init(canvasRef.current, wrapperRef.current, ()=>{
            setPaused(true);
        });
    }

    const setTrackItem = (item) => {
        trackItems[item.id] = item;
        setTrackItems({ ...trackItems });
        animator.setTrackItem(item);
    }

    const setInitialTrackItems = (items) => {
        for (let data of items || []) {
            //id, name, type, data, duration, file
            let type = data.file?.type.split('/')[0]||data.type;
            let item = new TrackItem(data.id, data.name, type, data.data, data.duration, data.file.file.url);
            setTrackItem(item);
        }
    }

    const getTrackItem = (id) => {
        animator.getTrackItem(id);
    }

    const play = () => {
        setPaused(false);
        animator.play();
    }

    const pause = () => {
        setPaused(true);
        animator.pause();
    }

    const restart = () => {
        setPaused(false);
        animator.restart();
    }

    return {
        animator,
        initAnimator,
        play,
        pause,
        restart,
        setTrackItem,
        setInitialTrackItems,
        getTrackItem,
        trackItems,
        paused
    }
}

export default function Animator({ play, pause, initAnimator, paused, restart }) {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);

    const [canvasH, setCanvasHeight] = useState(400);

    const resizeCanvas = (aspectRatio = 1) => {
        setCanvasHeight(aspectRatio * canvasRef.current.width);
    }

    useEffect(() => {
        resizeCanvas();
        initAnimator(canvasRef, wrapperRef);
    }, []);

    return (
        <VStack bg='white' p={0} spacing={0} overflow='hidden' shadow={'sm'} w={{base: 'full', lg: '400px'}} rounded={8}>
            <Center ref={wrapperRef} w='100%' onMouseDown={() => { wrapperRef.current.requestFullscreen(); }} onMouseUp={() => { document.exitFullscreen();}}>
                <canvas
                    style={{ width: '100%' }}
                    height={canvasH + 'px'}
                    ref={canvasRef}
                >
                </canvas>
            </Center>
            <HStack p={4} >
                <ButtonGroup isAttached>
                    <IconButton icon={<PlayIcon />} disabled={!paused} onClick={() => play()} />
                    <IconButton icon={<PauseIcon />} disabled={paused} onClick={() => pause()} />
                    <IconButton icon={<RestartIcon />} onClick={() => restart()} />
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