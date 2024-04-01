import Image from "next/image";
import styles from "./page.module.css";
import { Button, Center, Stack } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Stack>
    <Center>
      <Button><Link href={'/form'}>Submit new entry</Link></Button>
    </Center>
    <Center>
      <Button><Link href={'/records'}>View Entries</Link></Button>
      {/* <Button><Link href={'/form'}>Submit new entry</Link></Button> */}
    </Center>
    </Stack>
  );
}
