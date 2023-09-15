import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/*
 * Dropdown menu and those generic things use this tailwind and classname merging thingy,
 * Will be replaced by nextui or similiar library!?!?!?!?!? :-) hopefully
*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
