"use client" // This component must be a client component

import {
    // ImageKitAbortError,
    // ImageKitInvalidRequestError,
    // ImageKitServerError,
    // ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps{
    onSucess:(res:any) => void
    onProgress?: (progress: number) => void 
    fileType?: "image"|"video"
}

const FileUpload = ({
    onSucess,
    onProgress,
    fileType
}: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //optional Validation
    const validateFile = (file:File)=>{
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                setError("Please upload a valid video?")
            }
        }
        if(file.size > 100*1024*1024){
            setError("File size must be less than 100 MB")
        }
        return true 
    }

    const handleFileChange = async  (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if(!file || !validateFile(file)) return 

        setUploading(true)
        setError(null)

        try {
            const authRes = await fetch("/api/auth/imagekit-auth")
            const auth = await authRes.json()

            const res = await upload({
                expire: auth.expire,
                token: auth.token,
                signature: auth.signature,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                file,
                fileName: file.name,
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    if(event.lengthComputable && onProgress){
                        const precent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(precent))
                    }
                },
                
            })

            onSucess(res)

        } catch (error) {
            console.error("Upload Failed", error)
        }finally{
            setUploading(false) 
        }
    }

    return (
        <>
            <input type="file" placeholder="upload"
            accept={fileType ==="video"? "video/*": "image/*"} 
            onChange={handleFileChange} />
            {uploading && (
                <span>Loading....</span>
            )}
        </>
    );
};

export default FileUpload;