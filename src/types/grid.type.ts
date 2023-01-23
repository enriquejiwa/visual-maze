export interface GridNodeData {
    isWall?: boolean;
    isStart?: boolean;
    isFinish?: boolean;
    isVisited?: boolean;
    isShortestPath?: boolean;
}

export interface MouseDownState {
    isMouseDown?: boolean;
    isStart?: boolean;
    isFinish?: boolean;
}