import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import supabase from "../../core/Infrastructure";
import { getPagination } from "../../shared/Tools"; 

function DriverTab() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { from, to } = getPagination(page);
      const { data } = await supabase
        .from('accounts')
        .select("*")
        .order('id', { ascending: true })
        .range(from, to)

      setData(data);
    }

    fetch();
  }, [page]);

  return (
    <Box w="100%">
      { data &&
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>{t("field.lastname")}</Th>
              <Th>{t("field.firstname")}</Th>
              <Th>{t("field.address")}</Th>
              <Th>{t("field.gender")}</Th>
              <Th>{t("field.birthdate")}</Th>
              <Th>{t("field.contact")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            { data.map((row) => {
                return (
                  <Tr>
                    <Td>{row.lastname}</Td>
                    <Td>{row.firstname}</Td>
                    <Td>{row.address}</Td>
                    <Td>{row.gender}</Td>
                    <Td>{row.birthdate}</Td>
                    <Td>
                      <Box>
                        +63
                        <Box pl="1" as="span">
                          {row.contact}
                        </Box>
                      </Box>
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