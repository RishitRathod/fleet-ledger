import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface CalendarDialogProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

const CalendarDialog = ({ onDateSelect, selectedDate: propSelectedDate }: CalendarDialogProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(propSelectedDate || new Date());
  const [currentMonth, setCurrentMonth] = useState(4); // April (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  const isSelectedDate = (day: {
    day: number;
    month: number;
    year: number;
    currentMonth: boolean;
  }) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day.day &&
      selectedDate.getMonth() === day.month &&
      selectedDate.getFullYear() === day.year
    );
  };

  // Helper function to generate days for the calendar
  const getDaysForMonth = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonth = month - 1 < 0 ? 11 : month - 1;
    const prevMonthYear = month - 1 < 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

    // Calculate days from next month to show
    const nextMonth = month + 1 > 11 ? 0 : month + 1;
    const nextMonthYear = month + 1 > 11 ? year + 1 : year;

    // Build the days array
    const days = [];

    // Add days from previous month
    for (
      let i = daysInPrevMonth - daysFromPrevMonth + 1;
      i <= daysInPrevMonth;
      i++
    ) {
      days.push({
        day: i,
        month: prevMonth,
        year: prevMonthYear,
        currentMonth: false,
      });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        currentMonth: true,
      });
    }

    // Add days from next month to fill the grid (6 rows x 7 columns = 42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        currentMonth: false,
      });
    }

    return days;
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Date</Label>
        <div className="flex gap-2">
          <Input
            value={selectedDate ? format(selectedDate, "PPP") : ""}
            placeholder={format(new Date(), "PPP")}
            readOnly
          />
          <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                type="button"
                size="icon"
                onClick={() => setIsCalendarOpen(true)}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="p-0 bg-[#1c1a1a] rounded-lg shadow-lg border border-gray-800"
              style={{ width: "400px" }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-white font-medium text-center w-full flex items-center justify-center gap-2">
                    <span>
                      {new Date(currentYear, currentMonth).toLocaleString(
                        "default",
                        { month: "long" }
                      )}
                    </span>
                    <select
                      className="bg-[#000000] text-white border border-gray-700 rounded-sm px-2 py-1 text-sm"
                      value={currentYear}
                      onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 10 }, (_, i) => 2020 + i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-gray-400 text-xs font-medium"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Row 1 */}
                  {getDaysForMonth(currentYear, currentMonth)
                    .slice(0, 7)
                    .map((day, index) => (
                      <button
                        key={`row1-${index}`}
                        className={`h-10 w-10 rounded-sm ${
                          day.currentMonth ? "text-gray-100" : "text-gray-500"
                        } hover:bg-gray-800 flex items-center justify-center`}
                        onClick={() => {
                          const newDate = new Date(day.year, day.month, day.day);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          
                          if (newDate > today) {
                            return; // Prevent selecting future dates
                          }
                          
                          setSelectedDate(newDate);
                          onDateSelect?.(newDate);
                          setIsCalendarOpen(false);
                        }}
                      >
                        {day.day}
                      </button>
                    ))}

                  {/* Row 2 */}
                  {getDaysForMonth(currentYear, currentMonth)
                    .slice(7, 14)
                    .map((day, index) => (
                      <button
                        key={`row2-${index}`}
                        className={`h-10 w-10 rounded-sm ${
                          day.currentMonth ? "text-gray-100" : "text-gray-500"
                        } hover:bg-gray-800 flex items-center justify-center`}
                        onClick={() => {
                          const newDate = new Date(day.year, day.month, day.day);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          
                          if (newDate > today) {
                            return; // Prevent selecting future dates
                          }
                          
                          setSelectedDate(newDate);
                          onDateSelect?.(newDate);
                          setIsCalendarOpen(false);
                        }}
                      >
                        {day.day}
                      </button>
                    ))}

                  {/* Row 3 */}
                  {getDaysForMonth(currentYear, currentMonth)
                    .slice(14, 21)
                    .map((day, index) => (
                      <button
                        key={`row3-${index}`}
                        className={`h-10 w-10 rounded-sm ${
                          day.currentMonth ? "text-gray-100" : "text-gray-500"
                        } hover:bg-gray-800 flex items-center justify-center`}
                        onClick={() => {
                          const newDate = new Date(day.year, day.month, day.day);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          
                          if (newDate > today) {
                            return; // Prevent selecting future dates
                          }
                          
                          setSelectedDate(newDate);
                          onDateSelect?.(newDate);
                          setIsCalendarOpen(false);
                        }}
                      >
                        {day.day}
                      </button>
                    ))}

                  {/* Row 4 */}
                  {getDaysForMonth(currentYear, currentMonth)
                    .slice(21, 28)
                    .map((day, index) => (
                      <button
                        key={`row4-${index}`}
                        className={`h-10 w-10 rounded-sm ${
                          day.currentMonth ? "text-gray-100" : "text-gray-500"
                        } ${
                          isSelectedDate(day)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "hover:bg-gray-800"
                        } flex items-center justify-center ${new Date(day.year, day.month, day.day) > new Date() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          const newDate = new Date(day.year, day.month, day.day);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          
                          if (newDate > today) {
                            return; // Prevent selecting future dates
                          }
                          
                          setSelectedDate(newDate);
                          onDateSelect?.(newDate);
                          setIsCalendarOpen(false);
                        }}
                      >
                        {day.day}
                      </button>
                    ))}

                  {/* Row 5 and 6 */}
                  {getDaysForMonth(currentYear, currentMonth)
                    .slice(28)
                    .map((day, index) => (
                      <button
                        key={`row5-${index}`}
                        className={`h-10 w-10 rounded-sm ${
                          day.currentMonth ? "text-gray-100" : "text-gray-500"
                        } ${
                          isSelectedDate(day)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "hover:bg-gray-800"
                        } flex items-center justify-center ${new Date(day.year, day.month, day.day) > new Date() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          const newDate = new Date(day.year, day.month, day.day);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          
                          if (newDate > today) {
                            return; // Prevent selecting future dates
                          }
                          
                          setSelectedDate(newDate);
                          onDateSelect?.(newDate);
                          setIsCalendarOpen(false);
                        }}
                      >
                        {day.day}
                      </button>
                    ))}
                </div>

                <div className="flex justify-between mt-4">
                  <div className="flex gap-2">
                    <button
                      className="w-8 h-8 bg-gray-800 text-gray-400 rounded-sm flex items-center justify-center hover:bg-gray-700 hover:text-white"
                      onClick={() => {
                        const newMonth = currentMonth - 1;
                        if (newMonth < 0) {
                          setCurrentMonth(11);
                          setCurrentYear(currentYear - 1);
                        } else {
                          setCurrentMonth(newMonth);
                        }
                      }}
                    >
                      &lt;
                    </button>
                    <button
                      className="w-8 h-8 bg-gray-800 text-gray-400 rounded-sm flex items-center justify-center hover:bg-gray-700 hover:text-white"
                      onClick={() => {
                        const newMonth = currentMonth + 1;
                        if (newMonth > 11) {
                          setCurrentMonth(0);
                          setCurrentYear(currentYear + 1);
                        } else {
                          setCurrentMonth(newMonth);
                        }
                      }}
                    >
                      &gt;
                    </button>
                  </div>
                  {/* <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => setIsCalendarOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        if (!selectedDate)
                          setSelectedDate(new Date(2025, 3, 27));
                        setIsCalendarOpen(false);
                      }}
                    >
                      OK
                    </Button>
                  </div> */}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default CalendarDialog;
