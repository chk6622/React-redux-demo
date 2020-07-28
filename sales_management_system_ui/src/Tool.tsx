export default class Tool{

    public static isNullString(str:string):boolean{
        let bReturn: boolean = false;
        if (str===null||str===undefined||str.replace(/(^s*)|(s*$)/g, "").length ===0)
        {
        
            bReturn=true;
        
        }
        return bReturn;
    }
}