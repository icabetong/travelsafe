import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Stack,
  useColorMode,
  useBreakpointValue,
} from "@chakra-ui/react";
import { differenceInDays, format, formatRelative } from "date-fns";
import { useAuth } from "../../auth/Provider";
import supabase from "../../core/Infrastructure";
import { getPagination } from "../../shared/Tools";

function TravelsTab() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [travels, setTravels] = useState({ rows: [], count: 0 });
  const [travel, setTravel] = useState();

  const onOpen = (travel) => setTravel(travel);
  const onClose = () => setTravel(undefined);

  useEffect(() => {
    const fetch = async () => {
      const { from, to } = getPagination();
      const { data, error, count } = await supabase
        .from('travels')
        .select(`travelId, routes(source, destination, arrival, departure, finished, accounts!driverId(lastname, firstname))`)
        .eq('userId', user.id)
        .order('travelId', { ascending: true })
        .range(from, to);

      if (error) {}

      setTravels({ rows: data, count: count });
    }

    fetch();
  }, [user.id]);

  const DetailsModal = () => {
    const departure = Date.parse(travel.routes.departure);
    const arrival = Date.parse(travel.routes.arrival);
    const timePattern = "HH:mm a";
    const dateTimePattern = "HH:mm a - MMMM d yyyy"
    const departureOffset = differenceInDays(new Date(), Date.parse(departure));
    const arrivalOffset = differenceInDays(new Date(), Date.parse(arrival));

    return (
      <Modal isOpen={travel} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("dialog.travel-details")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction="column">
              <FormControl>
                <FormLabel htmlFor='source'>{t("field.source")}</FormLabel>
                <Input id='source' type='text' isReadOnly defaultValue={travel.routes.source}/>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='destination'>{t("field.destination")}</FormLabel>
                <Input id='destination' type='text' isReadOnly defaultValue={travel.routes.destination}/>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='departure'>{t("field.departure")}</FormLabel>
                <Input 
                  isReadOnly
                  id='departure' 
                  type='text' 
                  defaultValue={format(departure, departureOffset === 0 ? timePattern : dateTimePattern)}/>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='arrival'>{t("field.arrival")}</FormLabel>
                <Input 
                  isReadOnly
                  id='arrival' 
                  type='text'  
                  defaultValue={format(departure, arrivalOffset === 0 ? timePattern : dateTimePattern)}/>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='driver'>{t("field.driver")}</FormLabel>
                <Input 
                  isReadOnly
                  id='driver' 
                  type='text'  
                  defaultValue={`${travel.routes.accounts.firstname} ${travel.routes.accounts.lastname}`}/>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              {t("button.close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <>
      <Box w='100%'>
        <TravelList data={travels.rows} onClick={onOpen}/>
      </Box>
      { travel && <DetailsModal/> }
    </>
  )
}
export default TravelsTab;

function TravelList({data, onClick}) {
  const columns = useBreakpointValue({ base: 1, md: 3, lg: 4 });
  const { colorMode } = useColorMode();

  return (
    <SimpleGrid columns={columns} spacing={4} w="100%">
    { data.map((travel) => {
        return (
          <Button
            variant="outline"
            height="fit-content"
            key={travel.travelId}
            p={4}
            color='gray.500'
            onClick={() => onClick(travel)}>
            <Stack direction="column" justify="start">
              <Box fontSize="lg" fontWeight="bold" color={colorMode === 'dark' ? 'white' : 'gray.900'}>
                {`${travel.routes.source} - ${travel.routes.destination}`}
              </Box>
              <Box fontSize="sm" fontWeight="normal">
                { formatRelative(Date.parse(travel.routes.departure), new Date()) }
              </Box>
            </Stack>
          </Button>
        );
      })
    }
    </SimpleGrid>
  )
}