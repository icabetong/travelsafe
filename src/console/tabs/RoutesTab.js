import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  Stack,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { RefreshCw, Filter } from "react-feather";
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

  useEffect(() => {
    let unmounted = false;
    
    const fetch = async () => {
      const { from, to } = getPagination(page);
      let query = supabase
        .from('routes')
        .select(`routeId, source, destination, departure, arrival, accounts(id, lastname, firstname)`, { count: "exact" })
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
        ? <RoutesTable data={data}/>
        : <Stack direction="column" align="center">
            <Box>{t("feedback.empty-routes")}</Box>
          </Stack>
      }
      <Spacer/>
      { data && data.row.length > 0
        && <Paginate
              onPageChange={onPageChanged}
              pageCount={data.count}
              currentPage={page}/>
      }
    </Flex>
  );
}

export default RoutesTab;

function RoutesTable({ data }) {
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
              </Tr>
            );
          })
        }
      </Tbody>
    </Table>
  );
}