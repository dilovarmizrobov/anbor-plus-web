import React, {useEffect, useState} from 'react';
import {InputAdornment, TextField} from "@mui/material";
import {FiSearch} from "react-icons/fi";
import useDebounce from "../hooks/useDebounce";
import {useAppDispatch} from "../store/hooks";
import {reset, setQuery} from "../store/reducers/tableSearchSlice";

const TableSearch = () => {
    const dispatch = useAppDispatch()
    const [inputValue, setInputValue] = useState('')
    const debouncedQuery = useDebounce(inputValue, 500)

    useEffect(() => {
        dispatch(setQuery(inputValue))

        return () => {
            dispatch(reset())
        }
    }, [debouncedQuery])

    return (
        <TextField
            sx={{width: 300}}
            size="small"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <FiSearch/>
                    </InputAdornment>
                )
            }}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Поиск"
            value={inputValue}
            variant="outlined"
        />
    );
};

export default React.memo(TableSearch);