import { useCallback, useEffect, useState } from "react";
import {
  type Errors,
  type Fields,
  validate,
  loadDraft,
  saveDraft,
  clearDraft,
  submitInquiry,
} from "./contactForm";

export type ContactStatus = "idle" | "submitting" | "success" | "error";

export function useContactForm() {
  const [fields, setFields] = useState<Fields>(loadDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<ContactStatus>("idle");

  // Persist a draft so an interrupted visitor doesn't lose their message.
  useEffect(() => {
    saveDraft(fields);
  }, [fields]);

  const setField = useCallback((key: keyof Fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const submit = useCallback(async () => {
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    try {
      await submitInquiry(fields);
      setStatus("success");
      clearDraft();
    } catch {
      setStatus("error");
    }
  }, [fields]);

  return { fields, errors, status, setField, submit };
}
