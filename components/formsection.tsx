import { FieldData, FormData, PageData, SelectItem } from "@/types/fields.types"
import { Text } from "@chakra-ui/react";
import _Input from "./_Input";
import _Select from "./_Select";
import { SingleValue, MultiValue } from "react-select";

type Props = {
    pagedata: PageData,
    step: number,
    maxSteps: number,
    currIndex: number,
    formdata: FormData,
    onChange: (fieldname: string, fieldvalues: null | string | SelectItem | SelectItem[], stringvalues: null | string | number) => void;
}
export default function FormSection({pagedata, step, maxSteps, currIndex, formdata, onChange}: Props) {

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
            stringvalue = newvalue.value
            onChange(fielddata.field_name, newvalue, stringvalue);
        }
    }

    return(
        <div>
            <Text fontSize={"x-large"} alignSelf={"center"} textAlign={"center"}>{pagedata.pageName}</Text>
            {pagedata.fields.map((fielddata: FieldData) => {
                if(fielddata.field_type === 'textinput') {
                    let text = formdata[fielddata.field_name] as string | null
                   return <_Input 
                                key={fielddata.field_name} 
                                fielddata={fielddata} 
                                value={text} 
                                onChange={onChange} 
                          />
                } else if(fielddata.field_type === 'select') {
                    return <_Select 
                                key={fielddata.field_name}
                                fielddata={fielddata}
                                value={formdata[fielddata.field_name]}
                                onChange={handleSelectChange}
                           />
                } else {
                    return null;
                }
            })}
        </div>
    );
}