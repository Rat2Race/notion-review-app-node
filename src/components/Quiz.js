import React from "react";

const Quiz = ({ quiz }) => {
  console.log("quiz prop:", quiz);

  return (
    <div>
      <h2>생성된 퀴즈</h2>
      <div dangerouslySetInnerHTML={{ __html: quiz.replace(/\n/g, "<br/>") }} />
    </div>
  );
};

export default Quiz;
