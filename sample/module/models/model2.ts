import { OriProps,IOriModel } from "../../../"; 

export default class Model2 extends IOriModel
{
    @OriProps({})
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