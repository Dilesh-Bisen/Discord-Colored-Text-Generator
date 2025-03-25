'use client';
import { useState, useRef } from 'react';
import {
  Title,
  Text,
  Button,
  Group,
  Stack,
  Paper,
  Space,
  Tooltip
} from '@mantine/core';

export default function DiscordColoredTextGenerator() {
  const [content, setContent] = useState("Discord Colored Text Generator!");
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
    <Stack align="center" p="md" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title order={1}>Discord Text Generator</Title>

      <Group>
        {colors.formats.map(format => (
          <Tooltip label={format.label} key={format.code}>
            <Button
              variant="outline"
              onClick={() => format.code === '0' ? resetAll() : applyStyle(format.code)}
            >
              {format.label}
            </Button>
          </Tooltip>
        ))}
      </Group>

      <Text weight={500}>FG</Text>
      <Group>
        {colors.fg.map(color => (
          <Tooltip label={`${color.label} (${color.code})`} key={color.code}>
            <Button
              style={{ backgroundColor: color.color }}
              onClick={() => applyStyle(color.code)}
            >
              &nbsp;
            </Button>
          </Tooltip>
        ))}
      </Group>

      <Text weight={500}>BG</Text>
      <Group>
        {colors.bg.map(color => (
          <Tooltip label={`${color.label} (${color.code})`} key={color.code}>
            <Button
              style={{ backgroundColor: color.color }}
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
          fontFamily: 'monospace'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <Button 
        onClick={copyToClipboard} 
        color={copyCount > 3 ? 'red' : 'blue'}
      >
        Copy text as Discord formatted
      </Button>

      <style jsx global>{`
        .ansi-1 { font-weight: bold !important; }
        .ansi-4 { text-decoration: underline !important; }
        
        .ansi-30 { color: #4f545c !important; }
        .ansi-31 { color: #dc322f !important; }
        .ansi-32 { color: #859900 !important; }
        .ansi-33 { color: #b58900 !important; }
        .ansi-34 { color: #268bd2 !important; }
        .ansi-35 { color: #d33682 !important; }
        .ansi-36 { color: #2aa198 !important; }
        .ansi-37 { color: #ffffff !important; }
        
        .ansi-40 { background-color: #002b36 !important; }
        .ansi-41 { background-color: #cb4b16 !important; }
        .ansi-42 { background-color: #586e75 !important; }
        .ansi-43 { background-color: #657b83 !important; }
        .ansi-44 { background-color: #839496 !important; }
        .ansi-45 { background-color: #6c71c4 !important; }
        .ansi-46 { background-color: #93a1a1 !important; }
        .ansi-47 { background-color: #fdf6e3 !important; }
      `}</style>
    </Stack>
  );
}