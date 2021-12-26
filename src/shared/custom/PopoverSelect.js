import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Select,
  Stack,
} from "@chakra-ui/react";
import ReactFocusLock from "react-focus-lock";
import { Edit } from "react-feather";

function PopoverSelect(props) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit } = useForm();
  const selectRef = React.createRef(null);

  const onSubmit = async (data) => {
    setSubmitting(true);
    await props.onSubmit({...data, id: props.id});
    setSubmitting(false);
  }

  return (
    <Box>
      <Box as="span" mr="2">{props.children}</Box>
      <Popover
        isOpen={props.open}
        initialFocusRef={selectRef}
        onOpen={props.onOpen}
        onClose={props.onClose}
        placement='right'
        closeOnBlur={false}>
        <PopoverTrigger>
          <IconButton variant="ghost" size='xs' icon={<Edit size={16}/>} />
        </PopoverTrigger>
        <PopoverContent p={5}>
          <ReactFocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel htmlFor={props.field}>{t(`field.${props.field}`)}</FormLabel>
                <Select ref={selectRef} id={props.field} defaultValue={props.default} {...register(props.field)}>
                { props.options.map((o) => {
                    return (
                      <option key={o} value={o}>{t(`types.${o}`)}</option>
                    )
                  })
                }
                </Select>
              </FormControl>
              <ButtonGroup d='flex' justifyContent='flex-end'>
                <Button
                  type="submit"
                  isLoading={submitting}>
                  {t("button.save")}
                </Button>
              </ButtonGroup>
            </Stack>
          </ReactFocusLock>
        </PopoverContent>
      </Popover>
    </Box>
  )
}

export default PopoverSelect;