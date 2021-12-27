import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Stack,
} from "@chakra-ui/react";
import ReactFocusLock from "react-focus-lock";
import { Edit } from "react-feather";

function PopoverBox(props) {
  const { t } = useTranslation();
  const firstFieldRef = React.useRef(null);
  const [submitting, setSubmitting] = React.useState(false);

  const TextInput = React.forwardRef((props, ref) => {
    return (
      <FormControl>
        <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
        <Input
          ref={ref}
          id={props.id}
          {...props}/>
      </FormControl>
    )
  });

  const Form = (props) => {
    const { onSubmit, firstFieldRef, fields, values } = props;
    const { register, handleSubmit } = useForm();

    const onFormSubmit = async (data) => {
      setSubmitting(true);
      await onSubmit({...data, id: props.id});
      setSubmitting(false);
    }

    return (
      <Stack spacing={4} as="form" onSubmit={handleSubmit(onFormSubmit)}>
        { fields.map((field, index) => {
            return (
              <TextInput 
                key={field}
                label={t(`field.${field}`)}
                id={field}
                ref={index === 0 ? firstFieldRef : undefined}
                defaultValue={values[field]}
                {...register(field)}
              />
            )
          })
        }
        <ButtonGroup d='flex' justifyContent='flex-end'>
          <Button
            type="submit"
            isLoading={submitting}>
            {t("button.save")}
          </Button>
        </ButtonGroup>
      </Stack>
    )
  }

  return (
    <Box>
      <Box as="span" mr="2">{props.children}</Box>
      <Popover
        isOpen={props.open}
        initialFocusRef={firstFieldRef}
        onOpen={props.onOpen}
        onClose={submitting ? undefined : props.onClose}
        placement='right'
        closeOnBlur={false}>
        <PopoverTrigger>
          <IconButton 
            variant='ghost'
            size='xs' 
            icon={<Edit size={16}/>} />
        </PopoverTrigger>
        <PopoverContent p={5}>
          <ReactFocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            <Form 
              firstFieldRef={firstFieldRef}
              onSubmit={props.onSubmit}
              fields={props.fields}
              values={props.values} />
          </ReactFocusLock>
        </PopoverContent>
      </Popover>
    </Box>
  )
}

export default PopoverBox;