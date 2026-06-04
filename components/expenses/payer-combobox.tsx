"use client";

import { useState } from "react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
} from "lucide-react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type PayerComboboxProps = {
  id: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  value: string;
};

export function PayerCombobox({
  id,
  onChange,
  options,
  placeholder,
  value,
}: PayerComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Input
          id={id}
          className="w-full pr-10"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
        <PopoverTrigger asChild>
          <button
            aria-label="Select saved payer"
            className="absolute right-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-r-md text-muted-foreground ring-offset-background transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            type="button"
          >
            <ChevronsUpDownIcon className="h-4 w-4" />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent align="start" className="w-72 p-0">
        {options.length ? (
          <Command>
            <CommandList>
              <CommandGroup>
                {options.map((payer) => (
                  <CommandItem
                    key={payer}
                    value={payer}
                    onSelect={() => {
                      onChange(payer);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === payer ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {payer}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            No saved payers yet.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
