import { Box, Center, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Header from "./Header";

const Page = (props) => {
  const { title, children, includeFooter } = props;

  return (
    <Flex
      minH="100vh"
      direction="column">
      <Flex
        w="100%"
        flexGrow="2"
        direction="column"
        align="start"
        m="0 auto"
        maxW={{xl: "1200px"}}>
        <Header/>
        {title &&
          <Box
            as="h4"
            px={8}
            fontSize={{base: 'md', md: '3xl'}}
            fontWeight="semibold">
            {title}
          </Box>
        }
        <Center flexGrow="3" w="100%">
          {children}
        </Center>
      </Flex>
      { includeFooter && <Footer flexGrow="1"/> }
    </Flex>
  )
}

export default Page;