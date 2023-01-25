import { GridNodeData, PathfindingReturn } from "./grid.type";

export interface Control {
    isPlaying?: boolean;
    isComputing?: boolean;
    step?: number;
}

export interface Resolution extends PathfindingReturn {
    initial: GridNodeData[][];
}
