import { ConfigFieldData, FieldData, PageData } from "@/types/fields.types"
import { Button, Card, CardBody, CardFooter, CardHeader, Center, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Stack, StackDivider, Text } from "@chakra-ui/react";
import { useState } from "react"
import ConfigField from "../config/ConfigField";


type Props = {
    pagedata: PageData,
    addFieldToPage: (pagename: string, fielddata: FieldData) => void
    removeFieldFromPage: (pagename: string, index: number) => void
    removePage: (pagename: string) => void
}

export default function EachPage({pagedata, addFieldToPage, removeFieldFromPage, removePage}: Props) {
    
    let [fields, setFields] = useState<FieldData[]>([]);
    let [showAddModal, setAddModal] = useState(false);

    const addField = (fielddata: FieldData) => {
        addFieldToPage(pagedata.pageName, fielddata);
        setAddModal(false);
        // setFields([...fields, fielddata]);
    }

    const removeField = (index: number) => {
        removeFieldFromPage(pagedata.pageName, index);
    }

    return(
        <Card borderRadius={1}>
        <Modal isOpen={showAddModal} onClose={() => setAddModal(false)}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>
                <Text>Add new field</Text>
            </ModalHeader>
            <ModalBody>
                <ConfigField
                    onSubmit={addField}
                />
            </ModalBody>
            </ModalContent>
        </Modal>
        <CardHeader>
            <Stack direction={"row"} justifyContent={"space-between"}>
            <Center><Text>{pagedata.pageName}</Text></Center>
            <Button colorScheme={"teal"} onClick={() => setAddModal(true)}>Add new Field</Button>
            </Stack>
        </CardHeader>
        <CardBody>
        <Stack divider={<StackDivider />} spacing={4}>
        {pagedata.fields && pagedata.fields.length > 0 && pagedata.fields.map((eachfield: FieldData, index: number) => 
            <Card key={"fields-" + pagedata.pageName + "-" + eachfield.field_name} variant={"filled"}>
                <CardHeader>
                    <Center>
                        <Text>{"Field Name :" + eachfield.field_name}</Text>
                    </Center>
                </CardHeader>
                <CardBody>
                <Text>{"Field Label :" + eachfield.field_label}</Text>
                <Text>{"Is field optional? :" + (eachfield.field_optional ? 'Yes' : 'No')}</Text>
                <Text>{"Field Type :" + eachfield.field_type}</Text>
                {eachfield.field_type === 'textinput' && 
                    <Text>{"Field Validation :" + eachfield.field_validation}</Text>
                }
                {eachfield.field_type === 'select' && 
                    <>
                        <Text>{"Options to select from :" + (eachfield.field_options ? eachfield.field_options.join(",") : "") }</Text>
                        <Text>{"Can user add custom options? :" + (eachfield.field_options_createable ? 'Yes' : 'No')}</Text>
                        <Text>{"Can user select multiple options? :" + (eachfield.field_options_max && eachfield.field_options_max === 1 ? "No" : "Yes")}</Text>
                    </>
                }
                </CardBody>
                <CardFooter>
                    <Button colorScheme="red" onClick={() => removeField(index)}>Remove Field</Button>
                </CardFooter>
            </Card>
        )}
        </Stack>
        </CardBody>
        <CardFooter>
            <Button colorScheme={"red"} onClick={() => removePage(pagedata.pageName)}>Remove Page</Button>
        </CardFooter>
        </Card>
    )

}