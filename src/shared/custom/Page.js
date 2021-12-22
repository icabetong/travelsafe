import { Center, Flex } from "@chakra-ui/react";
import Header from "./Header";

const Page = ({children}) => {
  return (
    <Flex
      minH="100vh"
      maxW={{xl: "1200px"}}
      direction="column"
      align="center"
      m="0 auto">
      <Header/>
      <Center h="80vh" w="100%">
      {children}
      </Center>
    </Flex>
  )
}

export default Page;