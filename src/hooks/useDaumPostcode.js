import { useEffect, useState } from "react";

export default function useDaumPostcode() {
  const [loaded, setLoaded] = useState(!!window.daum?.Postcode);

  useEffect(() => {
    if (loaded) return;
    const s = document.createElement("script");
    s.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    s.async = true;
    s.onload = () => setLoaded(true);
    document.body.appendChild(s);
  }, [loaded]);

  const openPostcode = (onComplete) => {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({ oncomplete: onComplete }).open();
  };

  return { loaded, openPostcode };
}
