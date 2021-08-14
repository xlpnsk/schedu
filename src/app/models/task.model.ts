export interface Task{
    id:number;
    description:string
    startDate:string
    stopDate:string
    staffId:number
    typeId:number
    startTime:string
    stopTime:string
    day:number
}

export interface AdminTask{
    id:number;
    description:string
    startDate:string
    stopDate:string
    Staff:{
        email:string
    }
    TaskType:{
        name:string
    }
    startTime:string
    stopTime:string
    day:number
}

