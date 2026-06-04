import { describe, it, expect, vi } from "vitest";
import { validate, submitInquiry, loadDraft, saveDraft, clearDraft } from "./contactForm";

const VALID = { name: "Maria", email: "maria@example.com", message: "Need a site." };
const BLANK = { name: "", email: "", message: "" };

function fakeStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
}

describe("validate", () => {
  it("flags every empty field", () => {
    const errors = validate({ name: "", email: "", message: "" });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.message).toBeTruthy();
  });

  it("flags a malformed email", () => {
    const errors = validate({ ...VALID, email: "maria@nope" });
    expect(errors.email).toBeTruthy();
    expect(errors.name).toBeUndefined();
    expect(errors.message).toBeUndefined();
  });

  it("passes clean input with no errors", () => {
    expect(validate(VALID)).toEqual({});
  });
});

describe("submitInquiry", () => {
  it("POSTs the fields to the endpoint and resolves when ok", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => ({ ok: true, status: 200 }) as Response);
    await expect(
      submitInquiry(VALID, { endpoint: "/x", fetchImpl }),
    ).resolves.toBeUndefined();
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls[0]?.[0]).toBe("/x");
    expect(JSON.parse(String(fetchImpl.mock.calls[0]?.[1]?.body))).toEqual(VALID);
  });

  it("throws when the response is not ok", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => ({ ok: false, status: 500 }) as Response);
    await expect(submitInquiry(VALID, { fetchImpl })).rejects.toThrow();
  });
});

describe("draft persistence", () => {
  it("round-trips a saved draft", () => {
    const storage = fakeStorage();
    saveDraft(VALID, storage);
    expect(loadDraft(storage)).toEqual(VALID);
  });

  it("returns blank fields when nothing is saved", () => {
    expect(loadDraft(fakeStorage())).toEqual(BLANK);
  });

  it("clears a saved draft", () => {
    const storage = fakeStorage();
    saveDraft(VALID, storage);
    clearDraft(storage);
    expect(loadDraft(storage)).toEqual(BLANK);
  });

  it("degrades to blank fields when storage throws", () => {
    const throwing = {
      getItem() { throw new Error("nope"); },
      setItem() { throw new Error("nope"); },
      removeItem() { throw new Error("nope"); },
    };
    expect(() => saveDraft(VALID, throwing)).not.toThrow();
    expect(loadDraft(throwing)).toEqual(BLANK);
  });
});
