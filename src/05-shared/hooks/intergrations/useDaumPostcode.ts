import { useEffect, useState } from "react";

interface DaumPostcodeData {
  zonecode: string;
  address: string;
  roadAddress?: string;
  jibunAddress?: string;
  buildingName?: string;
  apartment?: string;
  [key: string]: unknown;
}

interface DaumPostcodeConstructor {
  new (options: { oncomplete: (data: DaumPostcodeData) => void }): {
    open: () => void;
  };
}

declare global {
  interface Window {
    daum?: {
      Postcode?: DaumPostcodeConstructor;
    };
  }
}

export function useDaumPostcode() {
  const [loaded, setLoaded] = useState<boolean>(!!window.daum?.Postcode);

  useEffect(() => {
    if (loaded) return;

    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [loaded]);

  const openPostcode = (onComplete: (data: DaumPostcodeData) => void) => {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({ oncomplete: onComplete }).open();
  };

  return { loaded, openPostcode };
}
