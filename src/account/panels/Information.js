import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Calendar } from "@uselessdev/datepicker";
import { Calendar as DateIcon, ChevronLeft, ChevronRight } from "react-feather";
import { format } from "date-fns";
import supabase from "../../core/Infrastructure";
import { useAuth } from "../../auth/Provider";

function InformationPanel() {
  const { t } = useTranslation();
  const toast = useToast();
  const { user, profile } = useAuth();
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [updating, setUpdating] = useState(false);
  const [date, setDate] = useState(new Date(profile.birthdate));

  const onSubmit = async (data) => {
    setUpdating(true);
    const account = {
      ...data,
      birthdate: date.toISOString().toLocaleString('en-US'),
    }

    let { errors } = await supabase.from('accounts').update(account).match({id: user.id});
    setUpdating(false);
    if (errors) {
      toast({
        title: t("feedback.account-update-error"),
        status: "error",
        isClosable: true
      });
    } else {
      toast({
        title: t("feedback.account-updated"),
        status: "success",
        isClosable: true
      })
    }
  }

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      direction="column"
      align="center"
      justify="center">
      <FormControl mb={2} isInvalid={errors.lastname && errors.lastname} isRequired>
        <FormLabel htmlFor='lastname'>{t("field.lastname")}</FormLabel>
        <Input 
          id='lastname' 
          type='text'
          defaultValue={profile.lastname}
          {...register("lastname", { 
            required: "feedback.auth_empty_lastname",
          })
          } />
        <FormErrorMessage>{t(errors.lastname && errors.lastname.message)}</FormErrorMessage>
      </FormControl>
      <FormControl mb={2} isInvalid={errors.firstname && errors.firstname} isRequired>
        <FormLabel htmlFor='firstname'>{t("field.firstname")}</FormLabel>
        <Input 
          id='firstname' 
          type='text'
          defaultValue={profile.firstname}
          {...register("firstname", { 
            required: "feedback.auth_empty_firstname", 
          })
          } />
        <FormErrorMessage>{t(errors.firstname && errors.firstname.message)}</FormErrorMessage>
      </FormControl>
      <FormControl mb={2} isInvalid={errors.address && errors.address} isRequired>
        <FormLabel htmlFor='address'>{t("field.address")}</FormLabel>
        <Input 
          id='address' 
          type='text'
          defaultValue={profile.address}
          {...register("address", { 
            required: "feedback.auth_empty_address", 
          })
          } />
        <FormErrorMessage>{t(errors.address && errors.address.message)}</FormErrorMessage>
      </FormControl>
      <FormControl mb={2}>
        <FormLabel htmlFor='gender'>{t("field.gender")}</FormLabel>
        <Select id='gender' defaultValue={profile.gender} {...register("gender", { required: "feedback.auth_empty_gender"})}>
          <option value="male">{t("types.male")}</option>
          <option value="female">{t("types.female")}</option>
        </Select>
      </FormControl>
      <FormControl mb={2}>
        <FormLabel htmlFor='birthdate'>{t("field.birthdate")}</FormLabel>
        <Popover>
          <PopoverTrigger>
            <Stack>
              <InputGroup>
                <Input pr="2.5rem" value={format(date, "MMMM d yyyy")} readOnly/>
                <InputRightElement width="2.5rem">
                  <IconButton 
                    size='sm' 
                    variant='ghost'
                    colorScheme="gray" 
                    icon={<DateIcon/>}/>
                </InputRightElement>
              </InputGroup>
            </Stack>
          </PopoverTrigger>
          <PopoverContent >
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{t("dialog.select-date")}</PopoverHeader>
            <PopoverBody
              paddingInlineStart={0}
              paddingInlineEnd={0}>
              <Calendar
                value={date}
                singleMonth
                singleDateSelection
                onSelectDate={setDate}
                prevButton={props => (
                  <IconButton 
                    size="xs"
                    icon={<ChevronLeft/>}
                    {...props}/>
                )}
                nextButton={props => (
                  <IconButton
                    size="xs"
                    icon={<ChevronRight/>}
                    {...props}/>
                )}/>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        
      </FormControl>
      <FormControl mb={2} isInvalid={errors.contact && errors.contact} isRequired>
        <FormLabel htmlFor='contact'>{t("field.contact")}</FormLabel>
        <InputGroup>
          <InputLeftAddon children="+63"/>
          <Input 
            id='contact' 
            type='tel'
            defaultValue={profile.contact}
            {...register("contact", { 
              required: "feedback.auth_empty_contact", 
              min: 8,
            })
            } />
          </InputGroup>
        <FormErrorMessage>{t(errors.contact && errors.contact.message)}</FormErrorMessage>
      </FormControl>
      <FormControl mb={8}>
        <FormLabel htmlFor='type'>{t("field.type")}</FormLabel>
        <Select id='type' defaultValue={profile.type} {...register("type", { required: "feedback.auth_empty_type"})}>
          <option value="passenger">{t("types.passenger")}</option>
          <option value="driver">{t("types.driver")}</option>
        </Select>
      </FormControl>
      <Button
        mb={4}
        maxW="60%"
        isLoading={updating}
        type="submit">
        {t("button.save")}
      </Button>
    </Flex>
  )
}
export default InformationPanel;