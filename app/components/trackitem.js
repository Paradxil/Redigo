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

export default function VideoTrackItem({ name, id }) {
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