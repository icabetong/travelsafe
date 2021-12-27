import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Spacer,
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
import { RefreshCw } from "react-feather";
import supabase from "../../core/Infrastructure";
import Paginate from "../../shared/custom/Pagination";
import { getPagination } from "../../shared/Tools"; 

function RoutesTab() {
  const { t } = useTranslation();
  const [timestamp, setTimestamp] = useState(new Date());
  const [data, setData] = useState({ row: [], count: 0 });
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { from, to } = getPagination(page);
      const { data, count } = await supabase
        .from('routes')
        .select(`*, accounts (id, lastname, firstname)`, { count: "exact" })
        .order('routeId', { ascending: true })
        .range(from, to)
  
      setData({ row: data, count: count });
    }

    fetch();
  }, [page, timestamp]);

  return (
    <Flex w="100%" direction="column">
      { console.log(typeof data.row )}
      { data && data.row.length > 0
        ? <RoutesTable data={data} />
        : <Stack direction="column" align="center">
            <Box>{t("feedback.empty-routes")}</Box>
          </Stack>
      }
    </Flex>
  );
}

export default RoutesTab;

function RoutesTable({data, onSubmit}) {
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
        </Tr>
      </Thead>
      <Tbody>
        { data.row.map((row) => {
            return (
              <Tr key={row.routeId}>
                <Td>{row.source}</Td>
                <Td>{row.source}</Td>
                <Td>{row.source}</Td>
                <Td>{row.source}</Td>
                <Td>{row.source}</Td> 
              </Tr>
            );
          })
        }
      </Tbody>
    </Table>
  );
}