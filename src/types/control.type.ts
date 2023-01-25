import { GridNodeData, PathfindingReturn } from "./grid.type";

export interface Control {
    isPlaying?: boolean;
    isComputing?: boolean;
    step?: number;
    speed: 1 | 2 | 4;
}

export interface Resolution extends PathfindingReturn {
    initial: GridNodeData[][];
}
