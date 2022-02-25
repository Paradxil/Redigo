import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Box,
    useDisclosure,
    ModalHeader,
    HStack,
    VStack,
    Checkbox,
    CheckboxGroup,
    Text,
    Heading,
    Button
} from "@chakra-ui/react";

import { useState } from "react";
import { useQuery, useMutation } from '@apollo/client';

import GET_EXPORT_SIZES from '../utils/queries/export/getExportSizes';
import CREATE_EXPORT_MUTATION from '../utils/queries/export/createExport';

export default function ExportModal({ children, projectid }) {
    const [exportSizes, setExportSizes] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data } = useQuery(GET_EXPORT_SIZES);

    const [createExport, { loading }] = useMutation(CREATE_EXPORT_MUTATION, {
        variables: {
            projectid: projectid,
            sizes: exportSizes.map(el => {return {id: el}})
        },
        onCompleted: onClose
    });

    return (
        <>
            <Box onClick={onOpen}>
                {children}
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalContent overflow='hidden'>
                    <ModalHeader>Export Options</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={4} bg='gray.100'>
                        <CheckboxGroup onChange={(values) => setExportSizes(values)} value={exportSizes}>
                            <VStack alignItems='start' gap={2}>
                                {
                                    data?.exportSizes.map(el =>
                                        <Checkbox
                                            w='full'
                                            key={el.id}
                                            value={el.id}
                                            p={4}
                                            borderRadius={8}
                                            shadow='sm'
                                            bg='white'
                                        >
                                            <HStack>
                                                <Heading size='sm'>
                                                    {el.name}
                                                </Heading>
                                                <Text>
                                                    {el.width}x{el.height}
                                                </Text>
                                                <Text>
                                                    {el.framerate}fps
                                                </Text>
                                            </HStack>
                                        </Checkbox>)
                                }
                                <Button
                                    size='lg'
                                    variant='solid'
                                    colorScheme='blue'
                                    disabled={exportSizes.length === 0}
                                    onClick={createExport}
                                    isLoading={loading}
                                >
                                    Export
                                </Button>
                            </VStack>
                        </CheckboxGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}