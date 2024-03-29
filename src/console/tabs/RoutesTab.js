import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spacer,
  Stack,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue
} from "@chakra-ui/react";
import { RefreshCw, Filter, MoreVertical } from "react-feather";
import { format } from "date-fns";
import supabase from "../../core/Infrastructure";
import Paginate from "../../shared/custom/Pagination";
import PopoverForm from "../../shared/custom/PopoverForm";
import { getPagination } from "../../shared/Tools"; 

function RoutesTab() {
  const { t } = useTranslation();
  const [timestamp, setTimestamp] = useState(new Date());
  const [data, setData] = useState({ row: [], count: 0 });
  const [page, setPage] = useState(0);
  const { register, handleSubmit } = useForm();
  const [filters, setFilters] = useState({ inactive: false });
  const [route, setRoute] = useState();
  const [passengers, setPassengers] = useState({ row: [], count: 0, error: undefined });
  const showList = useBreakpointValue({base: true, md: false});

  const onRoutePassengersView = (route) => setRoute(route);
  const onRoutePassengersDispose = () => {
    setRoute(undefined);
    setPassengers({ row: [], count: 0, error: undefined })
  }

  useEffect(() => {
    let unmounted = false;

    const fetch = async () => {
      const { data, count, error } = await supabase
        .from('travels')
        .select('routeId, accounts(id, lastname, firstname, contact)', { count: 'exact' })
        .order('routeId', { ascending: true })
        .eq('routeId', route.routeId)

      if (error) {
        setPassengers({ error: error });
      }

      if (!unmounted) {
        setPassengers({ row: data, count: count });
      }
    }

    if (route) {
      fetch();
    }
    return () => {
      unmounted = true;
    }
  }, [route]);

  useEffect(() => {
    let unmounted = false;
    
    const fetch = async () => {
      const { from, to } = getPagination(page);
      let query = supabase
        .from('routes')
        .select(`routeId, source, destination, departure, arrival, accounts!driverId(id, lastname, firstname)`, { count: "exact" })
        .order('source', { ascending: true })
        .range(from, to);

      if (!filters.inactive) {
        query = query.eq('finished', false)
      }
      if (filters.source) {
        query = query.ilike('source', `%${filters.source}%`)
      }
      if (filters.destination) {
        query = query.ilike('destination', `%${filters.destination}%`)
      }

      let { data, count } = await query;
      if (!unmounted) {
        setData({ row: data, count: count });
      }
    }

    fetch();
    return () => {
      unmounted = true;
    }
  }, [page, timestamp, filters]);
  
  const onPageChanged = (page) => {
    setPage(page.selected);
  }

  return (
    <Flex w="100%" direction="column">
      <Stack direction="row" mb="2" spacing={2}>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw size={16}/>}
          onClick={() => setTimestamp(new Date())}>
          {t("button.refresh")}
        </Button>
        <PopoverForm
          header={
            <Box>{t("dialog.filter")}</Box>
          }
          trigger={
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter size={16}/>}>
              {t("button.filter")}
            </Button>}>
          <Stack 
            as="form" 
            direction="column" 
            align='center'
            onSubmit={handleSubmit(setFilters)}>
            <FormControl display='flex' alignItems='center'>
              <FormLabel htmlFor='inactive' mb='0'>
                {t("field.inactive-routes")}
              </FormLabel>
              <Switch id='inactive' {...register('inactive')}/>    
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='inactive'>{t("field.with-source")}</FormLabel>
              <Input
                type="text"
                id='source'
                size='sm'
                {...register('source')}/>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='inactive'>{t("field.with-destination")}</FormLabel>
              <Input
                type="text"
                id='destination'
                size='sm'
                {...register('destination')}/>
            </FormControl>
            <Button
              mt={2}
              size='sm'
              type="submit">
              {t("button.filter")}
            </Button>
          </Stack>
        </PopoverForm>
      </Stack>
      { data && data.row.length > 0
        ? showList 
          ? <RoutesList data={data}/>
          : <RoutesTable data={data} onViewPassengers={onRoutePassengersView}/>
        : <Box w='100%' h='100%'>
            <Center h='100%'>
              <Box fontWeight='medium'>
                {t('feedback.empty-routes')}
              </Box>
            </Center>
          </Box>
      }
      <Spacer/>
      { data && data.row.length > 0
        && <Paginate
              onPageChange={onPageChanged}
              pageCount={Math.ceil(data.count / 10)}
              currentPage={page}/>
      }
      {
        <Modal isOpen={route} onClose={onRoutePassengersDispose} scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("dialog.passengers")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              { passengers &&
                  <PassengerList data={passengers.row}/>
              }
            </ModalBody>

            <ModalFooter>
              <Button
                mr={2}
                onClick={onRoutePassengersDispose}>
                {t("button.close")}
              </Button>
              <Button
                variant='ghost'>
                {t("button.send-sms")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }
    </Flex>
  );
}

