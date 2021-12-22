import { Box, Center, Flex } from "@chakra-ui/react";
import Header from "./Header";

const Page = ({title, children}) => {
  return (
    <Flex
      minH="100vh"
      maxW={{xl: "1200px"}}
      direction="column"
      align="start"
      m="0 auto">
      <Header/>
      <Box
        as="h4"
        px={8}
        fontSize={{base: 'md', md: '3xl'}}
        fontWeight="semibold">
        {title}
      </Box>
      <Center h="80vh" w="100%">
        {children}
      </Center>
    </Flex>
  )
}

export default Page;