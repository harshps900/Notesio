import React, { useEffect, useState, useRef } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react-dom";
import { Button } from "./ui";

export interface ColumnFilterDropdownProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  column: string;
  values: string[];
  selectedValues: string[];
  onSelect: (values: string[]) => void;
  close: () => void;
}

const ColumnFilterDropdown: React.FC<ColumnFilterDropdownProps> = ({
  anchorRef,
  column,
  values,
  selectedValues,
  onSelect,
  close,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState(values);
  const [currentSelections, setCurrentSelections] = useState<string[]>(selectedValues);

  const { x, y, strategy, refs, update } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(6),
      flip({ fallbackPlacements: ["top-start", "bottom-end", "top-end"] }),
      shift({ padding: 8 }),
    ],
  });

  useEffect(() => {
    if (anchorRef.current) {
      refs.setReference(anchorRef.current);
    }
  }, [anchorRef, refs]);

  useEffect(() => {
    if (anchorRef.current && refs.floating.current) {
      return autoUpdate(anchorRef.current, refs.floating.current, update);
    }
  }, [anchorRef, refs, update]);


  useEffect(() => {
    setFiltered(
      values.filter((val) =>
        val.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, values]);
  useEffect(() => {
    setCurrentSelections(selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const floatingEl = refs.floating.current;
      const referenceEl = anchorRef.current;
      const target = event.target;

      if (
        floatingEl instanceof HTMLElement &&
        referenceEl instanceof HTMLElement &&
        !floatingEl.contains(target as Node) &&
        !referenceEl.contains(target as Node)
      ) {
        onSelect(currentSelections);
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refs, close, anchorRef, currentSelections, onSelect]);

  const handleValueClick = (val: string) => {
    setCurrentSelections((prev) => {
      if (prev.includes(val)) {
        return prev.filter((item) => item !== val);
      } else {
        return [...prev, val];
      }
    });
  };

  const handleSelectAll = () => {
    setCurrentSelections(filtered);
  };

  const handleDeselectAll = () => {
    setCurrentSelections([]);
  };

  return (
    <div
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        zIndex: 1000,
        minWidth: anchorRef.current ? anchorRef.current.offsetWidth : 'auto',
        backgroundColor: "white"
      }}
      className="w-52 bg-white border -ml-20  border-gray-200 rounded-md shadow-xl p-2 "
    >
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 text-sm px-2 py-1 border rounded w-full"
      />
      <div className="flex justify-between mb-2">
        <button
          onClick={handleSelectAll}
          className="text-xs text-blue-600 hover:underline"
        >
          Select All
        </button>
        <button
          onClick={handleDeselectAll}
          className="text-xs text-blue-600 hover:underline"
        >
          Deselect All
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto text-sm custom-scrollbar">
        <div
          onClick={() => {
            setCurrentSelections([]);
            onSelect([]);
            close();
          }}
          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer rounded ${currentSelections.length === 0 ? 'bg-gray-100 font-semibold' : ''}`}
        >
          All
        </div>
        {filtered.map((val) => (
          <div
            key={val}
            onClick={() => handleValueClick(val)}
            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer rounded flex items-center justify-between ${currentSelections.includes(val) ? "bg-blue-100" : ""
              }`}
          >
            {val}
            {currentSelections.includes(val) && (
              <span className="text-blue-600">✔</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <Button onClick={() => { onSelect(currentSelections); close(); }} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Apply</Button>
      </div>
    </div>
  );
};

export default ColumnFilterDropdown;