import { Coordinates, GridNodeData, PathfindingReturn } from "../types/grid.type";

export function dfs(grid: GridNodeData[][], start: Coordinates): PathfindingReturn {
    const visited = [start];
    const stack = [start];
    let finish: Coordinates | undefined;
    while (stack.length > 0) {
        const { row, col } = stack.pop() as Coordinates;
        if (grid[row][col].isFinish) {
            finish = { row, col };
            break;
        }
        if (grid[row][col].isVisited) continue;
        grid[row][col].isVisited = true;
        visited.push({ row, col });
        const neighbors = getNeighbors(grid, row, col);
        for (const neighbor of neighbors) {
            grid[neighbor.row][neighbor.col].prevNode = { row, col };
            stack.push(neighbor);
        }
    }
    if (!finish) return {visited};
    const path = getPath(grid, finish);  
    return {visited, path};
}

export function getPath(grid: GridNodeData[][], finish: Coordinates) {
    const path = [finish];
    let { row, col } = finish;
    while (grid[row][col].prevNode) {
        const { row: r, col: c } = grid[row][col].prevNode as Coordinates;
        path.push({ row: r, col: c });
        row = r;
        col = c;
    }
    return path;
}

export function getNeighbors(grid: GridNodeData[][], row: number, col: number) {
    const neighbors: Coordinates[] = [];
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
    ];
    for (const { row: r, col: c } of directions) {
        if (
            row + r >= 0 &&
            row + r < grid.length &&
            col + c >= 0 &&
            col + c < grid[0].length
        ) {
            if (
                !grid[row + r][col + c].isWall &&
                !grid[row + r][col + c].isVisited
            ) {
                neighbors.push({ row: row + r, col: col + c });
            }
        }
    }
    return neighbors;
}
