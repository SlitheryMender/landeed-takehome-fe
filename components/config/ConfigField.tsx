import { ConfigFieldData, FieldData, FormData, FormSubmitData, PageData, SelectItem } from "@/types/fields.types"
import { Button, ButtonGroup, Card, CardBody, CardFooter, Text } from "@chakra-ui/react";
import FieldInput from "../field/FieldInput";
import FieldSelect from "../field/FieldSelect";
import { SingleValue, MultiValue } from "react-select";
import { useEffect, useState } from "react";
import ConfigInput from "./ConfigInput";
import ConfigSelect from "./ConfigSelect";
import ConfigSwitch from "./ConfigSwitch";

type Props = {
    onSubmit: (e: FieldData) => void
}

export default function ConfigField({onSubmit}: Props) {

    const [validSection, setValidSection] = useState(false);

    let [fielddata, setFieldData] = useState<ConfigFieldData>({
            "field_name": null,
            "field_type": null,
            "field_label": null,
            "field_optional": true,
            "field_options" : null,
            "field_options_max": null,
            "field_options_createable": false,
            "field_validation": null
    });

    let [submitfielddata, setSubmitFieldData] = useState<FormSubmitData>({});


    useEffect(() => {
        if(
            fielddata.field_name && fielddata.field_name !== '' && 
            fielddata.field_label && fielddata.field_label !== '' && 
            fielddata.field_type && fielddata.field_type.value !== '' && 
            ((fielddata.field_type.value === 'textinput' && fielddata.field_validation) || 
            (fielddata.field_type.value === 'select' && fielddata.field_options))
        ) {
            setValidSection(true);
        } else {
            setValidSection(false);
        }
    }, [fielddata])

    const handleChange = (field_name:string, fieldvalues: null | string | SelectItem | SelectItem[], stringvalues: null | string | number) => {
        setFieldData({...fielddata, [field_name]: fieldvalues})
        setSubmitFieldData({...submitfielddata, [field_name]: stringvalues})
    }

    const handleCommaInputChange = (field_name:string, fieldvalues: null | string | SelectItem | SelectItem[], stringvalues: null | string | number) => {
        setFieldData({...fielddata, [field_name]: fieldvalues})
        // let str = stringvalues + "";
        let commaSeperatedValues = stringvalues ? (stringvalues + "").split(",") : [];
        setSubmitFieldData({...submitfielddata, [field_name]: commaSeperatedValues})
    }

    const handleSelectChange = (field_name:string, fieldvalues: SelectItem | SelectItem[]) => {
        setFieldData({...fielddata, [field_name]: fieldvalues})
    }

    const handleSwitchChange = (field_name:string, fieldvalues: boolean) => {
        setFieldData({...fielddata, [field_name]: fieldvalues})
    }

    const submitField = () => {
        let submitdata: FieldData = {
            field_name: fielddata.field_name || "",
            field_label: fielddata.field_label || "",
            field_optional: fielddata.field_optional,
            field_type: fielddata.field_type ? (fielddata.field_type.value + '') : '',
            field_validation: fielddata.field_validation ? fielddata.field_validation.value + "" : null,
            field_options: fielddata.field_options ? fielddata.field_options.split(",") : null,
            field_options_max: fielddata.field_options_max ? Number(fielddata.field_options_max.value) : null,
            field_options_createable: fielddata.field_options_createable || false
        }
        onSubmit(submitdata);
    }



    return(
        <Card variant={"filled"}>
            <CardBody>
            <ConfigInput 
                fielddata="field_name" 
                validation="string"
                label="Please enter field name" 
                required 
                value={fielddata.field_name}
                onChange={handleChange}
            />
            <ConfigSwitch
                value={fielddata.field_optional}
                onChange={handleSwitchChange}
                fielddata="field_optional"
                required
                label={"Is field optional?"}
            />
            <ConfigInput 
                fielddata="field_label" 
                validation="string"
                label="Please enter label to show for input on the form" 
                required 
                value={fielddata.field_label}
                onChange={handleChange}
            />
            <ConfigSelect
                fielddata="field_type"
                label="Select type of input"
                required
                options={['textinput', 'select']}
                value={fielddata.field_type}
                onChange={handleSelectChange}
            />
            {fielddata.field_type && fielddata.field_type.value === "textinput" &&
                <>
                    <ConfigSelect
                        fielddata="field_validation"
                        label="Select text input type"
                        required
                        options={['string', 'integer', 'float']}
                        value={fielddata.field_validation}
                        onChange={handleSelectChange}
                    />
                </>
            }
            {fielddata.field_type && fielddata.field_type.value === 'select' && 
                <>
                    <ConfigInput 
                        fielddata="field_options" 
                        validation="string"
                        label="Please enter options for Select field" 
                        required 
                        value={fielddata.field_options}
                        onChange={handleChange}
                    />
                    <ConfigSelect
                        fielddata="field_options_max"
                        label="Can user select multiple options ?"
                        required={false}
                        finalOptions={[{value: null, label:'Yes'}, {value:1, label :'No'}]}
                        value={fielddata.field_options_max}
                        onChange={handleSelectChange}
                    />
                    <ConfigSwitch
                        value={fielddata.field_options_createable}
                        onChange={handleSwitchChange}
                        fielddata="field_options_createable"
                        required
                        label={"Can user add new options?"}
                    />
                </>
            }
            </CardBody>
            <CardFooter>
                <Button colorScheme={'teal'} onClick={() => submitField()} isDisabled={!validSection}>Add Field</Button>
            </CardFooter>
        </Card>
    )

}