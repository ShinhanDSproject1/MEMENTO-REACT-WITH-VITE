// src/test.jsx
import React from "react";
import App from "@/App.jsx";

// ESLint 에러 발생 의도 (규칙 위반)
const MyComponent = () => {
  <App />;
  const variable = "hello";
  variable = "chnage";
  const itit = 123;
  <input />;
  let init = 123;
  if (itit == init) {
    return "a";
  }
  alert("b");
  console.log("변수가 선언되었지만 사용되지 않았습니다."); // 'no-unused-vars' 규칙 위반
  return (
    <div>
      <a href="/about" target="_blank">
        About Us
      </a>
      {/* 'react/jsx-no-target-blank' 규칙 위반 (rel="noopener noreferrer" 누락) */}
    </div>
  );
};

export default MyComponent;
