import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
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
  Radio,
  RadioGroup,
  Spacer,
  Spinner,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  useToast,
  useDisclosure
} from "@chakra-ui/react";
import { Edit, RefreshCw, MoreVertical, Filter } from "react-feather";
import { format } from "date-fns";
import supabase from "../../core/Infrastructure";
import PopoverBox from "../../shared/custom/PopoverBox";
import DatePicker from "../../shared/custom/DatePicker";
import Paginate from "../../shared/custom/Pagination";
import PopoverForm from "../../shared/custom/PopoverForm";
import { getPagination } from "../../shared/Tools"; 

function DriverTab() {
  const { t } = useTranslation();
  const [timestamp, setTimestamp] = useState(new Date());
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ row: [], count: 0 });
  const [verification, setVerification] = useState();
  const [downloading, setDownloading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ status: 'all' });
  const [image, setImage] = useState();
  const [account, setAccount] = useState();
  const [histories, setHistories] = useState({ rows: [], count: 0, error: undefined });
  const toast = useToast();
  const showList = useBreakpointValue({base: true, md: false});
  const { register, handleSubmit } = useForm();

  const onVerificationInvoke = (user) => setVerification(user);
  const onVerificationDispose = () => setVerification(undefined);

  const onAccountHistoryInvoked = (account) => setAccount(account);
  const onAccountHistoryDisposed = () => {
    setAccount(undefined);
    setHistories({ rows: [], count: 0, error: undefined });
  }

  useEffect(() => {
    let unmounted = false;
    const fetch = async () => {
      const { data, error, count } = await supabase
        .from('travels')
        .select(`travelId, routes(source, destination, arrival, departure, finished, accounts!driverId(lastname, firstname))`)
        .eq('userId', account.id)
        .order('travelId', { ascending: true })
        
      if (error) {
        setHistories({ error: error });
      }

      if (!unmounted) {
        setHistories({ row: data, count: count });
      }
    }

    if (account) {
      fetch();
    }
    return () => {
      unmounted = true;
    }
  }, [account])

  useEffect(() => {
    let unmounted = false;
    const fetch = async () => {
      if (verification) {
        setDownloading(true);
        const { data } = await supabase.storage
          .from('verification-ids')
          .download(`${verification.id}.png`);

        if (!unmounted) {
          setDownloading(false);
        }
        if (data) {
          let reader = new FileReader();
          reader.readAsDataURL(data);

          reader.onloadend = function() {
            if (!unmounted) {
              setImage(reader.result);
            }
          }
        }
      }
    }

    fetch();
    return () => {
      unmounted = true;
    }
  }, [verification]);

  useEffect(() => {
    let unmounted = false;
    const fetch = async () => {
      const { from, to } = getPagination(page);
      let query = supabase
        .from('drivers')
        .select()
        .order('lastname', { ascending: true })
        .range(from, to);

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, count } = await query;
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

  const onVerify = async () => {
    setSubmitting(true);
    function onError() {
      toast({
        title: t("feedback.error-generic"),
        status: "error",
        isClosable: true,
      });
    }
    if (!verification) {
      onError();
      return;
    }

    let { error } = await supabase 
      .from('accounts')
      .update({ status: 'verified' })
      .eq('id', verification.id)

    setSubmitting(false);
    if (!error) {
      onVerificationDispose();
      toast({
        title: t("feedback.user-verification-updated"),
        status: "success",
        isClosable: true,
      });
    } else onError();
  }

  const onSubmit = async (data) => {
    const table = data.hasOwnProperty('plateNumber') ? 'vehicles' : 'accounts';
    const { id, ...row } = data;
  
    let { error } = await supabase.from(table).update(row).eq('id', id);
    if (error) {
      toast({
        title: t("feedback.data-update-error"),
        status: "error",
        isClosable: true,
      })
    } else {
      toast({
        title: t("feedback.data-updated"),
        status: "success",
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Flex w="100%" direction='column'>
        <ButtonGroup mb="2">
          <Button
            variant='outline'
            size='sm'
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
              as='form' 
              direction='column'
              align='center'
              onSubmit={handleSubmit(setFilters)}>
              <FormControl as='fieldset'>
                <FormLabel as='legend'>
                  {t("field.status")}
                </FormLabel>
                <RadioGroup defaultValue='all' name='status'>
                  <Stack direction='column'>
                    <Radio {...register('status')} value='all'>{t("types.all")}</Radio>
                    <Radio {...register('status')} value='unverified'>{t("types.unverified")}</Radio>
                    <Radio {...register('status')} value='submitted'>{t("types.submitted")}</Radio>
                    <Radio {...register('status')} value='verified'>{t("types.verified")}</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              <Button
                mt={2}
                size='sm'
                type='submit'>
                {t("button.filter")}
              </Button>
            </Stack>
          </PopoverForm>
        </ButtonGroup>
        { data && data.row.length > 0
          ? showList
            ? <DriversList data={data}/>
            : <DriverTable 
                data={data} 
                onSubmit={onSubmit} 
                onVerify={onVerificationInvoke}
                onHistory={onAccountHistoryInvoked}/>
          : <Box w='100%' h='100%'>
              <Center h='100%'>
                <Box>{t('feedback.empty-drivers')}</Box>
              </Center>
            </Box>
        }
        <Spacer/>
        { data && data.row.length > 0
          && <Paginate
              onPageChange={onPageChanged}
              pageCount={data.count}
              currentPage={page}/>
        }
      </Flex>
      { verification &&
        <Modal isOpen={verification} onClose={onVerificationDispose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("dialog.verification-data")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              { downloading 
                ? <Center>
                    <Spinner/>
                  </Center>
                : image && <Image src={image}/>
              }
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onVerify}
                isLoading={submitting}>
                {t("button.verify")}
              </Button>
              <Button
                variant="ghost"
                onClick={onVerificationDispose}>
                {t("button.cancel")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }
      { account &&
        <Modal isOpen={account} onClose={onAccountHistoryDisposed} scrollBehavior='inside'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("dialog.travel-history")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              { histories.row &&
                <RouteHistoryList data={histories.row}/>
              }
            </ModalBody>

            <ModalFooter>
              <Button
                variant="ghost"
                onClick={onAccountHistoryDisposed}>
                {t("button.close")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }
    </>
  );
}

export default DriverTab;

function DriverTable({data, onSubmit, onVerify, onHistory}) {
  const { t } = useTranslation();
  const { nameFormOpen, onNameFormOpen, onNameFormClose } = useDisclosure();
  const { addressFormOpen, onAddressFormOpen, onAddressFormClose } = useDisclosure();
  const { contactFormOpen, onContactFormOpen, onContactFormClose } = useDisclosure();
  const { dateFormOpen, onDateFormOpen, onDateFormClose } = useDisclosure();
  const { plateFormOpen, onPlateFormOpen, onPlateFormClose } = useDisclosure();

  return (
    <>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>{t("field.name")}</Th>
            <Th>{t("field.address")}</Th>
            <Th>{t("field.birthdate")}</Th>
            <Th>{t("field.contact")}</Th>
            <Th>{t("field.status")}</Th>
            <Th>{t("field.vehicle-plate-number")}</Th>
            <Th>{t("field.actions")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.row.map((row) => {
              return (
                <Tr key={row.id}>
                  <Td>
                    <PopoverBox
                      id={row.id}
                      open={nameFormOpen}
                      onOpen={onNameFormOpen}
                      onClose={onNameFormClose}
                      onSubmit={onSubmit}
                      fields={['lastname', 'firstname']}
                      values={{lastname: row.lastname, firstname: row.firstname}}>
                      {`${row.firstname} ${row.lastname}`}
                    </PopoverBox>
                  </Td>
                  <Td>
                    <PopoverBox
                      id={row.id}
                      open={addressFormOpen}
                      onOpen={onAddressFormOpen}
                      onClose={onAddressFormClose}
                      onSubmit={onSubmit}
                      fields={['address']}
                      values={{address: row.address}}>
                      {row.address}
                    </PopoverBox>
                  </Td>
                  <Td>
                    <Box as="span" mr="2">{row.birthdate}</Box>
                    <DatePicker
                      open={dateFormOpen}
                      onOpen={onDateFormOpen}
                      onClose={onDateFormClose}
                      date={row.birthdate}
                      setDate={(date) => onSubmit({birthdate: date, id: row.id})}>
                      <IconButton
                        variant="ghost"
                        size="xs" 
                        icon={<Edit size={16}/>}/>
                    </DatePicker>
                  </Td>
                  <Td>
                    <PopoverBox
                      id={row.id}
                      open={contactFormOpen}
                      onOpen={onContactFormOpen}
                      onClose={onContactFormClose}
                      onSubmit={onSubmit}
                      fields={['contact']}
                      values={{contact: row.contact}}>
                      {row.contact}
                    </PopoverBox>
                  </Td>
                  <Td>
                    <Box>
                      <Box as='span' mr={2}>{t(`types.${row.status}`)}</Box>
                      { row.status === 'submitted' &&
                        <IconButton 
                          variant='ghost' 
                          size='xs' 
                          icon={<MoreVertical size={16}/>}
                          onClick={() => onVerify(row)}/>
                      }
                    </Box>
                  </Td>
                  <Td>
                    <PopoverBox
                      id={row.id}
                      open={plateFormOpen}
                      onOpen={onPlateFormOpen}
                      onClose={onPlateFormClose}
                      onSubmit={onSubmit}
                      fields={['plateNumber']}
                      values={{plateNumber: row.plateNumber}}>
                      {row.plateNumber}
                    </PopoverBox>
                  </Td>
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
                          <MenuItem onClick={() => onHistory(row)}>
                            {t("button.view-history")}
                          </MenuItem>
                          <MenuItem>
                            {t("button.send-sms")}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Box>
                  </Td>
                </Tr>
              ) 
            })
          }
        </Tbody>
      </Table>
    </>
  )
}

function DriversList({data}) {
  return (
    <Box mt={2}>
      { data.row.map((driver) => {
          return (
            <DriverListItem
              key={driver.id}
              driver={driver}/>
          );
        })
      }
    </Box>
  )
}

function DriverListItem({driver}) {
  return (
    <Stack direction='column' spacing={0} py={4}>
      <Box fontWeight='semibold'>
        {`${driver.firstname} ${driver.lastname}`}
      </Box>
      <Box fontSize='sm' color='gray.500'>
        {driver.plateNumber}
      </Box>
    </Stack>
  )
}

function RouteHistoryList({data}) {
  return (
    <Box>
      { data.map((travel) => {
          return <RouteHistoryListItem key={travel.travelId} row={travel}/>
        })
      }
    </Box>
  )
}

function RouteHistoryListItem({row}) {
  return (
    <Stack direction='column' spacing={0}>
      <Box fontWeight='semibold'>
        {`${row.routes.source} - ${row.routes.destination}`}
      </Box>
      <Box fontSize='sm' color='gray.500'>
        {format(Date.parse(row.routes.departure), 'h:mm a - MMMM d yyyy')}
      </Box>
    </Stack>
  )
}