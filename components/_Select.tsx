import { isFloat, isInteger } from "@/helpers/validations";
import { FieldData } from "@/types/fields.types";
import { FormControl, FormErrorMessage, FormLabel, Text } from "@chakra-ui/react";
import Select, { MultiValue, SingleValue } from 'react-select';
import { useState } from "react";
import ReactSelectCreatable from "react-select/creatable";
import { SelectItem } from "@/types/fields.types";

type Props = {
    fielddata: FieldData,
    value: null | SelectItem | SelectItem[],
    onChange: (fielddata: FieldData, newvalue: SelectItem | SelectItem[] ) => void
}

export default function _Select({fielddata, value, onChange} : Props) {

    let [error, setError] = useState<null|string>(null);

    const handleChange = (newvalue: any) => {
        onChange(fielddata, newvalue);
    }

    let selectOptions : SelectItem[] = fielddata.field_options ? fielddata.field_options.map((x:string) => {
        let option = {value : x, label: x};
        return option;
    }) : [];

    return (
        <FormControl mb={5}>
            <FormLabel mb='8px'>{fielddata.field_label + (fielddata.field_optional ? '' : '(required)')}</FormLabel>
            {fielddata.field_options_createable ? 
                <ReactSelectCreatable
                    value={value}
                    onChange={handleChange}
                    placeholder={'Select a value'}
                    options={selectOptions}
                    isMulti={fielddata.field_options_max !== 1}
                    isSearchable
                    isClearable
                    createOptionPosition={'first'}
                    required={!fielddata.field_optional}
                /> :
                <Select
                    value={value}
                    onChange={handleChange}
                    placeholder={'Select a value'}
                    options={selectOptions}
                    isMulti={fielddata.field_options_max !== 1}
                    isSearchable
                    isClearable
                    required={!fielddata.field_optional}
                />
            }
            {!fielddata.field_optional && value === null && 
                <FormErrorMessage color={'red.300'} mb='8px' fontSize={"small"}>{"Please select a value"}</FormErrorMessage>
            }
        </FormControl>
    );
  }