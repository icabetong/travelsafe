import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {  
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import Page from "../shared/custom/Page";
import { useAuth } from "./Provider";

function SignIn() {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const { email, password } = data;

    const { error } = await signIn({ email, password });
    setSubmitting(false);
    if (!error) {
      navigate("/dashboard");
    } else {
      toast({
        title: t("feedback.sign-in-error"),
        desc: error,
        status: "error",
        isClosable: true,
      });
    }
  }

  return (
    <Page>
      <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        direction="column"
        w={{base: "80%", md: "40%"}}
        maxW={{base: "80%", md: "40%"}}
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
        <FormControl mb={2} isInvalid={errors.email && errors.email} isRequired>
          <FormLabel htmlFor='email'>{t("field.email")}</FormLabel>
          <Input 
            id='email' 
            type='email'
            placeholder={t("placeholder.email")}
            {...register("email", { required: "feedback.auth_empty_email" })}/>
          <FormErrorMessage>{t(errors.email && errors.email.message)}</FormErrorMessage>
        </FormControl>
        <FormControl mb={8} isInvalid={errors.password && errors.password} isRequired>
          <FormLabel htmlFor='password'>{t("field.password")}</FormLabel>
          <Input 
            id='password' 
            type='password'
            placeholder={t("placeholder.password")}
            {...register("password", { required: "feedback.auth_empty_password", min: 8 })} />
          <FormErrorMessage>{t(errors.password && errors.password.message)}</FormErrorMessage>
        </FormControl>
        <Button
          mb={4}
          type="submit"
          maxW="60%"
          isLoading={submitting}>
          {t("button.sign-in")}
        </Button>
        <Button
          variant="link"
          onClick={() => navigate("/signup")}>
          {t("button.create-an-account")}
        </Button>
      </Flex>
    </Page>
  );
}

export default SignIn;