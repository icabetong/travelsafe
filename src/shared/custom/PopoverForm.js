import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";

function PopoverForm(props) {
  return (
    <Popover>
      <PopoverTrigger>
        {props.trigger}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        { props.header && <PopoverHeader>{props.header}</PopoverHeader>}
        <PopoverBody>
          {props.children}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverForm;