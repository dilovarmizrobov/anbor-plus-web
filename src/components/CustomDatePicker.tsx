import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import {DatePicker} from "@mui/x-date-pickers";
import {TextField} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import React, {useState} from "react";
import moment from "moment";
import {useAppDispatch} from "../store/hooks";

const CustomDatePicker: React.FC<{changeDate: Function, label: string}> = ({changeDate, label}) => {
    const dispatch = useAppDispatch()
    const [datePicker, setDatePicker] = useState<Date | null>(null);

    const handleDateChange = (newValue: Date | null) => {
        if (newValue === null) dispatch(changeDate(undefined))

        if (moment(newValue).isValid()) dispatch(changeDate(moment(newValue).format('YYYY-MM-DD')))

        setDatePicker(newValue)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
            <DatePicker
                label={label}
                mask={'__.__.____'}
                value={datePicker}
                onChange={handleDateChange}
                renderInput={(params) => <TextField sx={{width: 250}} size="small" {...params} />}
            />
        </LocalizationProvider>
    )
}

export default React.memo(CustomDatePicker)
