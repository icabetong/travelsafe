import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { AlertOctagon } from "react-feather";
import { useAuth } from "../auth/Provider";
import Page from "../shared/custom/Page";
import supabase from "../core/Infrastructure";

function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();
  const [updating, setUpdating] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      let { data, error } = await supabase
        .from('vehicles')
        .select()
        .eq('driverId', user.id)
        .single()

      if (error)
        throw error;

      setData(data);
    }

    fetch();
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
    <Page title={t("navigation.dashboard")}>
      <Flex 
        w="100%"
        h="80vh"
        mt={12}
        direction={{base: "column-reverse", md: "row"}}>
        <DetailsPanel onSubmit={onSubmit} data={data} updating={updating}/>
        <RoutesPanel data={data}/>
      </Flex>
    </Page>
  );
}

function DetailsPanel({onSubmit, data, updating}) {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <Flex 
      as="form" 
      direction="column" 
      align="start" 
      justify="start" 
      flexGrow="1" 
      onSubmit={handleSubmit(onSubmit)}
      p={8}>
      <Text mb={6} fontWeight="semibold" fontSize="lg">{t("dashboard.vehicle-details")}</Text>
      <FormControl mb={4} isRequired>
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

function RoutesPanel({data}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [route, setRoute] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetch = async () => {
      let { data, error } = await supabase
        .from('routes')
        .select()
        .eq('driverId', user.id)
        .eq('finished', false)

      if (error)
        throw error;

      if (data.length > 0) {
        setRoute(data[0]);
      }
    }

    fetch().catch((e) => console.log(e) );
  }, [user.id, t, toast]);

  const onUpdate = async () => {
    setUpdating(true);
   
    let { error } = await supabase.from('routes').update({
      arrival: new Date().toISOString().toLocaleString('en-US'),
      finished: true
    });
    setUpdating(false);
    if (error) {
      toast({
        title: t("feedback.travel-update-error"),
        status: "error",
        isClosable: false,
      })
    } else {
      setRoute(undefined);
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    const travel = {
      departure: new Date().toISOString().toLocaleString("en-US"),
      driverId: user.id,
      ...data
    }

    let { error } = await supabase.from('routes').insert(travel);
    setSubmitting(false);
    if (error) {
      toast({
        title: t("feedback.travel-create-error"),
        status: "error",
        isClosable: true,
      })
    } else {
      setRoute(travel);
    }
  }

  return (
    <Flex 
      as="form" 
      direction="column"
      flexGrow="1" 
      p={8}
      onSubmit={handleSubmit(onSubmit)}>
      <Text
        fontWeight="semibold" 
        fontSize="lg">
        {t("dashboard.current-route")}
      </Text>
      <Text
        mb={4}>
        {t("info.about-routes")}
      </Text>
      { !data &&
        <Flex
          mb={6}
          p={4}
          color={colorMode === 'dark' ? "orange.300" : "orange.600"}
          border="1px"
          borderColor={colorMode === 'dark' ? "orange.300" : "orange.600"}
          borderRadius="md">
          <AlertOctagon/>
          <Box as="span" ms={2}>
            {t("info.missing-plate-number-no-travel")}
          </Box>
        </Flex>
      }
      <FormControl mb={2} isRequired>
        <FormLabel htmlFor='source'>{t("field.source")}</FormLabel>
        <Input 
          id='source' 
          type='text'
          isDisabled={route}
          placeholder={t("placeholder.source")}
          defaultValue={route && route.source}
          {...register('source')} />
        <FormErrorMessage>{t(errors.source && errors.source.message)}.</FormErrorMessage>
      </FormControl>
      <FormControl mb={8} isRequired>
        <FormLabel htmlFor='destination'>{t("field.destination")}</FormLabel>
        <Input 
          id='destination' 
          type='text'
          isDisabled={route}
          placeholder={t("placeholder.destination")}
          defaultValue={route && route.destination}
          {...register('destination')} />
        <FormErrorMessage>{t(errors.destination && errors.destination.message)}.</FormErrorMessage>
      </FormControl>
      <Box display="flex" justifyContent="end" w="100%">
      { route
        ? <Button
            onClick={onUpdate}
            isLoading={updating}>
            {t("button.complete-travel")}
          </Button>
        : <Button
            type="submit"
            isDisabled={!data}
            isLoading={submitting}>
            {t("button.start-travel")}
          </Button>
      }
      </Box>
    </Flex>
  )
}

export default Dashboard;