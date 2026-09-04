//@ts-nocheck
import React, { useEffect, useState } from "react";
import { format, setHours, setMinutes, setSeconds, parse } from "date-fns";
import { CalendarClock, X } from "lucide-react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react-dom";
import Calendar from "react-calendar";
import { isValid } from "date-fns";
import "react-calendar/dist/Calendar.css";

export interface DateRange {
  filterType: number;
  startDate?: Date | null;
  endDate?: Date | null;
  mode?: "Between" | "Before" | "After";
}

interface Props {
  initialRange: DateRange;
  onChange: (range: DateRange) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

const tabToFilterType: Record<string, number> = {
  Between: 1,
  Before: 2,
  After: 3,
  today: 4,
  month: 5,
  "7days": 6,
};

const filterTypeToTab = (type: number): "Between" | "Before" | "After" | "Quick" => {
  switch (type) {
    case 1: return "Between";
    case 2: return "Before";
    case 3: return "After";
    case 4:
    case 5:
    case 6:
      return "Quick";
    default:
      return "Between";
  }
};

const DateRangePicker: React.FC<Props> = ({ initialRange, onChange, onClose, anchorRef }) => {
  const [tab, setTab] = useState<"Between" | "Before" | "After" | "Quick">(filterTypeToTab(initialRange.filterType));
  const [startDate, setStartDate] = useState<Date | null>(initialRange.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialRange.endDate || null);
  const [calendarTarget, setCalendarTarget] = useState<"start" | "end" | null>(null);
  const [startHour, setStartHour] = useState("00");
  const [startMinute, setStartMinute] = useState("00");
  const [startSecond, setStartSecond] = useState("00");
  const [endHour, setEndHour] = useState("00");
  const [endMinute, setEndMinute] = useState("00");
  const [endSecond, setEndSecond] = useState("00");

  const [rawStartDateInput, setRawStartDateInput] = useState<string>(
    initialRange.startDate ? format(initialRange.startDate, "MM-dd-yyyy HH:mm:ss") : ""
  );
  const [rawEndDateInput, setRawEndDateInput] = useState<string>(
    initialRange.endDate ? format(initialRange.endDate, "MM-dd-yyyy HH:mm:ss") : ""
  );

  const { x, y, refs, strategy, update } = useFloating({
    middleware: [offset(10), flip(), shift()],
    placement: "bottom-start",
  });

  useEffect(() => {
    if (anchorRef.current) refs.setReference(anchorRef.current);
  }, [anchorRef, refs]);

  useEffect(() => {
    if (!refs.floating.current || !anchorRef.current) return;
    return autoUpdate(anchorRef.current, refs.floating.current, update);
  }, [anchorRef, refs, update]);

  useEffect(() => {
    setTab(filterTypeToTab(initialRange.filterType));
    setStartDate(initialRange.startDate || null);
    setEndDate(initialRange.endDate || null);
    setRawStartDateInput(initialRange.startDate ? format(initialRange.startDate, "MM-dd-yyyy HH:mm:ss") : "");
    setRawEndDateInput(initialRange.endDate ? format(initialRange.endDate, "MM-dd-yyyy HH:mm:ss") : "");

    if (initialRange.startDate) {
      setStartHour(initialRange.startDate.getHours().toString().padStart(2, "0"));
      setStartMinute(initialRange.startDate.getMinutes().toString().padStart(2, "0"));
      setStartSecond(initialRange.startDate.getSeconds().toString().padStart(2, "0"));
    } else {
      setStartHour("00");
      setStartMinute("00");
      setStartSecond("00");
    }

    if (initialRange.endDate) {
      setEndHour(initialRange.endDate.getHours().toString().padStart(2, "0"));
      setEndMinute(initialRange.endDate.getMinutes().toString().padStart(2, "0"));
      setEndSecond(initialRange.endDate.getSeconds().toString().padStart(2, "0"));
    } else {
      setEndHour("00");
      setEndMinute("00");
      setEndSecond("00");
    }
  }, [initialRange]);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const floatingEl = refs.floating.current;
    const referenceEl = anchorRef.current;

    if (
      floatingEl instanceof HTMLElement &&
      referenceEl instanceof HTMLElement &&
      !floatingEl.contains(event.target as Node) &&
      !referenceEl.contains(event.target as Node)
    ) {
      onClose(); // closes when clicking outside
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [anchorRef, refs, onClose]);


  // Modified handleClose function to reset calendar target
  const handleClose = () => {
    setCalendarTarget(null); // Reset calendar target before closing
    onClose();
  };

  const applyFilter = () => {
    const parseTime = (date: Date | null, hour: string, minute: string, second: string) =>
      date ? setHours(setMinutes(setSeconds(date, parseInt(second)), parseInt(minute)), parseInt(hour)) : null;

    const updatedStart = parseTime(startDate, startHour, startMinute, startSecond);
    const updatedEnd = parseTime(endDate, endHour, endMinute, endSecond);

    let filterType = 0;
    if (tab === "Between") filterType = 1;
    else if (tab === "Before") filterType = 2;
    else if (tab === "After") filterType = 3;

    const payload: DateRange = {
      filterType,
      startDate: (filterType === 1 || filterType === 3) ? updatedStart : null,
      endDate: (filterType === 1 || filterType === 2) ? updatedEnd : null,
    };

    onChange(payload);
    setCalendarTarget(null); // Reset calendar target
    onClose();
  };

  const clearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setStartHour("00");
    setStartMinute("00");
    setStartSecond("00");
    setEndHour("00");
    setEndMinute("00");
    setEndSecond("00");
    setTab("Between");
    setRawStartDateInput("");
    setRawEndDateInput("");
    setCalendarTarget(null); // Reset calendar target
    onChange({ filterType: 0, startDate: null, endDate: null });
    onClose();
  };

