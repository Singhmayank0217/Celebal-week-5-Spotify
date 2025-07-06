"use client";

import { useState, useRef, useEffect } from "react";

export default function Slider({
  value = [0],
  max = 100,
  step = 1,
  onValueChange,
  className = "",
  disabled = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value[0]);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value[0]);
    }
  }, [value[0], isDragging]);

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging && !disabled) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const newValue = Math.round((percentage * max) / step) * step;

    setLocalValue(newValue);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const percentage = (localValue / max) * 100;

  return (
    <div
      ref={sliderRef}
      className={`relative flex items-center w-full h-5 cursor-pointer ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
      onMouseDown={handleMouseDown}
    >
      <div className="w-full h-1 bg-gray-600 rounded-full">
        <div
          className="h-full bg-white rounded-full transition-all duration-100"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div
        className="absolute w-3 h-3 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-opacity opacity-0 hover:opacity-100"
        style={{
          left: `${percentage}%`,
          transform: "translateX(-50%) translateY(-50%)",
        }}
      />
    </div>
  );
}
