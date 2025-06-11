import React, { useState } from "react";
import './Calendar.css';

const Calendar = ({ selectedDate, setSelectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    const isToday = (date) => {
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const getDayClass = (day) => {
        const date = new Date(year, month, day);
        const classes = [];
        if (isToday(date)) classes.push("today");
        if ([0, 6].includes((firstDay + day - 1) % 7)) classes.push("weekend");
        if (
            selectedDate &&
            date.toDateString() === selectedDate.toDateString()
        ) {
            classes.push("selected");
        }
        return classes.join(" ");
    };

    const renderDays = () => {
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="day empty" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            days.push(
                <div
                    key={day}
                    className={`day ${getDayClass(day)}`}
                    onClick={() => setSelectedDate(dateObj)}
                >
                    <div className="date">{day}</div>
                </div>
            );
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>←</button>
                <span>{year}. {String(month + 1).padStart(2, "0")}</span>
                <button onClick={handleNextMonth}>→</button>
            </div>
            <div className="calendar-weekdays">
                {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>
            <div className="calendar-grid">{renderDays()}</div>
        </div>
    );
};

export default Calendar;
