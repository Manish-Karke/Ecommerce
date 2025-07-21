"use client";
import React, { useState } from "react";

const calculator = () => {
  const [first, setfirst] = useState<any | null>(null);
  const [second, setsecond] = useState<any | null>(null);

  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setfirst(Number(e.target.value));
  };
  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsecond(Number(e.target.value));
  };

  const sum = (first ?? 0) + (second ?? 0);
  return (
    <div>
      Enter two number:
      <div className="flex flex-col gap-5 justify-items-center">
        <input
          type="number"
          onChange={handleChange1}
          value={first??""}
          placeholder="Enter text"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span>+</span>
        <input
          type="number"
          onChange={handleChange2}
          value={second}
          placeholder="Enter text"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span>=</span>
        <input
          type="text"
          value={sum}
          readOnly
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default calculator;
