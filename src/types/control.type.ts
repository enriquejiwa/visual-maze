import { PathfindingReturn } from "./grid.type";

export interface Control {
    isPlaying?: boolean;
    step?: number;
    speed: 1 | 2 | 4;
    algorithm: AlgorithmOption;
}

export interface AlgorithmOption {
    value: Algorithm;
    label: string;
}

export type Algorithm = "bfs" | "dfs";

export interface Resolution extends PathfindingReturn {}
