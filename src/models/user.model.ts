export class User {
  constructor(
    public email: string,
    public token: string,
    public username: string,
    public bio: string,
    public image: string,
    public goodCount: number,
    public orderCount: number,
    public idCard : string,
    public verifyName :string,
    public phone:number,
    public tradePrd:number,
    public following:Array<string>,
    public block:Array<string>,
    public nativeCurrency :string,
    public deviceToken: string,
    public followers:Array<string>
  ){}
  }
  