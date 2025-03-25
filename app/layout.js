'use client';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="dark"
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colors: {
              brand: ['#7289da', '#5b6eae', '#4a5c94', '#3c4b7a', '#2f3b60'],
            },
          }}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}