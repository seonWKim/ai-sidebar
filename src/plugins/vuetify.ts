/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          settings: '#EEEEEE',
          settings2: '#E0E0E0',
          messages: '#F0F1F5',

          background: '#FFFFFF',
          surface: '#FFFFFF',
          'surface-bright': '#FFFFFF',
          'surface-variant': '#424242',
          'on-surface-variant': '#EEEEEE',
          primary: '#1867C0',
          'primary-darken-1': '#3700B3',
          secondary: '#5CBBF6',
          'secondary-darken-1': '#018786',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          'on-background': '#000',
          'on-surface': '#000',
          'on-surface-bright': '#000',
          'on-primary': '#FFF',
          'on-primary-darken-1': '#FFF',
          'on-secondary': '#000',
          'on-secondary-darken-1': '#FFF',
          'on-error': '#FFF',
          'on-info': '#FFF',
          'on-success': '#FFF',
          'on-warning': '#FFF',
          'on-grey': '#000',
        },
        variables: {
          'border-color': '#000000',
          'border-opacity': 0.12,
          'high-emphasis-opacity': 0.87,
          'medium-emphasis-opacity': 0.6,
          'disabled-opacity': 0.38,
          'idle-opacity': 0.04,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.08,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.12,
          'dragged-opacity': 0.08,
          'theme-kbd': '#212529',
          'theme-on-kbd': '#FFFFFF',
          'theme-code': '#F5F5F5',
          'theme-on-code': '#000000',
        },
      },
      dark: {
        colors: {
          settings: '#424242',
          settings2: '#535353',
          messages: '#CCBFD6',

          background: '#121212',
          surface: '#212121',
          'surface-bright': '#CCBFD6',
          'surface-variant': '#A3A3A3',
          'on-surface-variant': '#424242',
          primary: '#BB86FC',
          'primary-darken-1': '#3700B3',
          secondary: '#03DAC5',
          'secondary-darken-1': '#03DAC5',
          error: '#CF6679',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          'on-background': '#FFF',
          'on-surface': '#FFF',
          'on-surface-bright': '#000',
          'on-primary': '#FFF',
          'on-primary-darken-1': '#FFF',
          'on-secondary': '#000',
          'on-secondary-darken-1': '#000',
          'on-error': '#FFF',
          'on-info': '#FFF',
          'on-success': '#FFF',
          'on-warning': '#FFF',
        },
        variables: {
          'border-color': '#FFFFFF',
          'border-opacity': 0.12,
          'high-emphasis-opacity': 1,
          'medium-emphasis-opacity': 0.7,
          'disabled-opacity': 0.5,
          'idle-opacity': 0.1,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.08,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.16,
          'dragged-opacity': 0.08,
          'theme-kbd': '#212529',
          'theme-on-kbd': '#FFFFFF',
          'theme-code': '#343434',
          'theme-on-code': '#CCCCCC',
        },
      },
    },
  },
});
