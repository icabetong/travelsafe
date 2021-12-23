import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const font = 'Montserrat';
const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}
const theme = extendTheme(
  withDefaultColorScheme({ 
    colorScheme: "teal" 
  }),{
    config,
    fonts: {
      heading: font,
      body: font
    }
  }
);

export default theme;