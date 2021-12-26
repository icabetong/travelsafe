import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  useDisclosure
} from "@chakra-ui/react";
import supabase from "../../core/Infrastructure";
import PopoverBox from "../../shared/custom/PopoverBox";
import { getPagination } from "../../shared/Tools"; 

function DriverTab() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const toast = useToast();
  const { nameFormOpen, onNameFormOpen, onNameFormClose } = useDisclosure();
  const { addressFormOpen, onAddressFormOpen, onAddressFormClose } = useDisclosure();
  const { contactFormOpen, onContactFormOpen, onContactFormClose } = useDisclosure();
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
  }, [page]);

  const onSubmit = async (data) => {
    const table = data.hasOwnProperty('plateNumber') ? 'vehicles' : 'accounts';

    let { error } = await supabase.from(table).update(data);
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
    <Box w="100%">
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
                        open={addressFormOpen}
                        onOpen={onAddressFormOpen}
                        onClose={onAddressFormClose}
                        onSubmit={onSubmit}
                        fields={['address']}
                        values={{address: row.accounts.address}}>
                        {row.accounts.address}
                      </PopoverBox>
                    </Td>
                    <Td>{t(`types.${row.accounts.gender}`)}</Td>
                    <Td>{row.accounts.birthdate}</Td>
                    <Td>
                      <PopoverBox
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
    </Box>
  );
}

export default DriverTab;