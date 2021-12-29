import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Flex,
  List,
  ListItem,
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
  const { t } = useTranslation();
  const pattern = "hh:mm a - MMMM d yyyy";

  return (
    <List>
    { data.map((travel) => {
        return (
          <ListItem key={travel.travelId}>
            <Box fontSize="lg" fontWeight="bold">
              {`${travel.routes.source} - ${travel.routes.destination}`}
            </Box>
            <Box fontSize="sm">
              {t("concat.departure", { departure: format(Date.parse(travel.routes.departure), pattern)})}
            </Box>
            <Box fontSize="sm">
              {t("concat.arrival", { arrival: format(Date.parse(travel.routes.arrival), pattern)})}
            </Box>
          </ListItem>
        );
      })
    }
    </List>
  )
}