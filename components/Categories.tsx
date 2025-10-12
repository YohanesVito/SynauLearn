"use client";

import { useState } from "react";

const categories = ["Basic", "Advanced", "Professional"];

export default function Categories() {
  const [selected, setSelected] = useState("Basic");

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-6">Categories</h2>
      <div className="flex gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelected(category)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              selected === category
                ? "bg-blue-600 text-white"
                : "bg-[#2a2d42] text-gray-400 hover:bg-[#333649]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}