import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  useBreakpointValue
} from "@chakra-ui/react";
import Page from "./shared/custom/Page";
import { ReactComponent as Figure } from "./assets/holdup.svg";

function ErrorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const width = useBreakpointValue({base: '18em', sm: '24em', md: '36em'});

  return (
    <Page>
      <Flex 
        direction='column'
        align='center'
        justify='center'>
        <Figure width={width}/>
        <Box
          mt={8}
          fontWeight="bold"
          fontSize={{base: '2xl', md: '3xl'}}>
          {t("feedback.invalid-route")}
        </Box>
        <Box
          mt={2}
          color="gray.500"
          textAlign='center'
          fontSize='md'>
          {t("feedback.invalid-route-subtitle")}
        </Box>
        <Button
          mt={8}
          onClick={() => navigate("/")}>
          {t("button.back-to-home")}
        </Button>
      </Flex>
    </Page>
  )
}

export default ErrorPage;