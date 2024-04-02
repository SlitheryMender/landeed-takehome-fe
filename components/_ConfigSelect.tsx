import { isFloat, isInteger } from "@/helpers/validations";
import { FieldData } from "@/types/fields.types";
import { FormControl, FormErrorMessage, FormLabel, Text } from "@chakra-ui/react";
import Select, { MultiValue, SingleValue } from 'react-select';
import { useState } from "react";
import ReactSelectCreatable from "react-select/creatable";
import { SelectItem } from "@/types/fields.types";

type Props = {
    fielddata: string,
    label: string,
    required: boolean,
    options?: string[],
    finalOptions?: SelectItem[]
    multi?: boolean
    createable?: boolean,
    value: null | SelectItem | SelectItem[],
    onChange: (fielddata: string, newvalue: SelectItem | SelectItem[] ) => void
}

export default function _ConfigSelect({fielddata, label, options,finalOptions, required, multi=false, createable=false, value, onChange} : Props) {

    let [error, setError] = useState<null|string>(null);

    const handleChange = (newvalue: any) => {
        onChange(fielddata, newvalue);
    }

    let selectOptions : SelectItem[] = options ? options.map((x:string) => {
        let option = {value : x, label: x};
        return option;
    }) : [];

    return (
        <FormControl mb={5}>
            <FormLabel mb='8px'>{label + (required ? '(required)' : '')}</FormLabel>
            {createable ? 
                <ReactSelectCreatable
                    value={value}
                    onChange={handleChange}
                    placeholder={'Select a value'}
                    options={finalOptions || selectOptions}
                    isMulti={multi}
                    isSearchable
                    isClearable
                    createOptionPosition={'first'}
                    required={required}
                /> :
                <Select
                    value={value}
                    onChange={handleChange}
                    placeholder={'Select a value'}
                    options={finalOptions || selectOptions}
                    isMulti={multi}
                    isSearchable
                    isClearable
                    required={required}
                />
            }
            {required && value === null && 
                <FormErrorMessage color={'red.300'} mb='8px' fontSize={"small"}>{"Please select a value"}</FormErrorMessage>
            }
        </FormControl>
    );
  }