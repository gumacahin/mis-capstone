import { Box, Chip, TextField } from "@mui/material";
import { Dayjs } from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  formatForDisplay,
  formatForEditing,
  parseNaturalLanguage,
} from "./dateUtils";

interface SmartDateTimeFieldProps {
  value: Dayjs | null;
  onChange: (date: Dayjs | null, recurrence?: string | null) => void;
  recurrence?: string | null;
  onRecurrenceChange?: (recurrence: string | null) => void;
  onAnchorModeChange?: (mode: "SCHEDULED" | "COMPLETED") => void;
  disabled?: boolean;
}

export const SmartDateTimeField: React.FC<SmartDateTimeFieldProps> = ({
  value,
  onChange,
  recurrence,
  onRecurrenceChange,
  onAnchorModeChange,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize input value when value or recurrence changes
  useEffect(() => {
    if (value || recurrence) {
      setInputValue(formatForEditing(value, recurrence));
    } else {
      setInputValue("");
    }
    setParseError(null);
    setPreview(null);
  }, [value, recurrence]);

  const handleInputChange = useCallback(
    (newValue: string) => {
      setInputValue(newValue);

      if (!newValue.trim()) {
        setParseError(null);
        setPreview(null);
        // Clear the value when input is empty
        onChange(null, null);
        if (onRecurrenceChange) {
          onRecurrenceChange(null);
        }
        return;
      }

      try {
        const parsed = parseNaturalLanguage(newValue);
        setParseError(null);

        if (parsed.date || parsed.recurrence) {
          const previewText = formatForDisplay(parsed.date, parsed.recurrence);
          setPreview(`✓ ${previewText}`);
        } else {
          setPreview(null);
        }
      } catch (error) {
        setParseError(error instanceof Error ? error.message : "Invalid input");
        setPreview(null);
      }
    },
    [onChange, onRecurrenceChange],
  );

  const handleSave = useCallback(() => {
    try {
      const parsed = parseNaturalLanguage(inputValue);

      // Update the main value
      onChange(parsed.date, parsed.recurrence);

      // Update recurrence if provided and handler exists
      if (onRecurrenceChange && parsed.recurrence !== undefined) {
        onRecurrenceChange(parsed.recurrence);
      }

      // Update anchor mode if provided and handler exists
      if (onAnchorModeChange && parsed.anchorMode !== undefined) {
        onAnchorModeChange(parsed.anchorMode);
      }

      setParseError(null);
      setPreview(null);
    } catch (error) {
      // Keep error state, error is already set
      setParseError(error instanceof Error ? error.message : "Invalid input");
    }
  }, [inputValue, onChange, onRecurrenceChange, onAnchorModeChange]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSave();
      }
    },
    [handleSave],
  );

  const handleBlur = useCallback(() => {
    // Small delay to allow for button clicks
    setTimeout(() => {
      handleSave();
    }, 100);
  }, [handleSave]);

  return (
    <Box sx={{ width: "100%", px: 1 }}>
      <TextField
        ref={inputRef}
        fullWidth
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        variant="standard"
        error={!!parseError}
        helperText={parseError || preview}
        disabled={disabled}
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: "inherit",
            fontWeight: "inherit",
            cursor: "text",
          },
        }}
        sx={{
          "& .MuiInputBase-root": {
            padding: 0,
            minHeight: 48,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiFormHelperText-root": {
            margin: 0,
            fontSize: "0.75rem",
            lineHeight: 1.2,
          },
        }}
      />

      {recurrence && (
        <Chip
          label="Repeats"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ ml: 1, height: 20, fontSize: "0.75rem" }}
        />
      )}
    </Box>
  );
};
