import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { 
  Box,
  Button,
  Flex, 
  Stack,
  useColorMode
} from "@chakra-ui/react";
import { ReactComponent as Hero } from "../assets/travelers.svg";
import Page from "../shared/custom/Page";
import { useAuth } from "../auth/Provider";

function Landing() {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Page includeFooter>
      <Flex
        direction={{base: "column", md: "row-reverse"}}
        align="center">
        <Box
          as={Hero}
          color="teal.500"
          width={{base: "xs", sm: "sm", md: "md"}}
          minWidth={{base: "xs", sm: "sm", md: "md"}}/>
        <Stack
          p={8}
          mt={{base: 8, md: 0}}
          mr={{base: 0, md: 16}}>
          <Box
            fontSize={{base: "3xl", md: "5xl"}}
            fontWeight="semibold">
            {t("home.heading")}
          </Box>
          <Box
            color={colorMode === 'dark' ? "gray.400" : "gray.500"}>
            {t("home.subheading")}
          </Box>
          <Box
            as="span" 
            py={8}>
            { user
              ? <Button>{t("button.go-to-dashboard")}</Button>
              : <>
                  <Button
                    onClick={() => navigate("/signin")}>
                    {t("button.sign-in")}
                  </Button>
                  <Box 
                    ml={2}
                    mr={1} 
                    as="span" 
                    color={colorMode === 'dark' ? "gray.500" : "gray.600"}>
                    {t("concat.or")}
                  </Box>
                  <Box as="span">
                    <Link to="/signup">{t("button.create-an-account")}</Link>
                  </Box>
                </>
            }
          </Box>
        </Stack>
      </Flex>
    </Page>
  )
}

export default Landing;