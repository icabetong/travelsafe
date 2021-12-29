import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import {
  Box,
  Flex,
  SimpleGrid,
  useColorMode,
  useBreakpointValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useAuth } from "../../auth/Provider";
import supabase from "../../core/Infrastructure";
import { getPagination } from "../../shared/Tools";

function TravelsTab() {
  const { user } = useAuth();
  const [timestamp, setTimestamp] = useState(new Date());
  const [travels, setTravels] = useState({ rows: [], count: 0 });

  useEffect(() => {
    const fetch = async () => {
      const { from, to } = getPagination();
      const { data, error, count } = await supabase
        .from('travels')
        .select(`travelId, routes(source, destination, arrival, departure, finished)`)
        .eq('userId', user.id)
        .order('travelId', { ascending: true })
        .range(from, to);

      if (error) {}

      setTravels({ rows: data, count: count });
    }

    fetch();
  }, [user.id, timestamp]);

  return (
    <Flex>
      <TravelList data={travels.rows}/>
    </Flex>
  )
}
export default TravelsTab;

function TravelList({data}) {
  const pattern = "hh:mm a - MMMM d yyyy";
  const columns = useBreakpointValue({ base: 1, md: 3 });
  const { colorMode } = useColorMode();

  return (
    <SimpleGrid columns={columns} spacing={4}>
    { data.map((travel) => {
        return (
          <Box 
            key={travel.travelId}
            p={4}
            border="1px"
            borderColor={colorMode === 'dark' ? 'gray.500' : 'gray.300'}
            borderRadius="md">
            <Box fontSize="lg" fontWeight="bold">
              {`${travel.routes.source} - ${travel.routes.destination}`}
            </Box>
            <Box fontSize="sm">
              <Trans
                i18nKey="concat.departure"
                values={{ departure: format(Date.parse(travel.routes.departure), pattern) }}
                components={{
                  focus: <Box fontWeight="semibold"/>
                }}/>
            </Box>
            { travel.routes.arrival
              &&  <Box fontSize="sm">
                    <Trans
                      i18nKey="concat.arrival"
                      values={{ arrival: format(Date.parse(travel.routes.arrival), pattern) }}
                      components={{
                        focus: <Box fontWeight="semibold"/>
                      }}/>
                  </Box>
            }
          </Box>
        );
      })
    }
    </SimpleGrid>
  )
}