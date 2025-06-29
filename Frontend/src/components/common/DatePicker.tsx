import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css"

import './datePicker.css'

type Props = {
    formData: Record<string, any>; // Holds current form values
    handleInputChange: (name: string, value: string | File | null) => void; // Updates form values
    fieldName: string;
    position?: "before" | "after";
}


const DateNepali = ({handleInputChange , formData, fieldName, position = "after"} : Props) => {
  return (
      <NepaliDatePicker
        inputClassName="form-control"
        className="m-auto border-[1px] rounded-lg border-zinc-300 w-[100%]"
        value={formData[fieldName] || ""}
        onChange={(value: string) => handleInputChange(fieldName, value)}
        options={{ calenderLocale: "ne", valueLocale: "en" }}
      />

  )
}

export default DateNepali;