import path from "path";
import fs from "fs";
import { GoogleAIFileManager} from '@google/generative-ai/server'
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
}

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY); 

export async function uploadImage(tempImage: string, mimeType: string) {
    const extension = mimeType.split('/')[1];
    const tempFilePath = path.join(__dirname, `temp-image.${extension}`);
    fs.writeFileSync(tempFilePath, tempImage);

    console.log("called");
    

    const sample_file =  await fileManager.uploadFile(tempFilePath,{
        mimeType: mimeType,
        displayName: "Measure"
    });
    console.log(sample_file);
    
    fs.unlinkSync(tempFilePath);
    return sample_file;
}