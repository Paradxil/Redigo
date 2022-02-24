import { 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalOverlay, 
    Box, 
    useDisclosure, 
    ModalHeader, 
    Button, 
    IconButton 
} from "@chakra-ui/react";

export default function ExportModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box onClick={onOpen}>
                { children }
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Export Options</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={4}>
                        
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}