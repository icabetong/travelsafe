import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { CalendarDefaultTheme } from "@uselessdev/datepicker";

const font = 'Montserrat';
const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}
const theme = extendTheme(
  CalendarDefaultTheme,
  withDefaultColorScheme({ 
    colorScheme: "teal" 
  }),{
    config,
    fonts: {
      heading: font,
      body: font
    },
    components: {
      Calendar: {
        parts: ['calendar'],
        baseStyle: {
          calendar: {
            margin: '0 auto',
            border: 'none'
          },
        }
      },
      CalendarControl: {
        parts: ['button'],
        baseStyle: {
          button: {
            rounded: "md",
          },
        }
      },
      CalendarMonth: {
        parts: ['days'],
        baseStyle: {
          days: {
            color: 'red'
          }
        }
      },
      CalendarDay: {
        baseStyle: {
          color: 'gray.500'
        }
      }
    }
  }
);

export default theme;