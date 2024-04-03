import { isFloat, isInteger } from "@/helpers/validations";
import { FieldData, SelectItem } from "@/types/fields.types";
import { Input, Text, FormControl, FormHelperText, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { useState } from "react";
// import validate from "validate.js";

type Props = {
    fielddata: FieldData,
    value: string | null,
    // onChange: (fielddata: FieldData, newvalue: string) => void
    onChange: (fieldname: string, fieldvalues: null | string | SelectItem | SelectItem[], stringvalues: null | string | number) => void;
}
export default function FieldInput({fielddata, value, onChange} : Props) {

    let [error, setError] = useState<null|string>(null);

    const handleChange = (event: any) => {
        let input = event.target.value;
        console.log({input});
        // let errors = validate.single(input, fielddata.field_constraints);

        switch (fielddata.field_validation) {
            case "string":
                onChange(fielddata.field_name, input, input)
                setError(null);
                break;

            case "integer":
                if(isInteger(input)) {
                    onChange(fielddata.field_name, input, parseInt(input))
                    setError(null);
                } else if(input === '') {
                    onChange(fielddata.field_name, input, input)
                } else {
                    setError("Please enter an integer value.")
                }
                break;
            
            case "float":
                if(isFloat(input)) {
                    onChange(fielddata.field_name, input, parseFloat(input))
                    setError(null);
                } else if(input === '') {
                    onChange(fielddata.field_name, input, input)
                } else {
                    setError("Please enter a decimal value.")
                }
                break;
        
            default:
                onChange(fielddata.field_name, input, input)
                setError(null);
                break;
        }
        // onChange(event.target.value);
    }


    return (
        <FormControl alignContent={"center"} mb={5}>
            <FormLabel mb='8px'>{fielddata.field_label + (fielddata.field_optional ? '' : '(required)')}</FormLabel>
            <Input
                value={value || ""}
                onChange={handleChange}
                placeholder={fielddata.field_validation === 'string' ? 'Ex: John Doe' : fielddata.field_validation === 'integer' ? 'Ex: 34' : 'Ex: 15.65'}
                size='sm'
                isInvalid={error !== null}
                errorBorderColor='red.300'
                variant={"outline"}
            />
            {error && <FormErrorMessage color={'red.300'} mb='8px' fontSize={"small"}>{error}</FormErrorMessage>}
        </FormControl>
    );
  }