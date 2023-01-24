import { Coordinates } from "./grid.type";

export interface Control {
    isPlaying?: boolean;
    isComputing?: boolean;
    step?: number;
}

export interface Resolution {
    visited: Coordinates[];
    path?: Coordinates[];
}
