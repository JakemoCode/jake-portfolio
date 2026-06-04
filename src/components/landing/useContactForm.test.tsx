import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useContactForm } from "./useContactForm";

// Controlled localStorage so draft assertions are deterministic across the
// jsdom / Node-experimental-localStorage difference.
let store: Record<string, string>;
beforeEach(() => {
  store = {};
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => void (store[k] = String(v)),
    removeItem: (k: string) => void delete store[k],
    clear: () => void (store = {}),
  });
});
afterEach(() => vi.unstubAllGlobals());

function fillValid(result: { current: ReturnType<typeof useContactForm> }) {
  act(() => {
    result.current.setField("name", "Maria");
    result.current.setField("email", "maria@example.com");
    result.current.setField("message", "Need a site.");
  });
}

describe("useContactForm", () => {
  it("blocks an invalid submit: sets errors, never calls fetch, stays idle", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { result } = renderHook(() => useContactForm());

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errors.name).toBeTruthy();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
  });

  it("on a successful submit: status becomes success and the draft is cleared", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200 })));
    const { result } = renderHook(() => useContactForm());
    fillValid(result);

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.status).toBe("success");
    expect(localStorage.getItem("jm-contact-draft")).toBeNull();
  });

  it("on a failed submit: status becomes error", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 500 })));
    const { result } = renderHook(() => useContactForm());
    fillValid(result);

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.status).toBe("error");
  });
});
