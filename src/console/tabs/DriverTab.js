import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spacer,
  Spinner,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  useDisclosure
} from "@chakra-ui/react";
import { Edit, RefreshCw, MoreVertical } from "react-feather";
import supabase from "../../core/Infrastructure";
import PopoverBox from "../../shared/custom/PopoverBox";
import PopoverSelect from "../../shared/custom/PopoverSelect";
import DatePicker from "../../shared/custom/DatePicker";
import Paginate from "../../shared/custom/Pagination";
import { getPagination } from "../../shared/Tools"; 

function DriverTab() {
  const { t } = useTranslation();
  const [timestamp, setTimestamp] = useState(new Date());
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ row: [], count: 0 });
  const [verification, setVerification] = useState();
  const [downloading, setDownloading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState();
  const toast = useToast();

  const onVerificationInvoke = (user) => setVerification(user);
  const onVerificationDispose = () => setVerification(undefined);

  useEffect(() => {
    let unmounted = false;
    const fetch = async () => {
      if (verification) {
        setDownloading(true);
        const { data } = await supabase.storage
          .from('verification-ids')
          .download(`${verification.accounts.id}.png`);

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
      const { data, count } = await supabase
        .from('vehicles')
        .select(`plateNumber, accounts(id, lastname, firstname, birthdate, gender, address, contact, status)`, { count: "exact" })
        .order('plateNumber', { ascending: true })
        .eq('accounts.type', 'driver')
        .range(from, to)

      if (!unmounted) {
        setData({ row: data, count: count });
      }
    }

    fetch();
    return () => {
      unmounted = true;
    }
  }, [page, timestamp]);

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
      .eq('id', verification.accounts.id)

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
        </ButtonGroup>
        { data && data.row.length > 0
          ? <DriverTable data={data} onSubmit={onSubmit} onVerify={onVerificationInvoke}/>
          : <Stack direction="column" align="center">
              <Box>{t("feedback.empty-drivers")}</Box>
            </Stack>
        }
        <Spacer/>
        <Paginate
          onPageChange={onPageChanged}
          pageCount={data.count}
          currentPage={page}/>
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
    </>
  );
}

export default DriverTab;

function DriverTable({data, onSubmit, onVerify}) {
  const { t } = useTranslation();
  const { nameFormOpen, onNameFormOpen, onNameFormClose } = useDisclosure();
  const { addressFormOpen, onAddressFormOpen, onAddressFormClose } = useDisclosure();
  const { contactFormOpen, onContactFormOpen, onContactFormClose } = useDisclosure();
  const { genderFormOpen, onGenderFormOpen, onGenderFormClose } = useDisclosure();
  const { dateFormOpen, onDateFormOpen, onDateFormClose } = useDisclosure();
  const { plateFormOpen, onPlateFormOpen, onPlateFormClose } = useDisclosure();

  return (
    <>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>{t("field.name")}</Th>
            <Th>{t("field.address")}</Th>
            <Th>{t("field.gender")}</Th>
            <Th>{t("field.birthdate")}</Th>
            <Th>{t("field.contact")}</Th>
            <Th>{t("field.status")}</Th>
            <Th>{t("field.vehicle-plate-number")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.row.map((row) => {
              return (
                <Tr key={row.accounts.id}>
                  <Td>
                    <PopoverBox
                      id={row.accounts.id}
                      open={nameFormOpen}
                      onOpen={onNameFormOpen}
                      onClose={onNameFormClose}
                      onSubmit={onSubmit}
                      fields={['lastname', 'firstname']}
                      values={{lastname: row.accounts.lastname, firstname: row.accounts.firstname}}>
                      {`${row.accounts.firstname} ${row.accounts.lastname}`}
                    </PopoverBox>
                  </Td>
                  <Td>
                    <PopoverBox
                      id={row.accounts.id}
                      open={addressFormOpen}
                      onOpen={onAddressFormOpen}
                      onClose={onAddressFormClose}
                      onSubmit={onSubmit}
                      fields={['address']}
                      values={{address: row.accounts.address}}>
                      {row.accounts.address}
                    </PopoverBox>
                  </Td>
                  <Td>
                    <PopoverSelect
                      id={row.accounts.id}
                      open={genderFormOpen}
                      onOpen={onGenderFormOpen}
                      onClose={onGenderFormClose}
                      onSubmit={onSubmit}
                      field="gender"
                      default={row.accounts.gender}
                      options={['male', 'female']}>
                      {t(`types.${row.accounts.gender}`)}
                    </PopoverSelect>
                  </Td>
                  <Td>
                    <Box as="span" mr="2">{row.accounts.birthdate}</Box>
                    <DatePicker
                      open={dateFormOpen}
                      onOpen={onDateFormOpen}
                      onClose={onDateFormClose}
                      date={row.accounts.birthdate}
                      setDate={(date) => onSubmit({birthdate: date, id: row.accounts.id})}>
                      <IconButton
                        variant="ghost"
                        size="xs" 
                        icon={<Edit size={16}/>}/>
                    </DatePicker>
                  </Td>
                  <Td>
                    <PopoverBox
                      id={row.accounts.id}
                      open={contactFormOpen}
                      onOpen={onContactFormOpen}
                      onClose={onContactFormClose}
                      onSubmit={onSubmit}
                      fields={['contact']}
                      values={{contact: row.accounts.contact}}>
                      {row.accounts.contact}
                    </PopoverBox>
                  </Td>
                  <Td>
                    <Box>
                      <Box as='span' mr={2}>{t(`types.${row.accounts.status}`)}</Box>
                      { row.accounts.status === 'submitted' &&
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
                      id={row.accounts.id}
                      open={plateFormOpen}
                      onOpen={onPlateFormOpen}
                      onClose={onPlateFormClose}
                      onSubmit={onSubmit}
                      fields={['plateNumber']}
                      values={{plateNumber: row.plateNumber}}>
                      {row.plateNumber}
                    </PopoverBox>
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