'use client'

import { useEffect, useState } from "react";
import styles from "../page.module.css";
import { Button, ButtonGroup, Center, Spinner, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { ConfigData, PageData, SelectItem } from "@/types/fields.types";
import { SingleValue, MultiValue } from "react-select";
import FormSection from "@/components/field_form/FormSection";
import { FormData, FormSubmitData } from "@/types/fields.types";


export default function Form() {

    let [isLoading, setLoading] = useState(false);
    let [config, setConfig] = useState<null | ConfigData>(null);

    let [maxSteps, setMaxSteps] = useState(1);
    let [step, setStep] = useState(0);

    let [formdata, setFormData] = useState<FormData>({});
    let [formSubmitData, setFormSubmitData] = useState<FormSubmitData>({});

    useEffect(() => {
        if(config && config.timeout) {
            const timeoutId = setTimeout(() => {
                setFormData({});
                setFormSubmitData({});
                setStep(0);
                alert("Form timed out. Please start again.")
            }, config.timeout);
    
            // Cleanup function to clear the timeout if the component unmounts
            return () => clearTimeout(timeoutId);
        }
      }, [config]);


    const onChange = (fieldname: string, fieldvalues: null | string | SelectItem | SelectItem[], stringvalues: null | string | number) => {
        setFormData({...formdata, [fieldname]: fieldvalues});
        setFormSubmitData({...formSubmitData, [fieldname] : stringvalues});
    }

    useEffect(()=> {
        console.log(formdata, formSubmitData)
    }, [formdata, formSubmitData]);

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

    const postEntry = async () => {
        try {
            setLoading(true);
            let response = await axios({
                method: 'POST',
                url: process.env.NEXT_PUBLIC_URL + '/entry',
                data: formSubmitData
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

    const onNext = (e: any) => {
        e.preventDefault();
        setStep(step + 1);
    }

    const onBack = (e: any) => {
        e.preventDefault();
        setStep(step - 1);
    }

    const onSubmit = async (e: any) => {
        try {
            console.log(formSubmitData);
            await postEntry();
            setFormData({});
            setFormSubmitData({});
            setStep(0);
            alert("Form data submitted");
        } catch(error) {
            alert("Data could not be submitted");
        }
    }

    useEffect(() => {
        getConfig()
    }, []);

    useEffect(() => {
        if(config){ 
            setMaxSteps(config.num_pages);
        }
    }, [config])

    if(isLoading) {
        return <Spinner />
    }

    if(config) {
        return (
            <Stack m={4}>
                <FormSection
                    key={"formsection-" + step} 
                    pagedata={config?.pages[step]} 
                    step={step} 
                    maxSteps={maxSteps} 
                    currIndex={step} 
                    onChange={onChange}
                    formdata={formdata}
                    onNext={onNext}
                    onBack={onBack}
                    onSubmit={onSubmit}
                />
            </Stack>
        );
    } else {
        return(<div><Text>{"No config found."}</Text></div>)
    }
}
