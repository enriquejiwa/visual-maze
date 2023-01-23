export interface GridNodeData {
    isWall?: boolean;
    isStart?: boolean;
    isFinish?: boolean;
    isVisited?: boolean;
    isPath?: boolean;
    prevNode?: Coordinates;
}

export interface MouseDownState {
    isMouseDown?: boolean;
    isStart?: boolean;
    isFinish?: boolean;
}

export interface Coordinates {
    row: number;
    col: number;
}

export interface PathfindingReturn {
    visited: Coordinates[];
    path?: Coordinates[];
}
