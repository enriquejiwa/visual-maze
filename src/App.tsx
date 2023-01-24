import { useRef, useState } from "react";
import GridNode from "./components/gridNode";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { dfs } from "./pathfinding/dfs";
import { Coordinates, GridNodeData, MouseDownState } from "./types/grid.type";

function App() {
    const { height, width } = useWindowDimensions();
    const [grid, setGrid] = useState<GridNodeData[][]>(
        createGrid(Math.floor(height / 24) - 4, Math.floor(width / 24) - 4)
    );
    const [start, setStart] = useState<Coordinates>(
        getStartCoordinates(
            Math.floor(height / 24) - 4,
            Math.floor(width / 24) - 4
        )
    );
    const [mouseDown, setMouseDown] = useState<MouseDownState>({});
    const isMouseDownState = useRef<MouseDownState>();
    isMouseDownState.current = mouseDown;

    const setGridWall = (row: number, col: number) => {
        setGrid((prevGrid) =>
            updateSingleGridNode(prevGrid, row, col, { isWall: true })
        );
    };

    const handleMouseDown = (row: number, col: number) => {
        if (grid[row][col].isStart) {
            setMouseDown({ isStart: true });
            return;
        } else if (grid[row][col].isFinish) {
            setMouseDown({ isFinish: true });
            return;
        }
        setMouseDown({ isMouseDown: true });
        setGridWall(row, col);
    };
    const handleMouseUp = (row: number, col: number) => {
        if (isMouseDownState.current?.isStart) {
            setStart({ row, col });
        }
        setMouseDown({});
    };
    const handleMouseEnter = (row: number, col: number) => {
        if (isMouseDownState.current?.isStart) {
            setGrid((prevGrid) =>
                updateSingleGridNode(prevGrid, row, col, { isStart: true })
            );
            return;
        } else if (isMouseDownState.current?.isFinish) {
            setGrid((prevGrid) =>
                updateSingleGridNode(prevGrid, row, col, { isFinish: true })
            );
            return;
        }
        if (!isMouseDownState.current?.isMouseDown) return;
        if (grid[row][col].isStart || grid[row][col].isFinish) return;
        setGridWall(row, col);
    };
    const handleMouseLeave = (row: number, col: number) => {
        if (isMouseDownState.current?.isStart) {
            setGrid((prevGrid) =>
                updateSingleGridNode(prevGrid, row, col, { isStart: true })
            );
            return;
        }
        if (isMouseDownState.current?.isFinish) {
            setGrid((prevGrid) =>
                updateSingleGridNode(prevGrid, row, col, { isFinish: true })
            );
            return;
        }
    };

    const handleDFS = () => {
        const { visited, path } = dfs(
            grid.map((row) => row.map((node) => ({ ...node }))),
            start
        );
        visualizeAlgorithm(visited, path);
    };

    const visualizeAlgorithm = (
        visited: Coordinates[],
        path?: Coordinates[]
    ) => {
        for (let i = 0; i < visited.length; i++) {
            setTimeout(() => {
                const { row, col } = visited[i];
                setGrid((prevGrid) =>
                    updateSingleGridNode(prevGrid, row, col, {
                        isVisited: true,
                    })
                );
            }, 100 * i);
        }
        if (!path) return;
        console.log(path);
        const delay = 100 * visited.length;
        for (let i = 0; i < path.length; i++) {
            setTimeout(() => {
                const { row, col } = path[i];
                setGrid((prevGrid) =>
                    updateSingleGridNode(prevGrid, row, col, {
                        isPath: true,
                    })
                );
            }, delay + 100 * i);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <button title="DFS" className="w-8 h-8" onClick={handleDFS}>
                DFS
            </button>
            <div>
                {grid.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="flex">
                            {row.map((node, nodeIndex) => {
                                return (
                                    <GridNode
                                        key={nodeIndex}
                                        {...node}
                                        onMouseDown={() =>
                                            handleMouseDown(rowIndex, nodeIndex)
                                        }
                                        onMouseUp={() =>
                                            handleMouseUp(rowIndex, nodeIndex)
                                        }
                                        onMouseEnter={() =>
                                            handleMouseEnter(
                                                rowIndex,
                                                nodeIndex
                                            )
                                        }
                                        onMouseLeave={() =>
                                            handleMouseLeave(
                                                rowIndex,
                                                nodeIndex
                                            )
                                        }
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const createGrid = (rows: number, columns: number): GridNodeData[][] => {
    const grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        const currentRow: GridNodeData[] = new Array(columns);
        for (let j = 0; j < columns; j++) {
            currentRow[j] = createNode();
        }
        grid[i] = currentRow;
    }
    const { row, col } = getStartCoordinates(rows, columns);
    grid[row][col].isStart = true;
    grid[rows - row - 1][columns - col - 1].isFinish = true;
    return grid;
};

const getStartCoordinates = (rows: number, columns: number): Coordinates => {
    if (rows > 20 && columns > 20) {
        return { row: 10, col: 10 };
    }
    return { row: 0, col: 0 };
};

const createNode = (): GridNodeData => {
    return {};
};

const updateSingleGridNode = (
    grid: GridNodeData[][],
    row: number,
    col: number,
    { isWall, isStart, isFinish, isVisited, isPath }: GridNodeData
) => {
    return grid.map((rowOfNodes, rowIndex) => {
        return rowOfNodes.map((node, nodeIndex) => {
            if (rowIndex === row && nodeIndex === col) {
                const newNode = { ...node };
                if (isWall) {
                    newNode.isWall = !node.isWall;
                }
                if (isStart) {
                    newNode.isStart = !node.isStart;
                }
                if (isFinish) {
                    newNode.isFinish = !node.isFinish;
                }
                if (isVisited) {
                    newNode.isVisited = !node.isVisited;
                }
                if (isPath) {
                    newNode.isPath = !node.isPath;
                }
                return newNode;
            }
            return node;
        });
    });
};

export default App;