  const handleDateChange = (date: Date) => {
    if (calendarTarget === "start") {
      setStartDate(date);
      setStartHour(date.getHours().toString().padStart(2, "0"));
      setStartMinute(date.getMinutes().toString().padStart(2, "0"));
      setStartSecond(date.getSeconds().toString().padStart(2, "0"));
      setRawStartDateInput(format(date, "MM-dd-yyyy HH:mm:ss"));
    } else if (calendarTarget === "end") {
      setEndDate(date);
      setEndHour(date.getHours().toString().padStart(2, "0"));
      setEndMinute(date.getMinutes().toString().padStart(2, "0"));
      setEndSecond(date.getSeconds().toString().padStart(2, "0"));
      setRawEndDateInput(format(date, "MM-dd-yyyy HH:mm:ss"));
    }
    setCalendarTarget(null);
  };

  const applyQuick = (range: "today" | "7days" | "month") => {
    const today = new Date();
    let payload: DateRange = { filterType: tabToFilterType[range] };

    if (range === "7days") {
      const prior = new Date(today);
      prior.setDate(prior.getDate() - 6);
      payload.startDate = setHours(setMinutes(setSeconds(prior, 0), 0), 0);
      payload.endDate = setHours(setMinutes(setSeconds(today, 59), 59), 23);
    } else if (range === "month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      payload.startDate = setHours(setMinutes(setSeconds(start, 0), 0), 0);
      payload.endDate = setHours(setMinutes(setSeconds(end, 59), 59), 23);
    } else if (range === "today") {
      payload.startDate = setHours(setMinutes(setSeconds(today, 0), 0), 0);
      payload.endDate = setHours(setMinutes(setSeconds(today, 59), 59), 23);
    }

    onChange(payload);
    setCalendarTarget(null); // Reset calendar target
    onClose();
  };

  const formatWithTime = (date: Date | null) =>
    date ? format(date, "MM-dd-yyyy HH:mm:ss") : "";

