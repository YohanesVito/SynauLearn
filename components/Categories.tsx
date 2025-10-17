"use client";

import { SafeArea } from "@coinbase/onchainkit/minikit";
import { useState } from "react";

const categories = ["Basic", "Advanced", "Professional"];

export default function Categories() {
  const [selected, setSelected] = useState("Basic");

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-6">Categories</h2>
      <div className="flex gap-2">
        {categories.map((category) => (
          <SafeArea>
            <button
              key={category}
              onClick={() => setSelected(category)}
              className={`px-6 py-2 rounded-full font-small transition-all ${selected === category
                  ? "bg-blue-600 text-white"
                  : "bg-[#2a2d42] text-gray-400 hover:bg-[#333649]"
                }`}
            >
              {category}
            </button>
          </SafeArea>
        ))}
      </div>
    </div>
  );
}