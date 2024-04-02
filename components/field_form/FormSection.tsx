import { FieldData, FormData, PageData, SelectItem } from "@/types/fields.types"
import { Button, ButtonGroup, Text } from "@chakra-ui/react";
import FieldInput from "../field/FieldInput";
import FieldSelect from "../field/FieldSelect";
import { SingleValue, MultiValue } from "react-select";
import { useEffect, useState } from "react";

type Props = {
    pagedata: PageData,
    step: number,
    maxSteps: number,
    currIndex: number,
    formdata: FormData,
    onChange: (fieldname: string, fieldvalues: null | string | SelectItem | SelectItem[], stringvalues: null | string | number) => void;
    onNext: (e:any) => void
    onBack: (e:any) => void
    onSubmit: (e:any) => void
}
export default function FormSection({pagedata, step, maxSteps, currIndex, formdata, onChange, onBack, onNext, onSubmit}: Props) {

    const [validSection, setValidSection] = useState(false);

    const handleInputChange = (fielddata: FieldData, newvalue: string) => {
        console.log({newvalue});
        if(fielddata.field_validation === 'integer') {
            onChange(fielddata.field_name, newvalue, parseInt(newvalue))
        } else if(fielddata.field_validation === 'float') {
            onChange(fielddata.field_name, newvalue, parseFloat(newvalue))
        } else if(fielddata.field_validation === 'string') {
            onChange(fielddata.field_name, newvalue, newvalue)
        }
    }

    const handleSelectChange = (fielddata: FieldData, newvalue: SelectItem | SelectItem[]) => {
        let stringvalue = "";
        if(newvalue && Array.isArray(newvalue)) {
            stringvalue = newvalue.map(x => x.value).join(",")
            onChange(fielddata.field_name, newvalue, stringvalue);
        } else if(newvalue) {
            stringvalue = newvalue.value as string;
            onChange(fielddata.field_name, newvalue, stringvalue);
        }
    }

    useEffect(() => {
        let valid = true;
        pagedata.fields.forEach((field: FieldData) => {
            if(field.field_optional === false){
                if(formdata[field.field_name] && formdata[field.field_name] !== '') {
                    //Do nothing
                } else {
                    valid = false;
                }
            }
        });
        setValidSection(valid);

    }, [formdata, pagedata])

    return(
        <div>
            <Text fontSize={"x-large"} alignSelf={"center"} textAlign={"center"}>{pagedata.pageName}</Text>
            {pagedata.fields.map((fielddata: FieldData) => {
                if(fielddata.field_type === 'textinput') {
                    let text = formdata[fielddata.field_name] as string | null
                   return <FieldInput 
                                key={fielddata.field_name} 
                                fielddata={fielddata} 
                                value={text} 
                                onChange={onChange} 
                          />
                } else if(fielddata.field_type === 'select') {
                    let values = formdata[fielddata.field_name] as SelectItem | SelectItem[];
                    return <FieldSelect 
                                key={fielddata.field_name}
                                fielddata={fielddata}
                                value={values}
                                onChange={handleSelectChange}
                           />
                } else {
                    return null;
                }
            })}
            <ButtonGroup>
                {step !== 0 && <Button onClick={onBack}>Back</Button>}
                {step + 1 === maxSteps ? 
                    <Button colorScheme="red" onClick={onSubmit} isDisabled={!validSection}>Submit</Button> 
                    : 
                    <Button colorScheme="teal" onClick={onNext} isDisabled={!validSection}>Next</Button>
                }
            </ButtonGroup>
            
        </div>
    );
}