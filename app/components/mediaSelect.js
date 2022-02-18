import { useMutation, useQuery } from "@apollo/client";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, TabList, Tabs, Tab, TabPanels, TabPanel, Button, Skeleton, VStack, Box, HStack, IconButton, Text, Image } from "@chakra-ui/react";
import { useRef } from "react";

import {
    FiCheck as SelectIcon
} from 'react-icons/fi'

import client from '../utils/client';

import GET_FILES_QUERY from '../utils/queries/files';
import UPLOAD_FILE_MUTATION from '../utils/queries/uploadFile';

export default function MediaSelect({ isOpen, onClose, username, onFileSelect, onUploadStarted, onUploadCompleted }) {
    const fileInputRef = useRef();

    const { loading, data } = useQuery(GET_FILES_QUERY);
    const [upload] = useMutation(UPLOAD_FILE_MUTATION, {
        onCompleted: (d) => {
            client.refetchQueries({ include: [GET_FILES_QUERY] });
            onUploadCompleted(d.createFile);
        }
    });

    const handleFileUpload = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            var src = URL.createObjectURL(file);

            onUploadStarted();
            upload({ variables: { username: username, file: file } });

            let tmpFile = {
                id: null,
                file: {
                    filename: file.name,
                    url: src
                }
        }

        selectFile(tmpFile, true);
    }
}

const selectFile = (file, uploading = false) => {
    if (!onFileSelect) {
        return;
    }
    onFileSelect(file, uploading);
    onClose();
}

return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Select Media</ModalHeader>
            <ModalCloseButton />
            <ModalBody py={4}>
                <Tabs>
                    <TabList>
                        <Tab>Upload</Tab>
                        <Tab>Library</Tab>
                        <Tab>Pexels</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Button onClick={() => fileInputRef.current.click()}>Upload</Button>
                            <input type='file' ref={fileInputRef} id='file-input' hidden onChange={e => handleFileUpload(e)} />
                        </TabPanel>
                        <TabPanel bg='gray.200'>
                            <Skeleton isLoaded={!loading}>
                                <VStack>
                                    {
                                        data?.files.map(el =>
                                            <HStack shadow='sm' padding={2} key={el.id} bg='white' rounded={8}>
                                                <Image maxH={'40px'} src={el.file.url} />
                                                <Text>{el.file.filename}</Text>
                                                <IconButton icon={<SelectIcon />} onClick={() => selectFile(el)} />
                                            </HStack>
                                        )
                                    }
                                </VStack>
                            </Skeleton>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </ModalBody>
        </ModalContent>
    </Modal>
)
}