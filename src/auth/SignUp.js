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
  Stack,
  useToast,
} from "@chakra-ui/react";
import Page from "../shared/custom/Page";
import { useAuth } from "./Provider";

function SignUp() {
  const { t } = useTranslation();
  const { handleSubmit, register, formState: { errors }, getValues } = useForm();
  const { signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [emailConfirm, setEmailConfirm] = useState();

  const onSubmit = async (data) => {
    setSubmitting(true);
    const { email, password } = data;

    const { error } = await signUp({email, password});
    setSubmitting(false);
    if (!error) {
      setEmailConfirm(email);
    } else {
      toast({
        title: t("feedback.sign-up-error"),
        desc: error,
        status: "error",
        isClosable: true
      });
    }
  }

  const form = (
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
        {t("auth.sign-up")}
      </Box>
      <Box
        mb={8}>
        {t("auth.sign-up-subtitle")}
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
      <FormControl mb={2} isInvalid={errors.password && errors.password} isRequired>
        <FormLabel htmlFor='password'>{t("field.password")}</FormLabel>
        <Input 
          id='password' 
          type='password'
          placeholder={t("placeholder.password")}
          {...register("password", { 
            required: "feedback.auth_empty_password", 
            min: 8,
            validate: value => value === getValues("confirmpassword")
          })
          } />
        <FormErrorMessage>{t(errors.password && errors.password.message)}</FormErrorMessage>
      </FormControl>
      <FormControl mb={8} isInvalid={errors.password && errors.password} isRequired>
        <FormLabel htmlFor='password'>{t("field.password")}</FormLabel>
        <Input 
          id='confirmpassword' 
          type='confirmpassword'
          placeholder={t("placeholder.confirm-password")}
          {...register("password", { 
            required: "feedback.auth_empty_password", 
            min: 8,
            validate: value => value === getValues("password")
          })
          } />
        <FormErrorMessage>{t(errors.password && errors.password.message)}</FormErrorMessage>
      </FormControl>
      <Button
        mb={4}
        type="submit"
        maxW="60%"
        isLoading={submitting}>
        {t("button.sign-up")}
      </Button>
      <Button
        variant="link"
        onClick={() => navigate("/signin")}>
        {t("button.use-an-existing-account")}
      </Button>
    </Flex>
  )

  const feedback = (
    <Stack>
      <Box
        as="h4"
        fontSize="2xl"
        fontWeight="semibold">
        {t("auth.sign-up-confirm")}
      </Box>
      <Box
        mb={16}>
        {t("auth.sign-up-subtitle-confirm")}
      </Box>
      <Button onClick={() => navigate("/")}>
        {t("button.back-to-home")}
      </Button>
    </Stack>
  )

  return (
    <Page>
      {!emailConfirm ? form : feedback}
    </Page>
  );
}

export default SignUp;