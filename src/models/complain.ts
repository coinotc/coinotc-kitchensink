export class complain{
    constructor(
        public username: string,
        public orderId: string,
        public admin: string,
        public type: string,
        public content: string,
        public status:number,
        public message:Array<any>,
        public title:string,
        public createDate:Date
    ){
    }
}