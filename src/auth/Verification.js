import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Flex,
  Image,
  VisuallyHidden,
  useToast,
} from "@chakra-ui/react";
import { CheckCircle } from "react-feather";
import { useAuth } from "./Provider";
import Page from "../shared/custom/Page";
import supabase from "../core/Infrastructure";

function Verification() {
  const { t } = useTranslation();
  const formRef = React.createRef(null);
  const [operation, setOperation] = React.useState('idle');
  const [preview, setPreview] = React.useState();
  const [image, setImage] = React.useState(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const onUpload = async () => {
    setOperation('uploading');

    const { error } = await supabase.storage
      .from('verification-ids')
      .upload(`${user.id}.png`, image);
    
    
    if (error) {
      setOperation('error');
      toast({
        title: t("feedback.id-upload-error"),
        status: "error",
        isClosable: true,
      });
    } else {
      setOperation('uploaded');
      const { error } = await supabase
        .from('accounts')
        .update({ status: 'submitted' })
        .eq('id', user.id)

      if (!error) {
        toast({
          title: t("feedback.id-uploaded"),
          status: "success",
          isClosable: true,
        });
      }
    }
  }

  const onChange = (event) => {
    let file = event.target.files[0];
    if (file) {
      setImage(file);

      let reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      }
      reader.readAsDataURL(file);
    }
  }

  const formContent = (
    <>
      <VisuallyHidden>
        <input 
          type="file" 
          ref={formRef} 
          name="image" 
          accept="image/*"
          onChange={onChange}/>
      </VisuallyHidden>
      { preview &&
        <Image src={preview} width="50%" height="50%"/>
      }
      <Box mt={4} mb={2} textAlign='center'>
        {image ? image.name : t("placeholder.select-an-image")}
      </Box>
      <Button 
        variant='outline'
        mb={4}
        onClick={() => formRef.current.click()} 
        isDisabled={operation === 'uploading'}>
        {t("button.choose-image")}
      </Button>
      <Button
        onClick={onUpload}
        isLoading={operation === 'uploading'}>
        {t("button.upload")}
      </Button>
    </>
  )

  const content = (
    <>
      <CheckCircle size={48}/>
      <Box
        mt={4}
        mb={2}
        fontSize='xl'>
        {t("feedback.under-verification")}
      </Box>
      <Box color="gray.500" mb={8}>
        {t("feedback.under-verification-subtitle")}
      </Box>
      <Button
        onClick={() => navigate('/')}>
        {t('button.back-to-home')}
      </Button>
    </>
  )

  return (
    <Page title={t("navigation.verification")}>
      <Flex direction="column" align='center' justify='center'>
      { operation === 'uploaded' || profile.status === 'submitted'
        ? content
        : formContent
      }
      </Flex>
    </Page>
  )
}

export default Verification;