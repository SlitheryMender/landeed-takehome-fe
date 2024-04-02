import { isFloat, isInteger } from "@/helpers/validations";
import { FieldData } from "@/types/fields.types";
import { FormControl, FormErrorMessage, FormLabel, Switch, Text } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
    fielddata: string,
    label: string,
    required: boolean,
    value: boolean,
    onChange: (fielddata: string, newvalue: boolean ) => void
}

export default function ConfigSwitch({fielddata, label, required, value, onChange} : Props) {

    let [error, setError] = useState<null|string>(null);

    const handleChange = (e: any) => {
        onChange(fielddata, e.target.checked);
    }

    return (
        <FormControl mb={5}>
            <FormLabel mb='8px'>{label + (required ? '(required)' : '')}</FormLabel>
            <Switch
                isChecked={value}
                onChange={handleChange}
            />
            {required && value === null && 
                <FormErrorMessage color={'red.300'} mb='8px' fontSize={"small"}>{"Please select a value"}</FormErrorMessage>
            }
        </FormControl>
    );
  }