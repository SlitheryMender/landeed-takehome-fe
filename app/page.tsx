import Image from "next/image";
import styles from "./page.module.css";
import { Box, Button, Center, Container, Stack } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
    <Center mb={4}>
      <Button colorScheme="blue"><Link href={'/form'}>Submit new entry</Link></Button>
    </Center>
    <Center mb={4}>
      <Button colorScheme="teal"><Link href={'/records'}>View Entries</Link></Button>
      {/* <Button><Link href={'/form'}>Submit new entry</Link></Button> */}
    </Center>
    <Center>
      <Button colorScheme="green"><Link href={'/config'}>Font Config</Link></Button>
      {/* <Button><Link href={'/form'}>Submit new entry</Link></Button> */}
    </Center>
    </Container>
  );
}
