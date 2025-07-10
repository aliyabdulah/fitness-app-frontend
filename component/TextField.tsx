import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface TextFieldProps extends TextInputProps {
  // Add custom props here
}

export default function TextField(props: TextFieldProps) {
  return (
    <TextInput 
      {...props}
      // Add your TextField styling and logic here
    />
  );
} 