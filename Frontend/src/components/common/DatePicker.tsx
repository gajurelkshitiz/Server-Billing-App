import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css"
import { BSToAD } from 'bikram-sambat-js';

import './datePicker.css'

type Props = {
    formData: Record<string, any>; // Holds current form values
    handleInputChange: (name: string, value: string | File | null) => void; // Updates form values
    fieldName: string;
    position?: "before" | "after";
}

const DateNepali = ({handleInputChange , formData, fieldName, position = "after"} : Props) => {
  return (
    <div className="relative">
      <NepaliDatePicker
        inputClassName="form-control pr-24" // Add right padding to make space for AD date
        className="m-auto border-[1px] rounded-lg border-zinc-300 w-[100%]"
        value={formData[fieldName] || ""}
        onChange={(value: string) => {
          console.log("Selected date value:", value);
          console.log("Converted date in AD: ", BSToAD(value));
          handleInputChange(fieldName, value);
        }}
        options={{ calenderLocale: "ne", valueLocale: "en" }}
      />
      {formData[fieldName] && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 bg-white px-1 pointer-events-none">
          {BSToAD(formData[fieldName])}
        </div>
      )}
    </div>
  )
}

export default DateNepali;