export interface FieldData {
    field_name: string,
    field_type: string,
    field_label: string,
    field_optional: boolean,
    field_options : null | string[],
    field_options_max: null | number,
    field_options_createable: boolean,
    field_validation: string
}

export interface PageData {
    pageName : string,
    fields: FieldData[]
}

export interface ConfigData {
    num_pages: number,
    pages: PageData[],
    timeout: number
}

export interface SelectItem {
    value: string,
    label: string
}

export interface FormData {
    [key: string]: null | string | SelectItem | SelectItem[]
}

export interface FormSubmitData {
    [key: string]: null | string | string[] | number
}