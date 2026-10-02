import { useState, useCallback } from "react";

/**
 * Small controlled-form helper.
 *  values   - current field values (controlled inputs)
 *  errors   - validation messages keyed by field name
 *  bind     - spread onto an input: { name, value, onChange }
 *  handleSubmit(onValid) - validates, then calls onValid(values)
 */
export default function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const bind = (name) => ({ name, value: values[name] ?? "", onChange: handleChange });

  const reset = useCallback((next = initialValues) => {
    setValues(next);
    setErrors({});
  }, [initialValues]);

  const handleSubmit = (onValid) => (event) => {
    event.preventDefault();
    const found = validate ? validate(values) : {};
    const hasErrors = Object.values(found).some(Boolean);
    setErrors(found);
    if (!hasErrors) onValid(values);
  };

  return { values, errors, setValues, setErrors, bind, reset, handleSubmit };
}
