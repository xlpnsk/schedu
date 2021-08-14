export interface Staff{
    id:number;
    firstName:string;
    lastName:string;
    title:string;
    email:string;
    userId:string;
    roleId:number
}

export interface AdminStaff{
    id:number;
    firstName:string;
    lastName:string;
    title:string;
    email:string;
    userId:string;
    Roles:{
        name:string;
    }
}