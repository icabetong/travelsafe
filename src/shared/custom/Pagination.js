import { Box } from "@chakra-ui/react";
import ReactPaginate from "react-paginate";

function Paginate(props) {
  return (
    <Box d='flex' alignItems='center' justifyContent='center'>
      <ReactPaginate
        containerClassName="react-paginate"
        pageClassName="page"
        pageLinkClassName="page-link"
        nextClassName="page"
        previousClassName="page"
        {...props}/>
    </Box>
  );
}

export default Paginate;