  const timeDropdowns = (
    hour: string,
    minute: string,
    second: string,
    setHour: (v: string) => void,
    setMinute: (v: string) => void,
    setSecond: (v: string) => void
  ) => (
    <div className="flex gap-2 mt-1">
      <select value={hour} onChange={(e) => setHour(e.target.value)} className="w-1/3 border rounded px-2 py-1 text-sm">
        {Array.from({ length: 24 }, (_, i) => {
          const val = String(i).padStart(2, "0");
          return <option key={val} value={val}>{val}</option>;
        })}
      </select>
      <select value={minute} onChange={(e) => setMinute(e.target.value)} className="w-1/3 border rounded px-2 py-1 text-sm">
        {Array.from({ length: 60 }, (_, i) => {
          const val = String(i).padStart(2, "0");
          return <option key={val} value={val}>{val}</option>;
        })}
      </select>
      <select value={second} onChange={(e) => setSecond(e.target.value)} className="w-1/3 border rounded px-2 py-1 text-sm">
        {Array.from({ length: 60 }, (_, i) => {
          const val = String(i).padStart(2, "0");
          return <option key={val} value={val}>{val}</option>;
        })}
      </select>
    </div>
  );

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (refs.floating.current && !refs.floating.current.contains(event.target as Node)) {
        setCalendarTarget(null);
      }
    };

    if (calendarTarget) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [calendarTarget, refs.floating]);

  return (
    <div
      ref={refs.floating as React.Ref<HTMLDivElement>}
      className=" z-[1000] rounded-md border bg-white shadow-lg w-[340px] text-sm p-4"
      style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gray-800 text-sm">Filter Date</span>
        <button onClick={handleClose}>
          <X className="h-4 w-4 text-gray-400 hover:text-black" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1 mb-3">
        {(["Between", "Before", "After", "Quick"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setTab(m);
              setCalendarTarget(null); 
            }}
            className={`text-xs px-2 py-1 rounded border ${tab === m ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {m}
          </button>
        ))}
      </div>

      {tab !== "Quick" && (
        <div className="space-y-4">
          {(tab === "Between" || tab === "After") && (
            <div>
              <label className="text-xs text-gray-500">Start Date</label>
              <div className="relative flex items-center mb-1">
                <CalendarClock
                  className="absolute left-2 h-4 w-4 text-gray-500 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="MM-dd-yyyy HH:mm:ss"
                  value={rawStartDateInput}
                  onChange={(e) => {
                    setRawStartDateInput(e.target.value);
                  }}
                  onBlur={() => {
                    const parsed = parse(rawStartDateInput, "MM-dd-yyyy HH:mm:ss", new Date());
                    if (isValid(parsed)) {
                      setStartDate(parsed);
                      setStartHour(parsed.getHours().toString().padStart(2, "0"));
                      setStartMinute(parsed.getMinutes().toString().padStart(2, "0"));
                      setStartSecond(parsed.getSeconds().toString().padStart(2, "0"));
                    }
                  }}
                  onFocus={() => setCalendarTarget("start")}
                  className="w-full border rounded px-8 py-1 text-sm"
                />
              </div>

              {calendarTarget === "start" && (
                <div className="mt-1">
                  <Calendar
                    onChange={(d) => {
                      const date = d as Date;
                      const currentStart = startDate || new Date();
                      const updatedDateWithCurrentTime = setHours(setMinutes(setSeconds(date, currentStart.getSeconds()), currentStart.getMinutes()), currentStart.getHours());

                      setStartDate(updatedDateWithCurrentTime);
                      setStartHour(updatedDateWithCurrentTime.getHours().toString().padStart(2, "0"));
                      setStartMinute(updatedDateWithCurrentTime.getMinutes().toString().padStart(2, "0"));
                      setStartSecond(updatedDateWithCurrentTime.getSeconds().toString().padStart(2, "0"));
                      setRawStartDateInput(format(updatedDateWithCurrentTime, "MM-dd-yyyy HH:mm:ss"));
                      setCalendarTarget(null);
                    }}
                    value={startDate || new Date()}
                  />
                </div>
              )}

              <div className="mt-1">
                <input
                  type="time"
                  step="1"
                  value={`${startHour}:${startMinute}:${startSecond}`}
                  onChange={(e) => {
                    const [h, m, s] = e.target.value.split(":");
                    setStartHour(h);
                    setStartMinute(m);
                    setStartSecond(s);
                    if (startDate) {
                      const updatedDate = setHours(setMinutes(setSeconds(startDate, parseInt(s)), parseInt(m)), parseInt(h));
                      setStartDate(updatedDate);
                      setRawStartDateInput(format(updatedDate, "MM-dd-yyyy HH:mm:ss"));
                    }
                  }}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          )}

          {(tab === "Between" || tab === "Before") && (
            <div>
              <label className="text-xs text-gray-500">End Date</label>
              <div className="relative flex items-center mb-1">
                <CalendarClock
                  className="absolute left-2 h-4 w-4 text-gray-500 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="MM-dd-yyyy HH:mm:ss"
                  value={rawEndDateInput}
                  onChange={(e) => {
                    setRawEndDateInput(e.target.value);
                  }}
                  onBlur={() => {
                    const parsed = parse(rawEndDateInput, "MM-dd-yyyy HH:mm:ss", new Date());
                    if (isValid(parsed)) {
                      setEndDate(parsed);
                      setEndHour(parsed.getHours().toString().padStart(2, "0"));
                      setEndMinute(parsed.getMinutes().toString().padStart(2, "0"));
                      setEndSecond(parsed.getSeconds().toString().padStart(2, "0"));
                    }
                  }}
                  onFocus={(e) => {
                    e.preventDefault();
                    setCalendarTarget(calendarTarget === "end" ? null : "end");
                  }}
                  className="w-full border rounded px-8 py-1 text-sm"
                />
              </div>

              {calendarTarget === "end" && (
                <div className="mt-1">
                  <Calendar
                    onChange={(d) => {
                      const date = d as Date;
                      const currentEnd = endDate || new Date();
                      const updatedDateWithCurrentTime = setHours(setMinutes(setSeconds(date, currentEnd.getSeconds()), currentEnd.getMinutes()), currentEnd.getHours());

                      setEndDate(updatedDateWithCurrentTime);
                      setEndHour(updatedDateWithCurrentTime.getHours().toString().padStart(2, "0"));
                      setEndMinute(updatedDateWithCurrentTime.getMinutes().toString().padStart(2, "0"));
                      setEndSecond(updatedDateWithCurrentTime.getSeconds().toString().padStart(2, "0"));
                      setRawEndDateInput(format(updatedDateWithCurrentTime, "MM-dd-yyyy HH:mm:ss"));
                      setCalendarTarget(null);
                    }}
                    value={endDate || new Date()}
                  />
                </div>
              )}

              <div className="mt-1">
                <input
                  type="time"
                  step="1"
                  value={`${endHour}:${endMinute}:${endSecond}`}
                  onChange={(e) => {
                    const [h, m, s] = e.target.value.split(":");
                    setEndHour(h);
                    setEndMinute(m);
                    setEndSecond(s);

                    if (endDate) {
                      const updatedDate = setHours(setMinutes(setSeconds(endDate, parseInt(s)), parseInt(m)), parseInt(h));
                      setEndDate(updatedDate);
                      setRawEndDateInput(format(updatedDate, "MM-dd-yyyy HH:mm:ss"));
                    }
                  }}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "Quick" && (
        <div className="grid grid-cols-1 gap-2 text-sm mt-2">
          <button onClick={() => applyQuick("today")} className="w-full py-1 border rounded text-left px-2 hover:bg-gray-100">
            Today
          </button>
          <button onClick={() => applyQuick("month")} className="w-full py-1 border rounded text-left px-2 hover:bg-gray-100">
            This Month
          </button>
          <button onClick={() => applyQuick("7days")} className="w-full py-1 border rounded text-left px-2 hover:bg-gray-100">
            Last 7 Days
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <button onClick={clearFilter} className="text-sm px-3 py-1 border rounded bg-white hover:bg-gray-100">
          Clear
        </button>
        <button onClick={applyFilter} className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;