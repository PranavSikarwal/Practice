import React from "react";
import { useRef, useState, useEffect } from "react";

const ImageUpload = (props) => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();
    useEffect(()=>{
        if(!file){
            return;
        } 
        const fileReader = new FileReader();
        fileReader.onload = ()=>{
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    },[file])

    const pickedImage = (event) => {
        let pickedFile;
        //we create temp variable fileIsValid becz setIsValid is not syncronous hence we need to maintain a copy or do async await
        let fileIsValid = isValid;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            fileIsValid = true;
            setIsValid(true);
        } else {
            fileIsValid = false;
            setIsValid(false);
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };
    const {height, width}= props;
    return (
        <div>
            <input
                ref={filePickerRef}
                id={props.id}
                type="file"
                style={{ display: "none" }}
                accept=".png,.jpg,.jpeg"
                onChange={pickedImage}
            />
            <div
                style={{ overflow:"hidden",height:height, width: width, backgroundColor: "yellow" }}
                className="imageUpload__preview"
            >
               {previewUrl &&  <img style={{height: height, width: width}} src={previewUrl} alt="preview" /> }
               {!previewUrl && <p>Pick an Image</p> }
            </div>
            <button type="button" onClick={pickImageHandler}>Pick Image</button>
            <div className="uploadImg"></div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;
