export default class OdataModel
{
    $count:boolean;
    $skip:number;
    $top:number;
    $select:string;
    $filter:string;
    $orderby:string;
    public constructor(
        fields?: {
            $count?:boolean;
            $skip?:number;
            $top?:number;
            $select?:string;
            $filter?:string;
            $orderby?:string;
        }) {
        if (fields) Object.assign(this, fields);
    }
}