import React from 'react';
import {Autocomplete, CircularProgress, InputAdornment, Paper, TextField} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {selectAuth, updateWarehouse} from "../../../store/reducers/authSlice";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {IWarehouseOption} from "../../../models/IWarehouse";
import warehouseService from "../../../services/WarehouseService";

const AutocompleteInput: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly IWarehouseOption[]>([]);
    const loading = open && options.length === 0;
    const {user} = useAppSelector(selectAuth)
    const defaultValue = user!.warehouse!

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            try {
                let data: any = await warehouseService.getOptionWarehouses()

                if (active) {
                    if (data.length === 0) {
                        enqueueSnackbar('Не найдено ни одного склада', {variant: 'info'})
                        setOpen(false)
                    } else setOptions(data)
                }
            } catch (error: any) {
                setOpen(false)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })();

        return () => {
            active = false;
        };
    }, [enqueueSnackbar, loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const handleChange = (value: IWarehouseOption) => {
        dispatch(updateWarehouse(value))

        navigate(0)
    }

    return (
        <Autocomplete
            value={defaultValue}
            onChange={(event, value) => handleChange(value || defaultValue)}
            fullWidth
            open={open}
            size="small"
            disableClearable
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            PaperComponent={(paperProps) => <Paper {...paperProps} sx={{mt: 2}}/>}
            renderInput={(params) => (
                <TextField
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <InputAdornment position='end' sx={{mr: 4}}>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </InputAdornment>
                        ),
                    }}
                />
            )}
        />
    );
};

export default AutocompleteInput;