import { Coordinates, GridNodeData } from "../types/grid.type";
import { getNeighbors, getPath } from "./helpers";

export function bfs(grid: GridNodeData[][], start: Coordinates) {
    const visited = [start];
    const queue = [start];
    let finish: Coordinates | undefined;
    while (queue.length > 0) {
        const { row, col } = queue.shift() as Coordinates;
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
            queue.push(neighbor);
        }
    }
    if (!finish) return { visited, solved: grid };
    const path = getPath(grid, finish);
    return { visited, path, solved: grid };
}
