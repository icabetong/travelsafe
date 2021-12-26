import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
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
import { Edit, RefreshCw } from "react-feather";
import ReactPaginate from "react-paginate";
import supabase from "../../core/Infrastructure";
import PopoverBox from "../../shared/custom/PopoverBox";
import PopoverSelect from "../../shared/custom/PopoverSelect";
import DatePicker from "../../shared/custom/DatePicker";
import { getPagination } from "../../shared/Tools"; 

function DriverTab() {
  const { t } = useTranslation();
  const [timestamp, setTimestamp] = useState(new Date());
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const toast = useToast();
  const { nameFormOpen, onNameFormOpen, onNameFormClose } = useDisclosure();
  const { addressFormOpen, onAddressFormOpen, onAddressFormClose } = useDisclosure();
  const { contactFormOpen, onContactFormOpen, onContactFormClose } = useDisclosure();
  const { genderFormOpen, onGenderFormOpen, onGenderFormClose } = useDisclosure();
  const { dateFormOpen, onDateFormOpen, onDateFormClose } = useDisclosure();
  const { plateFormOpen, onPlateFormOpen, onPlateFormClose } = useDisclosure();

  useEffect(() => {
    const fetch = async () => {
      const { from, to } = getPagination(page);
      const { data } = await supabase
        .from('vehicles')
        .select(`plateNumber, accounts (id, lastname, firstname, birthdate, gender, address, contact)`)
        .order('plateNumber', { ascending: true })
        .range(from, to)
  
      setData(data);
    }

    fetch();
  }, [page, timestamp]);

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
    <Stack w="100%" direction='column'>
      <ButtonGroup>
        <Button
          variant='outline'
          size='sm'
          leftIcon={<RefreshCw size={16}/>}
          onClick={() => setTimestamp(new Date())}>
          {t("button.refresh")}
        </Button>
      </ButtonGroup>
      { data &&
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>{t("field.name")}</Th>
              <Th>{t("field.address")}</Th>
              <Th>{t("field.gender")}</Th>
              <Th>{t("field.birthdate")}</Th>
              <Th>{t("field.contact")}</Th>
              <Th>{t("field.vehicle-plate-number")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            { data.map((row) => {
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
      }
    </Stack>
  );
}

export default DriverTab;