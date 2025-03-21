import * as React from "react";
// import * as LabelPrimitive from "@radix-ui/react-label";
// import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// const labelVariants = cva(
//   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
// );

const UserInput = ({
  id,
  className,
  label,
  value,
  onChange,
  error,
  type,
  autoComplete,
  placeholder,
  required,
}: {
  id: string;
  className?: string;
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className={cn("grid gap-2", className)}>
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      name={id}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className={cn(error && "border-error")}
    />
    {error && <p className="text-sm text-error">{error}</p>}
  </div>
);

export { UserInput };
