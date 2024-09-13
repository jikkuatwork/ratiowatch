import React, { useState } from "react";
import styled from "styled-components";
import { color } from "../utils";

const theme = color(255, 212, 0);

function Field({ placeholder, ...props }) {
  return (
    <InputWrapper>
      <Input placeholder={placeholder} {...props} />
    </InputWrapper>
  );
}

const InputWrapper = styled.div.attrs({
  className: "ba mb2 br2 b--black-10",
})``;

const Input = styled.input.attrs({
  className: "w-100 br2 pa2 f3 code bn",
  type: "text",
})``;

const Submit = styled.input.attrs({
  className: "w-100 br3 pa2 f3 code bn bg-black-10 pointer",
  type: "button",
})``;

const FieldSet = styled.div.attrs({
  className: "flex flex-column w-100 ph3",
})`
  max-width: 500px;
`;

const FieldWrapper = styled.div.attrs({
  className: "flex pa4-ns pv4 w-100 justify-center",
})`
  background: ${theme(9)};
`;

export default function AddForm({ handleSubmit }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleChange = (field, value) => {
    if (field === "from") {
      setFrom(value.toUpperCase());
    } else if (field === "to") {
      setTo(value.toUpperCase());
    }
  };

  const submit = () => handleSubmit(from, to);

  return (
    <FieldWrapper>
      <FieldSet>
        <Field
          value={from}
          placeholder="From"
          onChange={(e) => handleChange("from", e.target.value)}
        />
        <Field
          value={to}
          placeholder="To"
          onChange={(e) => handleChange("to", e.target.value)}
        />
        <Submit value="Add Pair" onClick={submit} />
      </FieldSet>
    </FieldWrapper>
  );
}
