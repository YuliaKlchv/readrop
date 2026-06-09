import { useState, useEffect } from "react";
import { api } from "./api.js";

const REFRESH_EVENT = "readrop:messages:updated";

export function notifyMessagesUpdated() {
  window.dispatchEvent(new Event(REFRESH_EVENT));
}

export function useUnreadCount(user) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;

    function refresh() {
      if (!user) { setUnread(0); return; }
      api("messages/unread").then((res) => {
        if (active && res.ok) setUnread(res.data.unread || 0);
      });
    }

    refresh();
    window.addEventListener(REFRESH_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      active = false;
      window.removeEventListener(REFRESH_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [user]);

  return unread;
}
