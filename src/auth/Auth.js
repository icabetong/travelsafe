import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {  
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import Page from "../shared/custom/Page";

function Auth() {
  const { type } = useParams();
  const { t } = useTranslation();

  return (
    <Page>
      <Flex
        direction="column"
        w="50%"
        maxW="50%"
        p={12}
        align="center"
        justify="center"
        border="1px"
        borderColor="gray.500"
        borderRadius="md">
        <Box
          as="h4"
          fontSize="2xl"
          fontWeight="semibold">
          {t("auth.sign-in")}
        </Box>
        <Box
          mb={8}>
          {t("auth.sign-in-subtitle")}
        </Box>
        <FormControl mb={2}>
          <FormLabel htmlFor='email'>{t("field.email")}</FormLabel>
          <Input id='email' type='email' />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>
        <FormControl mb={8}>
          <FormLabel htmlFor='password'>{t("field.password")}</FormLabel>
          <Input id='password' type='password' />
          <FormHelperText></FormHelperText>
        </FormControl>
        <Button
          maxW="60%">
          {t("button.sign-in")}
        </Button>
      </Flex>
    </Page>
  );
}

export default Auth;