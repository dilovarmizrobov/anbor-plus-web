import React from 'react';
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {selectPreviewImage, setPreviewImageUrl} from "../store/reducers/previewImageSlice";
import {Dialog} from "@mui/material";
import {styled} from "@mui/material/styles";

const StyledImage = styled('img')(() => ({
    width: '100%',
    height: '100%',
}))

const PreviewImageModal = () => {
    const dispatch = useAppDispatch()
    const {previewImageUrl} = useAppSelector(selectPreviewImage)

    return (
        <Dialog
            maxWidth='md'
            onClose={() => dispatch(setPreviewImageUrl(undefined))}
            open={true}
        >
            <StyledImage src={previewImageUrl}/>
        </Dialog>
    );
};

export default PreviewImageModal;