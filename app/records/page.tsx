'use client'

import { Card, Spinner, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Records() {

    let [isLoading, setLoading] = useState(false);
    let [records, setRecords] = useState([]);

    const getRecords = async () => {
        try {
            setLoading(true);
            let response = await axios({
                method: 'GET',
                url: process.env.NEXT_PUBLIC_URL + '/entries'
            });
            let recordsInStrings = response.data.map((eachdata: any) => {
                let strings: string[] = [];
                Object.keys(eachdata).map(x => {
                    strings.push(x + ": " + eachdata[x]);
                });
                return strings;
            })
            setRecords(recordsInStrings);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert("Something went wrong. Could not load");
        }
    }

    useEffect(() => {
        getRecords();
    }, []);

    if(isLoading) {
        return <Spinner />
    }

    if(records && records.length > 0) {
        return (
            <Stack m={4}>
                {records.map((eachrecord: any, index: number) => 
                    <Card key={"eachrecord-card-"+index}>
                        {eachrecord.map((eachFieldString: string, index2: number) => <Text key={'eachrecord-text-card-' + index + '-' + index2}>{eachFieldString}</Text>)}
                    </Card>
                )}
            </Stack>
        );
    } else {
        return(<div><Text>{"No data found."}</Text></div>)
    }
}