export default RoutesTab;

function RoutesTable({ data, onViewPassengers }) {
  const { t } = useTranslation();

  return (
    <Table size="sm" variant="simple">
      <Thead>
        <Tr>
          <Th>{t("field.source")}</Th>
          <Th>{t("field.destination")}</Th>
          <Th>{t("field.departure")}</Th>
          <Th>{t("field.arrival")}</Th>
          <Th>{t("field.driver-name")}</Th>
          <Th>{t("field.actions")}</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.row.map((row) => {
            return (
              <Tr key={row.routeId}>
                <Td>{row.source}</Td>
                <Td>{row.destination}</Td>
                <Td>
                { row.departure
                  ? format(Date.parse(row.departure), 'h:mm a - MMMM d yyyy')
                  : t("info.not-departed")
                }
                </Td>
                <Td>
                { row.arrival 
                  ? format(Date.parse(row.arrival), 'h:mm a - MMMM d yyyy')
                  : t("info.not-arrived")
                }
                </Td>
                <Td>{`${row.accounts.firstname} ${row.accounts.lastname}`}</Td> 
                <Td>
                  <Box d='flex' align='center' justifyContent='center'>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        size='xs'
                        colorScheme='gray'
                        variant='ghost'
                        icon={<MoreVertical size={16}/>}/>
                        <MenuList>
                        <MenuItem onClick={() => onViewPassengers(row)}>
                          {t("button.view-passengers")}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </Td>
              </Tr>
            );
          })
        }
      </Tbody>
    </Table>
  );
}

function RoutesList({data}) {
  return (
    <Box mt={2}>
      { data.row.map((route) => {
          return <RouteListItem key={route.routeId} route={route}/>
        })
      }
    </Box>
  )
}

function RouteListItem({route}) {
  const pattern = "H:mm aa - m/d/yy";

  return (
    <Stack direction='column' spacing={0} py={4}>
      <Box fontWeight='semibold'>
        {`${route.source} - ${route.destination}`}
      </Box>
      <Box fontSize='sm' color='gray.400'>
        {`${format(Date.parse(route.departure), pattern)}`}
      </Box>
      <Box fontSize="sm" color='gray.400'>
        {`${route.accounts.firstname} ${route.accounts.lastname}`}
      </Box>
    </Stack>
  );
}

function PassengerList({data}) {
  return (
    <Box>
      {data.map((passenger) => {
        return (
          <PassengerListItem
            key={passenger.accounts.id}
            passenger={passenger}/>
        )
      })}
    </Box>
  )
}

function PassengerListItem({ passenger }) {
  return (
    <Box>
      <Box>
        {`${passenger.accounts.firstname} ${passenger.accounts.lastname}`}
      </Box>
      <Box fontSize='sm' color='gray.500'>
        {passenger.accounts.contact}
      </Box>
    </Box>
  )
}