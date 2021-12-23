import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {  
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  useDisclosure,
  useColorMode
} from "@chakra-ui/react";
import Page from "../shared/custom/Page";
import { useAuth } from "./Provider";

function SignUp() {
  const { t } = useTranslation();
  const { user, signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { open, onOpen, onClose } = useDisclosure();

  const onSubmit = async (data) => {
    setSubmitting(true);
    const { email, password } = data;

    const { error } = await signUp({email, password});
    setSubmitting(false);
    if (!error) {
      onOpen();
    } else {
      toast({
        title: t("feedback.sign-up-error"),
        desc: error,
        status: "error",
        isClosable: true
      });
    }
  }

  return (
    <Page>
      <Center
        w="100%">
        <AuthForm onSubmit={onSubmit} submitting={submitting}/>
      </Center>
      <Modal isOpen={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("auth.sign-up-confirm")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              {t("auth.sign-up-subtitle-confirm")}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => navigate("/")}>
              {t("button.back-to-home")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
}

function AuthForm(props) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(props.onSubmit)}
      direction="column"
      w={{base: "80%", md: "40%"}}
      maxW={{base: "80%", md: "40%"}}
      p={12}
      align="center"
      justify="center"
      border="1px"
      borderColor={colorMode === 'dark' ? "gray.500" : "gray.300"}
      borderRadius="md">
      <Box
        as="h4"
        fontSize="2xl"
        fontWeight="semibold">
        {t("auth.sign-up")}
      </Box>
      <Box
        mb={8}
        color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>
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
        <FormLabel htmlFor='confirmpassword'>{t("field.confirm-password")}</FormLabel>
        <Input 
          id='confirmpassword' 
          type='password'
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
        maxW="60%"
        type="submit"
        isLoading={props.submitting}>
        {t("button.sign-up")}
      </Button>
      <Button
        variant="link"
        onClick={() => navigate("/signin")}>
        {t("button.use-an-existing-account")}
      </Button>
    </Flex>
  )
}



export default SignUp;