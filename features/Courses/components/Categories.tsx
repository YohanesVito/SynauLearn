import { useState } from "react";
import { SafeArea } from "@coinbase/onchainkit/minikit";

const Categories = () => {
  const categories = ["Basic", "Advanced", "Professional"];

  const [selected, setSelected] = useState("Basic");

  return (
    <SafeArea>
      <div className="flex justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelected(category)}
            className={`px-6 py-2 rounded-full text-small transition-all ${
              selected === category
                ? "bg-blue-600 text-white"
                : "bg-[#2a2d42] text-gray-400 hover:bg-[#333649]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </SafeArea>
  );
};

export default Categories;
