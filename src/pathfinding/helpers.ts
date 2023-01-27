import { Coordinates, GridNodeData } from "../types/grid.type";

export function getPath(grid: GridNodeData[][], finish: Coordinates) {
    const path = [finish];
    let { row, col } = finish;
    while (grid[row][col].prevNode) {
        const { row: r, col: c } = grid[row][col].prevNode as Coordinates;
        path.push({ row: r, col: c });
        grid[r][c].isPath = true;
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