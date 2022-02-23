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
    verticalListSortingStrategy
} from '@dnd-kit/sortable';

import VideoTrackItem from './trackitem';

import UPDATE_PROJECT_TRACK_MUTATION from '../utils/queries/updateProjectTrack';

import { useMutation } from '@apollo/client';

import {
    useEffect,
    useState
} from 'react';
import { VStack } from '@chakra-ui/react';

export const useTrack = (name, projectid, animator) => {
    const [updateTrack, { loading }] = useMutation(UPDATE_PROJECT_TRACK_MUTATION);
    const [track, setTrack] = useState([]);

    useEffect(() => {
        animator.setTrack(name, track);
    }, []);

    const sendTrackUpdates = (t) => {
        updateTrack({ variables: { id: projectid, track: t } });
    }

    const setInitialTrack = (t) => {
        setTrack([...(t || [])]);
        animator.setTrack(name, t || []);
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

    const removeTrackItem = (id) => {
        let index = track.findIndex(i => id === i);

        if(index != -1) {
            track.splice(index, 1);
            setTrack([...track]);
            animator.setTrack(name, track);
            animator.update();
            sendTrackUpdates(track);
        }
    }

    return {
        setInitialTrack,
        reorderTrackItems,
        pushTrackItem,
        removeTrackItem,
        track,
        loading
    }
}

export default function Track({ track, trackItems, reorderTrackItems, removeTrackItem }) {
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
            <VStack>
                <SortableContext
                    items={track.map(el => el)}
                    strategy={verticalListSortingStrategy}
                >
                    {
                        track.map(id => {
                            let item = trackItems[id];
                            return <VideoTrackItem key={item.id} onDelete={removeTrackItem} {...item} />
                        })
                    }
                </SortableContext>
            </VStack>
        </DndContext>
    )
}