require('dotenv').config();
import { Logger } from '@nestjs/common';

export const APP_PORT               : string = process.env.BLR_APP_PORT;
export const ENVIRONMENT            : string = process.env.BLR_ENVIRONMENT;
export const DB_URL                 : string = process.env.BLR_DB_URL;

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