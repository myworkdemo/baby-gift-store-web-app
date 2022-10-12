import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
    //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd());
  console.log('##jsonDirectory : ', jsonDirectory)
   //Read the json data file data.json
   const fileContents = await fs.readFile(jsonDirectory + '/pages/api/example.json');

   const fullPath = path.dirname("D:/");
   try{

    await fs.copyFile(jsonDirectory + '/prisma/prisma/database/baby-gift-store-app.db', "D:/demoApp/baby-gift-store-app.db");
    console.log("File Copied...");

   }catch(error){
    console.log(error)
   }

   //Return the content of the data file in json format
   res.status(200).json(JSON.stringify(JSON.parse(fileContents)));
}
