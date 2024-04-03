'use client'

import { ChangeEvent, useEffect, useState } from "react";
import styles from "../page.module.css";
import { Button, ButtonGroup, Card, CardFooter, Center, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack, StackDivider, Text } from "@chakra-ui/react";
import axios from "axios";
import { ConfigData, FieldData, PageData, SelectItem } from "@/types/fields.types";
import { SingleValue, MultiValue } from "react-select";
import FormSection from "@/components/field_form/FormSection";
import { FormData, FormSubmitData } from "@/types/fields.types";
import EachPage from "@/components/config_form/EachPage";
import { isFloat, isInteger } from "@/helpers/validations";


export default function FormConfig() {

    let [isLoading, setLoading] = useState(false);
    let [config, setConfig] = useState<null | ConfigData>(null);

    let [showAddModal, setAddModal] = useState(false);
    let [newpageName, setNewPageName] = useState("");

    const addFieldToPage = (pageName: string, fielddata: FieldData) => {
        if(config) {
            let page = config.pages.find(x => x.pageName === pageName);
            let newpage: PageData | null = page ? {...page, fields : [...page.fields, fielddata]} : null;
            let pageIndex = config.pages.findIndex(page => page.pageName === pageName);
            if(newpage && pageIndex) {
                let newpages = [...config.pages];
                newpages.splice(pageIndex, 1, newpage);
                let newConfig: ConfigData = {
                    num_pages: config.num_pages,
                    timeout: config.timeout,
                    pages: newpages
                }
                setConfig(newConfig);
            }
        }
    }

    const removeFieldFromPage = (pageName: string, index: number) => {
        console.log({pageName, index});
        if(config) {
            let page = config.pages.find(x => x.pageName === pageName);
            
            let pageFields: FieldData[] = page ? [...page.fields] : [];
            pageFields.splice(index,1);
            let newpage: PageData | null = page ? {...page, fields : pageFields} : null;
            let pageIndex = config.pages.findIndex(pag => pag.pageName === pageName);
            console.log({newpage, pageIndex});
            if(newpage && (pageIndex !== null)) {
                let newpages = [...config.pages];
                newpages.splice(pageIndex, 1, newpage);
                let newConfig: ConfigData = {
                    ...config,
                    pages: newpages
                }
                console.log({newConfig});
                setConfig(newConfig);
            }
        }
    }

    const setTimeoutValue = (timeInMins: number) => {
        if(config) {
            let newConfig: ConfigData = {...config, timeout: timeInMins*60*1000};
            setConfig(newConfig);
        }
    }

    const addPage = (pageName:string) => {
        if(config) {
            let newpage: PageData = {
                pageName: pageName,
                fields: []
            }
            let newConfig: ConfigData = {
                ...config,
                num_pages: config.num_pages + 1,
                pages: [...config.pages, newpage],
            }
            setConfig(newConfig);
        }
        setAddModal(false);
    }

    const removePage = (pageName:string) => {
        if(config) {
            let newpages: PageData[] = config.pages.filter(x => x.pageName !== pageName);
            let newConfig: ConfigData = {
                ...config,
                num_pages: config.num_pages - 1,
                pages: newpages,
            }
            setConfig(newConfig);
        }
    }

    const getConfig = async () => {
        try {
            setLoading(true);
            let response = await axios({
                method: 'GET',
                url: process.env.NEXT_PUBLIC_URL + '/config'
            });
            setConfig(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert("Something went wrong. Could not load");
        }
    }

    const postConfig = async () => {
        try {
            setLoading(true);
            let response = await axios({
                method: 'POST',
                url: process.env.NEXT_PUBLIC_URL + '/newconfig',
                data: config
            });
            // setConfig(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            alert("Something went wrong. Could not submit");
            return error;
        }
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        console.log(config);
        await postConfig();
    }

    useEffect(() => {
        getConfig()
    }, []);

    useEffect(() => {
        console.log(config);
    }, [config])

    if(isLoading) {
        return <Spinner />
    }

    if(config) {
        return (
            <>
                <Modal isOpen={showAddModal} onClose={() => setAddModal(false)} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>
                        <Text>Add new page</Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <FormControl alignContent={"center"}>
                        <FormLabel mb='8px'>{"Please enter page name"}</FormLabel>
                        <Input
                            value={newpageName}
                            onChange={(e:ChangeEvent<HTMLInputElement>) => setNewPageName(e.target.value)}
                            placeholder={'Ex: Personal Details'}
                            size='sm'
                            isInvalid={newpageName === ''}
                            errorBorderColor='red.300'
                            variant={"outline"}
                        />
                    </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={"teal"} onClick={() => {
                            addPage(newpageName)
                            setNewPageName("");
                        }}>Add new Page</Button>
                        <Button colorScheme="red" onClick={() => setAddModal(false)}>Close</Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
                <Card m={4}>
                <Center><Text fontSize={'xx-large'}>Form Config</Text></Center>
                <FormControl alignContent={"center"}>
                        <FormLabel mb='8px'>{"Please enter form timeout (in minutes)"}</FormLabel>
                        <Input
                            value={config.timeout/(60*1000)}
                            onChange={(e:ChangeEvent<HTMLInputElement>) => {
                                if(isFloat(e.target.value)) {
                                    setTimeoutValue(parseFloat(e.target.value))
                                }
                            }}
                            placeholder={'Ex: Personal Details'}
                            size='sm'
                            isInvalid={newpageName === ''}
                            errorBorderColor='red.300'
                            variant={"outline"}
                        />
                </FormControl>
                <Center><Text fontSize={'large'}>Pages Settings</Text></Center>
                <Stack divider={<StackDivider />} spacing={4}>
                {config.pages && config.pages.length > 0 && config.pages.map((eachpage: PageData) => 
                    <EachPage 
                        key={"eachpage-"+eachpage.pageName}
                        pagedata={eachpage} 
                        addFieldToPage={addFieldToPage} 
                        removeFieldFromPage={removeFieldFromPage}
                        removePage={removePage}
                    />
                )}
                </Stack>
                <Button colorScheme={"teal"} onClick={() => setAddModal(true)}>Add new page</Button>
                <CardFooter>
                <Button colorScheme={"red"} onClick={onSubmit}>Submit config</Button>
                </CardFooter>
            </Card>
            </>
        );
    } else {
        return(<div><Text>{"No config found."}</Text></div>)
    }
}
