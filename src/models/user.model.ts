export class User {
  constructor(
    public email: string,
    public token: string,
    public username: string,
    public bio: string,
    public image: string,
    public orderCount: number,
    public phone: number,
    public following: Array<string>,
    public block: boolean,
    public nativeCurrency: string,
    public deviceToken: string,
    public followers: Array<string>,
    public ratings: Array<number>,
    public active : boolean,
    public verifyStatus:number,
    public passport:string,
    public firstName:string,
    public lastName:string,
    public gender:string,
    public country:string
  ) {}
}
