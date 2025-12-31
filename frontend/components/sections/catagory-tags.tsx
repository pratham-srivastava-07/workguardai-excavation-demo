"use client"

import { useState } from "react"

const categories = ["kitchen", "bathroom", "flooring", "roofing", "painting", "electrical", "plumbing", "curtains", "anything"]

export const CategoryTags = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap gap-3 mb-12">
      {categories.map((category) => (
        <span
          key={category}
          onClick={() => setActiveTag(category === activeTag ? null : category)}
          className={`px-4 py-2 rounded-full text-sm cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95 select-none ${activeTag === category
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            } hover:shadow-md active:shadow-sm`}
        >
          {category}
        </span>
      ))}
    </div>
  )
}
