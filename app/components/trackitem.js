import {
    HStack,
    IconButton,
    ButtonGroup,
    Editable,
    EditableInput,
    EditablePreview,
    VStack,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormControl,
    FormLabel
} from '@chakra-ui/react';

import {
    FiMove as DragIcon,
    FiEdit2 as EditIcon,
    FiChevronUp as CloseIcon,
    FiDelete as DeleteIcon
} from 'react-icons/fi'

import {
    useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { useMutation } from '@apollo/client';

import UPDATE_ITEM_MUTATION from '../utils/queries/updateTrackItem';
import { useState } from 'react';

export default function VideoTrackItem({ name, id, duration }) {
    const [updateTrackitem, { loading }] = useMutation(UPDATE_ITEM_MUTATION);
    const [_name, setName] = useState(name);
    const [_duration, setDuration] = useState(duration);
    const [editing, setEditing] = useState(false);

    const saveChanges = ({n, dur}) => {
        updateTrackitem({
            variables: {
                id: id,
                name: n||name,
                duration: dur||duration,
                data: {}
            }
        })
    }

    const changeName = (value) => {
        setName(value);
        saveChanges({n: value});
    }

    const changeDuration = (value) => {
        value = parseInt(value);
        setDuration(value);
        saveChanges({dur: value});
    }

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
        <VStack
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
            <HStack w='full'>
                <IconButton variant='ghost' {...listeners} icon={<DragIcon />} />
                <Editable flex={1} value={_name} onChange={changeName}>
                    <EditablePreview />
                    <EditableInput value={_name} padding={2} />
                </Editable>
                <ButtonGroup isAttached={true}>
                    <IconButton isLoading={loading} onClick={() => setEditing(!editing)} icon={editing?<CloseIcon/>:<EditIcon />} />
                    <IconButton icon={<DeleteIcon/>}/>
                </ButtonGroup>
            </HStack>
            <VStack hidden={!editing} w='full' p={2} paddingLeft={12}>
                <FormControl>
                    <FormLabel>Duration (ms)</FormLabel>
                    <NumberInput w='full' value={_duration} onChange={changeDuration}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>
            </VStack>
        </VStack>
    )
}