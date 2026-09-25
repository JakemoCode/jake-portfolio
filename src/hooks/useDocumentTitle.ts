import { useEffect } from "react";

/** Names the tab for the page on screen. Every page sets its own on arrival
 *  and none restores the old one, so a title never outlives its page. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
