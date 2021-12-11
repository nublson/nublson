import { useField } from "@unform/core";
import React, { HTMLAttributes, useEffect, useRef } from "react";
import { StyledInput } from "./styles";

interface Props extends HTMLAttributes<HTMLInputElement> {
  name: string;
}

export default function Input({ name, ...rest }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = "";
      },
    });
  }, [fieldName, registerField]);

  return (
    <StyledInput
      id={fieldName}
      ref={inputRef}
      defaultValue={defaultValue}
      {...rest}
    />
  );
}
