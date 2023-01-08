require('dotenv').config();
import { Logger } from '@nestjs/common';

export const APP_PORT               : string = process.env.APP_PORT;
export const ENVIRONMENT            : string = process.env.ENVIRONMENT;
export const DB_URL                 : string = process.env.DB_URL;
export const SECRET                 : string = process.env.SECRET;

export async function validate(){
    const logger = new Logger(); 
    
    let check : boolean = true;  
    for(let k of Object.keys(this).filter(x => x != 'validate')){
        if(!this[k]){
            logger.error(`El secreto [${k}] no existe`)
            check = false
        }
    }      
    return check;
}