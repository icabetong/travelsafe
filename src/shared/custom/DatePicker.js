import { useTranslation } from "react-i18next";
import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { Calendar } from "@uselessdev/datepicker";

function DatePicker(props) {
  const { t } = useTranslation();
  
  return (
    <Popover>
      <PopoverTrigger>
        {props.children}
      </PopoverTrigger>
      <PopoverContent >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{t("dialog.select-date")}</PopoverHeader>
        <PopoverBody
          paddingInlineStart={0}
          paddingInlineEnd={0}>
          <Calendar
            value={props.date}
            singleMonth
            singleDateSelection
            onSelectDate={props.setDate}
            prevButton={prop => (
              <IconButton 
                size="xs"
                icon={<ChevronLeft/>}
                {...prop}/>
            )}
            nextButton={prop => (
              <IconButton
                size="xs"
                icon={<ChevronRight/>}
                {...prop}/>
            )}/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;