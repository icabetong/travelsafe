import { Flex } from "@chakra-ui/react";
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
      {children}
    </Flex>
  )
}

export default Page;