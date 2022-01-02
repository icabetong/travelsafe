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
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useToast,
  useColorMode
} from "@chakra-ui/react";
import { Calendar } from "react-feather";
import { format } from "date-fns";
import Page from "../shared/custom/Page";
import DatePicker from "../shared/custom/DatePicker";
import { useAuth } from "./Provider";
import supabase from "../core/Infrastructure";

function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [exists, setExists] = useState();

  const onSubmit = async (data) => {
    setSubmitting(true);
    const { email, password } = data;
    const { user, error } = await signIn({ email, password });
    setSubmitting(false);
    if (user && !error) {
      let { data } = await supabase.from('accounts').select().eq('id', user.id);
      if (data && data.length > 0) {
        navigate("/");
      } else {
        setExists(user.id);
      }
    } else {
      toast({
        title: t("feedback.sign-in-error"),
        desc: error,
        status: "error",
        isClosable: true,
      });
    }
  }

  const onContinueSubmit = async (data) => {
    setSubmitting(true);
    const user = {
      id: exists,
      ...data
    }

    let { error } = await supabase.from('accounts').insert([user]);
    setSubmitting(false);
    if (error) {
      toast({
        title: t("feedback.sign-in-error"),
        desc: error,
        status: "error",
        isClosable: true,
      });
    } else {
      navigate("/")
    }
  }

  return (
    <Page>
      { exists
        ? <InfoForm 
            onSubmit={onContinueSubmit} 
            submitting={submitting}/>
        : <AuthForm 
            onSubmit={onSubmit} 
            submitting={submitting}/>
      }
    </Page>
  );
}

function AuthForm(props) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode(); 
  const { handleSubmit, register, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);

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
        {t("auth.sign-in")}
      </Box>
      <Box
        mb={8}
        color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>
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
        <InputGroup>
          <Input 
            id='password' 
            type={show ? 'text' : 'password'}
            pr='4.5rem'
            placeholder={t("placeholder.password")}
            {...register("password", { required: "feedback.auth_empty_password", min: 8 })} />
          <InputRightElement width='4.5rem'>
            <Button h='1.5rem' size='sm' onClick={handleShow} colorScheme='gray'>
              {t(show ? "button.hide" : "button.show")}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{t(errors.password && errors.password.message)}</FormErrorMessage>
      </FormControl>
      <Button
        mb={4}
        type="submit"
        maxW="60%"
        isLoading={props.submitting}>
        {t("button.sign-in")}
      </Button>
      <Button
        variant="link"
        onClick={() => navigate("/signup")}>
        {t("button.create-an-account")}
      </Button>
    </Flex>
  );
}

function InfoForm(props) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const [date, setDate] = useState(new Date());
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const onSubmit = (data) => {
    props.onSubmit({
      birthdate: date.toISOString().toLocaleString('en-US'),
      ...data
    })
  }

  return (
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
      borderColor={colorMode === 'dark' ? "gray.500" : "gray.300"}
      borderRadius="md">
      <Box
        as="h4"
        fontSize="2xl"
        fontWeight="semibold">
        {t("auth.few-more-info")}
      </Box>
      <Box
        mb={8}
        color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}>
        {t("auth.few-more-info-subtitle")}
      </Box>
      <FormControl mb={2} isInvalid={errors.lastname && errors.lastname} isRequired>
        <FormLabel htmlFor='lastname'>{t("field.lastname")}</FormLabel>
        <Input 
          id='lastname' 
          type='text'
          placeholder={t("placeholder.lastname")}
          {...register("lastname", { 
            required: "feedback.auth_empty_lastname", 
            min: 8,
            validate: value => value === getValues("lastname")
          })
          } />
        <FormErrorMessage>{t(errors.lastname && errors.lastname.message)}</FormErrorMessage>
      </FormControl>
      <FormControl mb={2} isInvalid={errors.firstname && errors.firstname} isRequired>
        <FormLabel htmlFor='firstname'>{t("field.firstname")}</FormLabel>
        <Input 
          id='firstname' 
          type='text'
          placeholder={t("placeholder.firstname")}
          {...register("firstname", { 
            required: "feedback.auth_empty_firstname", 
            min: 8,
            validate: value => value === getValues("firstname")
          })
          } />
        <FormErrorMessage>{t(errors.firstname && errors.firstname.message)}</FormErrorMessage>
      </FormControl>
      <FormControl mb={2} isInvalid={errors.address && errors.address} isRequired>
        <FormLabel htmlFor='address'>{t("field.address")}</FormLabel>
        <Input 
          id='address' 
          type='text'
          placeholder={t("placeholder.address")}
          {...register("address", { 
            required: "feedback.auth_empty_address", 
            min: 8,
            validate: value => value === getValues("address")
          })
          } />
        <FormErrorMessage>{t(errors.address && errors.address.message)}</FormErrorMessage>
      </FormControl>
      <FormControl mb={2}>
        <FormLabel htmlFor='gender'>{t("field.gender")}</FormLabel>
        <Select id='gender' placeholder={t("placeholder.gender")} {...register("gender", { required: "feedback.auth_empty_gender"})}>
          <option value="male">{t("types.male")}</option>
          <option value="female">{t("types.female")}</option>
        </Select>
      </FormControl>
      <FormControl mb={2}>
        <FormLabel htmlFor='birthdate'>{t("field.birthdate")}</FormLabel>
        <DatePicker date={date} setDate={setDate}>
          <InputGroup>
            <Input pr="2.5rem" value={format(date, "MMMM d yyyy")} readOnly/>
            <InputRightElement width="2.5rem">
              <IconButton 
                size='sm' 
                variant='ghost'
                colorScheme="gray" 
                icon={<Calendar size={16}/>}/>
            </InputRightElement>
          </InputGroup>
        </DatePicker>
      </FormControl>
      <FormControl mb={2} isInvalid={errors.contact && errors.contact} isRequired>
        <FormLabel htmlFor='contact'>{t("field.contact")}</FormLabel>
        <Input 
          id='contact' 
          type='tel'
          placeholder={t("placeholder.contact")}
          {...register("contact", { 
            required: "feedback.auth_empty_contact", 
            min: 8,
            validate: value => value === getValues("contact")
          })
          } />
        <FormErrorMessage>{t(errors.contact && errors.contact.message)}</FormErrorMessage>
      </FormControl>
      <FormControl mb={8}>
        <FormLabel htmlFor='type'>{t("field.type")}</FormLabel>
        <Select id='type' placeholder={t("placeholder.type")} {...register("type", { required: "feedback.auth_empty_type"})}>
          <option value="passenger">{t("types.passenger")}</option>
          <option value="driver">{t("types.driver")}</option>
        </Select>
      </FormControl>
      <Button
        mb={4}
        maxW="60%"
        isLoading={props.submitting}
        type="submit">
        {t("button.save")}
      </Button>
    </Flex>
  );
}

export default SignIn;