'use client';
import { useState, useRef } from 'react';
import {
  Title,
  Text,
  Button,
  Group,
  Stack,
  Paper,
  Tooltip,
  Container,
  Center,
  Box
} from '@mantine/core';

export default function DiscordColoredTextGenerator() {
  const [content, setContent] = useState("Welcome to Discord Colored Text Generator!");
  const editorRef = useRef(null);
  const [copyCount, setCopyCount] = useState(0);

  const colors = {
    formats: [
      { code: '0', label: 'Reset All', color: 'gray' },
      { code: '1', label: 'Bold', color: 'gray' },
      { code: '4', label: 'Underline', color: 'gray' }
    ],
    fg: [
      { code: '30', label: 'Gray', color: '#4f545c' },
      { code: '31', label: 'Red', color: '#dc322f' },
      { code: '32', label: 'Green', color: '#859900' },
      { code: '33', label: 'Yellow', color: '#b58900' },
      { code: '34', label: 'Blue', color: '#268bd2' },
      { code: '35', label: 'Pink', color: '#d33682' },
      { code: '36', label: 'Cyan', color: '#2aa198' },
      { code: '37', label: 'White', color: '#ffffff' }
    ],
    bg: [
      { code: '40', label: 'Dark Blue', color: '#002b36' },
      { code: '41', label: 'Orange', color: '#cb4b16' },
      { code: '42', label: 'Marble Blue', color: '#586e75' },
      { code: '43', label: 'Greyish Turquoise', color: '#657b83' },
      { code: '44', label: 'Gray', color: '#839496' },
      { code: '45', label: 'Indigo', color: '#6c71c4' },
      { code: '46', label: 'Light Gray', color: '#93a1a1' },
      { code: '47', label: 'White', color: '#fdf6e3' }
    ]
  };

  const applyStyle = (code) => {
    const selection = window.getSelection();
    if (!selection.toString()) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');

    span.className = `ansi-${code}`;

    if (code === '1') span.style.fontWeight = 'bold';
    else if (code === '4') span.style.textDecoration = 'underline';
    else if (colors.fg.some(c => c.code === code))
      span.style.color = colors.fg.find(c => c.code === code).color;
    else if (colors.bg.some(c => c.code === code))
      span.style.backgroundColor = colors.bg.find(c => c.code === code).color;

    range.surroundContents(span);
    selection.removeAllRanges();
  };

  const resetAll = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  };

  const convertToANSI = (node) => {
    let result = '';
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        result += child.textContent;
        continue;
      }

      if (child.nodeName === 'BR') {
        result += '\n';
        continue;
      }

      const styles = child.style;
      const classes = child.className.split(' ');
      const codes = [];

      if (styles.fontWeight === 'bold') codes.push('1');
      if (styles.textDecoration === 'underline') codes.push('4');
      if (styles.color) {
        const fgColor = colors.fg.find(c => c.color === styles.color);
        if (fgColor) codes.push(fgColor.code);
      }
      if (styles.backgroundColor) {
        const bgColor = colors.bg.find(c => c.color === styles.backgroundColor);
        if (bgColor) codes.push(bgColor.code);
      }

      if (codes.length > 0) {
        result += `\u001b[${codes.join(';')}m`;
      }

      result += convertToANSI(child);

      if (codes.length > 0) {
        result += '\u001b[0m';
      }
    }
    return result;
  };

  const copyToClipboard = () => {
    const ansiText = convertToANSI(editorRef.current);
    const formattedText = `\`\`\`ansi\n${ansiText}\n\`\`\``;

    navigator.clipboard.writeText(formattedText).then(() => {
      const funnyMessages = [
        "Copied!", "Double Copy!", "Triple Copy!",
        "Dominating!!", "Rampage!!"
      ];
      setCopyCount(prev => Math.min(prev + 1, funnyMessages.length - 1));
    });
  };

  return (
    <Center style={{ height: '100vh' }}>
      <Box
        p="2rem"
        style={{
          backgroundColor: '#f3f3f3',
          borderRadius: '12px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          width: '80%',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <Container size="md">
          <Stack align="center" spacing="xl">
            <Title order={1} style={{ fontFamily: 'Arial, sans-serif', color: '#333', marginBottom: '1rem' }}>
              Discord Text Generator
            </Title>

            <Group position="center" spacing="md" style={{ marginBottom: '1.5rem' }}>
              {colors.formats.map(format => (
                <Tooltip label={format.label} key={format.code}>
                  <Button
                    variant="outline"
                    onClick={() => format.code === '0' ? resetAll() : applyStyle(format.code)}
                    style={{ borderColor: '#333', color: '#333', fontWeight: 'bold' }}
                  >
                    {format.label}
                  </Button>
                </Tooltip>
              ))}
            </Group>

            <Text weight={500} style={{ color: '#555', marginBottom: '0.5rem' }}>Foreground Colors</Text>
            <Group position="center" spacing="md" style={{ marginBottom: '1.5rem' }}>
              {colors.fg.map(color => (
                <Tooltip label={`${color.label} (${color.code})`} key={color.code}>
                  <Button
                    style={{
                      backgroundColor: color.color,
                      border: '1px solid #ddd',
                      padding: '1rem',
                      borderRadius: '4px',
                      width: '2rem',
                      height: '2rem'
                    }}
                    onClick={() => applyStyle(color.code)}
                  >
                    &nbsp;
                  </Button>
                </Tooltip>
              ))}
            </Group>

            <Text weight={500} style={{ color: '#555', marginBottom: '0.5rem' }}>Background Colors</Text>
            <Group position="center" spacing="md" style={{ marginBottom: '1.5rem' }}>
              {colors.bg.map(color => (
                <Tooltip label={`${color.label} (${color.code})`} key={color.code}>
                  <Button
                    style={{
                      backgroundColor: color.color,
                      border: '1px solid #ddd',
                      padding: '1rem',
                      borderRadius: '4px',
                      width: '2rem',
                      height: '2rem'
                    }}
                    onClick={() => applyStyle(color.code)}
                  >
                    &nbsp;
                  </Button>
                </Tooltip>
              ))}
            </Group>

            <Paper
              ref={editorRef}
              contentEditable
              p="md"
              withBorder
              style={{
                minHeight: 150,
                width: '100%',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                borderColor: '#ddd',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '1.5rem'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <Button
              onClick={copyToClipboard}
              color={copyCount > 3 ? 'red' : 'blue'}
              style={{ fontWeight: 'bold', borderRadius: '4px' }}
            >
              Copy text as Discord formatted
            </Button>
          </Stack>
        </Container>
      </Box>
    </Center>
  );
}
