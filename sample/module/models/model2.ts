import { OriProps,IOriModel } from "../../../"; 

export default class Model2 extends IOriModel
{
    @OriProps({tags:'readonly'})
    sex:string;
    constructor(
        fields?: {
            sex?: string, 
        })
    {
        
        super();  
        if (fields) 
        {
            Object.assign(this, fields); 
        }
    }
}