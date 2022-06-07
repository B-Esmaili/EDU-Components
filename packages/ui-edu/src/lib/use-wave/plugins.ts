export interface RegionOptions {
  id: string;
  start: number;
  end: number;
  loop?: boolean;
  drag?: boolean;
  resize?: boolean;
  color? : string;
  minLength?:number;
  maxLength?:number;  
}

export interface IRegion{
  addRegion : (options : RegionOptions)=>void;
  clearRegions : ()=>void;
}

