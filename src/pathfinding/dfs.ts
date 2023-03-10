import {
    Coordinates,
    GridNodeData,
    PathfindingReturn,
} from "../types/grid.type";
import { getNeighbors, getPath } from "./helpers";

export function dfs(
    grid: GridNodeData[][],
    start: Coordinates
): PathfindingReturn {
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
    if (!finish) return { visited, solved: grid };
    const path = getPath(grid, finish);
    return { visited, path, solved: grid };
}
