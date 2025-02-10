"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CommandProps {
  commands: string[];
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Command = ({ commands, value, onChange, onKeyDown }: CommandProps) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const commandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (commandRefs.current[active]) {
      commandRefs.current[active]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [active]);

  const handleClick = (index: number) => {
    if (inputRef.current) {
      const newValue = `${filteredCommands[index]} `;
      onChange(newValue);
      inputRef.current.value = newValue;
      setOpen(false); // Close the popover after selecting a command
    }
  };

  React.useEffect(() => {
    if (value === "" && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((prev) => (prev + 1) % filteredCommands.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive(
          (prev) =>
            (prev - 1 + filteredCommands.length) % filteredCommands.length
        );
        break;
      case "Tab":
        if (filteredCommands.length) {
          e.preventDefault();
          handleClick(active);
        }
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setOpen(true); // Keep the dropdown open while typing
  };

  // Prevent overlay from closing when clicking inside the dropdown
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!popoverRef.current?.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  const filteredCommands = React.useMemo(() => {
    return commands.filter((cmd) => cmd.includes(value));
  }, [value, commands]);

  useEffect(() => {
    setActive(0);
  }, [value]);

  return (
    <div className="flex w-full relative">
      {open && filteredCommands.length > 0 && value !== "" && (
        <div
          ref={popoverRef}
          className="w-full absolute bottom-[calc(100%+10px)] bg-background rounded-md border shadow-md p-1 max-h-[150px] overflow-auto max-w-[400px]"
        >
          {filteredCommands.map((command, index) => (
            <div
              key={index}
              ref={(el) => void (commandRefs.current[index] = el)}
              className={cn(
                "px-4 py-1 rounded-md text-sm cursor-pointer flex items-center justify-between hover:bg-foreground/5",
                { "bg-foreground/10": active === index }
              )}
              onMouseDown={() => handleClick(index)} // Use onMouseDown to prevent onBlur from triggering
            >
              <p className="w-full">{command}</p>
              {active === index && (
                <p className="text-xs text-muted-foreground bg-background border rounded-md px-2">
                  Tab
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <Input
        placeholder="Enter your command"
        className="h-max py-1"
        onFocus={() => setOpen(true)}
        onBlur={handleBlur} // Custom blur handling
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        ref={inputRef}
      />
    </div>
  );
};

export default Command;
