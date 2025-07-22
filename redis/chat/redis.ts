import { createClient } from "redis";

export const pub = createClient(); 
export const sub = createClient(); 

export const publisher = await pub.connect();
export const subscriber = await sub.connect();







