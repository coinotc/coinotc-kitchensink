export class Profile {
  constructor(
    public orderCount:number,
    public goodCount:number,
    public volume: string,
    public following:Array<string>,
    public followers:Array<string>
  ){}
  }
  