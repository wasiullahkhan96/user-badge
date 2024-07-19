import { cn } from "clsx-tailwind-merge";
import React from "react";

interface Props {
  passStrength: number;
}

function PasswordStrength({ passStrength }: Props) {
  return (
    <div className="flex gap-0">
      {Array.from({ length: passStrength + 1 }).map((i, index) => (
        <div
          key={index}
          className={cn("h-1 w-24", {
            "bg-red-300": passStrength == 0,
            "bg-orange-300": passStrength == 1,
            "bg-yellow-300": passStrength == 2,
            "bg-green-300": passStrength == 3,
          })}
        ></div>
      ))}
    </div>
  );
}

export default PasswordStrength;
