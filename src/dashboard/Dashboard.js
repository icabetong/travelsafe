import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../auth/Provider";
import Page from "../shared/custom/Page";
import supabase from "../core/Infrastructure";

function Dashboard() {
  const { t } = useTranslation();

  return (
    <Page title={t("navigation.dashboard")}>
      <Flex 
        w="100%"
        h="80vh"
        direction={{base: "column", md: "row"}}>
        <DetailsPanel/>
        <RoutesPanel/>
      </Flex>
    </Page>
  );
}

function DetailsPanel() {
  const { t } = useTranslation();
  const [updating, setUpdating] = useState(false);
  const [data, setData] = useState();
  const { user } = useAuth();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetch = async () => {
      let { data, error } = await supabase
        .from('vehicles')
        .select()
        .eq('driverId', user.id)
        .single()

      if (error) {
        throw error;
      }

      setData(data);
    }

    fetch()
      .catch((error) => toast({
        title: error,
        desc: error,
        status: "error",
        isClosable: true,
      }));
  }, [user.id, toast, t]);

  const onSubmit = async (data) => {
    setUpdating(true);
    const row = {
      plateNumber: data.plate,
      driverId: user.id
    }

    let { error } = await supabase.from('vehicles').insert(row);
    setUpdating(false);
    if (error) {
      toast({
        title: t("feedback.plate-number-update-error"),
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: t("feedback.plate-number-update"),
        status: "success",
        isClosable: true,
      })
    }
  }
  
  return (
    <Flex 
      as="form" 
      direction="column" 
      align="start" 
      justify="start" 
      flexGrow="1" 
      onSubmit={handleSubmit(onSubmit)}
      p={8}>
      <Text fontWeight="semibold" fontSize="lg">{t("dashboard.vehicle-details")}</Text>
      <FormControl mb={4}>
        <FormLabel htmlFor='plate'>{t("field.vehicle-plate-number")}</FormLabel>
        <InputGroup>
          <Input 
            id='plate' 
            type='text'
            pr='4.5rem'
            defaultValue={data && data.plateNumber}
            {...register("plate")}/>
          <InputRightElement
            width="4.5rem">
            <Button 
              colorScheme="gray" 
              h='1.75rem' 
              size='sm' 
              type="submit"
              isLoading={updating}>
              {t("button.save")}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{t(errors.plate && errors.plate.message)}</FormErrorMessage>
      </FormControl>
    </Flex>
  )
}

function RoutesPanel() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {

  }

  return (
    <Flex 
      as="form" 
      direction="column" 
      flexGrow="1" 
      p={8}
      onSubmit={handleSubmit(onSubmit)}>
      <Text fontWeight="semibold" fontSize="lg">{t("dashboard.current-route")}</Text>
      <FormControl mb={2}>
        <FormLabel htmlFor='departure'>{t("field.departure")}</FormLabel>
        <Input 
          id='departure' 
          type='text'
          {...register('departure')} />
        <FormErrorMessage>{t(errors.departure && errors.departure.message)}.</FormErrorMessage>
      </FormControl>
      <FormControl mb={2}>
        <FormLabel htmlFor='destination'>{t("field.destination")}</FormLabel>
        <Input 
          id='destination' 
          type='text'
          {...register('destination')} />
        <FormErrorMessage>{t(errors.destination && errors.destination.message)}.</FormErrorMessage>
      </FormControl>
    </Flex>
  )
}

export default Dashboard;