import {
    HStack,
    IconButton,
    ButtonGroup,
    Editable,
    EditableInput,
    EditablePreview
} from '@chakra-ui/react';

import {
    FiMove as DragIcon,
    FiEdit2 as EditIcon
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

    const saveChanges = (n) => {
        updateTrackitem({
            variables: {
                id: id,
                name: n,
                duration: duration,
                data: {}
            }
        })
    }

    const changeName = (value) => {
        setName(value);
        saveChanges(value);
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
            <Editable flex={1} value={_name} onChange={changeName}>
                <EditablePreview />
                <EditableInput value={_name} padding={2} />
            </Editable>
            <ButtonGroup>
                <IconButton isLoading={loading} variant='ghost' icon={<EditIcon />} />
            </ButtonGroup>
        </HStack>
    )
}