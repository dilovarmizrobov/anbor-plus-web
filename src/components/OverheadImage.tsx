import React from 'react';
import {Badge, Grid, IconButton} from "@mui/material";
import {MdClose} from "react-icons/md";
import {TbCameraPlus} from "react-icons/tb";
import {styled} from "@mui/material/styles";
import {PATH_OVERHEADS_IMAGE} from "../constants";

const StyledImage = styled('div')(() => ({
    height: 70,
    width: 70,
    borderRadius: 10,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
}))

const StyledIconButton = styled(IconButton)(() => ({
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
    padding: 1,
    '&:hover': {
        backgroundColor: 'white',
    }
}))

const StyledCameraPlusBox = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    width: 70,
}))

export interface IOverheadImage {
    url: string;
    name?: string;
}

interface OverheadImageProps {
    images: IOverheadImage[];
    setImages: Function;
    setImageFiles: Function;
    imageFiles: File[];
}

export const mapToImages = (imageNames: string[]) => imageNames.map(item => ({
    url: PATH_OVERHEADS_IMAGE + item,
    name: item
} as IOverheadImage))

const OverheadImage: React.FC<OverheadImageProps> = ({images, setImages, imageFiles, setImageFiles}) => {
    const NumberOfImage = 3;

    const handleDeleteImage = (index: number) => {
        let newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)

        let newImageFiles = [...imageFiles]
        newImageFiles.splice(index, 1)
        setImageFiles(newImageFiles)
    }

    return (
        <Grid container spacing={3}>
            {images.map((image, index) => (
                <Grid item xs="auto" key={index}>
                    <Badge
                        badgeContent={
                            <StyledIconButton size="small" onClick={() => handleDeleteImage(index)}>
                                <MdClose size={14}/>
                            </StyledIconButton>
                        }
                    >
                        <StyledImage sx={{backgroundImage: `url(${image.url})`}}/>
                    </Badge>
                </Grid>
            ))}
            {images.length < NumberOfImage && (
                <Grid item xs="auto">
                    <StyledCameraPlusBox>
                        <label>
                            <input
                                multiple
                                accept="image/*"
                                type="file"
                                style={{display: "none"}}
                                onChange={(e) => {
                                    let files = (e.target as HTMLInputElement).files!;
                                    let newImages = [...images]
                                    let newImageFiles = [...imageFiles]

                                    for (let i = 0; i < files.length; i++) {
                                        newImages.push({url: URL.createObjectURL(files[i])} as IOverheadImage)
                                        newImageFiles.push(files[i])
                                        if ((NumberOfImage - images.length) === i + 1) break;
                                    }

                                    setImages(newImages)
                                    setImageFiles(newImageFiles);

                                    (e.target as HTMLInputElement).value = ''
                                }}
                            />
                            <IconButton size="large" component="span">
                                <TbCameraPlus size={30}/>
                            </IconButton>
                        </label>
                    </StyledCameraPlusBox>
                </Grid>
            )}
        </Grid>
    );
};

export default OverheadImage;