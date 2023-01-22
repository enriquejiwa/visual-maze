import { useEffect, useRef, useState } from "react";
import GridNode from "./components/gridNode";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { GridNodeData } from "./types/grid.type";

function App() {
    const { height, width } = useWindowDimensions();
    const [grid, setGrid] = useState<GridNodeData[][]>(
        createGrid(Math.floor(height / 24) - 4, Math.floor(width / 24) - 4)
    );
    const [isMouseDown, setIsMouseDown] = useState(false);
    const isMouseDownState = useRef<boolean>();
    isMouseDownState.current = isMouseDown;

    const setGridWall = (row: number, col: number) => {
        setGrid((prevGrid) => {
            return prevGrid.map((rowOfNodes, rowIndex) => {
                return rowOfNodes.map((node, nodeIndex) => {
                    if (rowIndex === row && nodeIndex === col) {
                        return {
                            ...node,
                            isWall: !node.isWall,
                        };
                    }
                    return node;
                });
            });
        });
    };

    const handleMouseDown = (row: number, col: number) => {
        if (grid[row][col].isStart || grid[row][col].isFinish) return;
        setIsMouseDown(true);
        setGridWall(row, col);
    };
    const handleMouseUp = () => {
        setIsMouseDown(false);
    };
    const handleMouseEnter = (row: number, col: number) => {
        if (!isMouseDownState.current) return;
        if (grid[row][col].isStart || grid[row][col].isFinish) return;
        setGridWall(row, col);
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
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
                                        onMouseUp={() => handleMouseUp()}
                                        onMouseEnter={() =>
                                            handleMouseEnter(
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
    if (rows > 20 && columns > 20) {
        grid[10][10].isStart = true;
        grid[rows - 11][columns - 11].isFinish = true;
    } else {
        grid[0][0].isStart = true;
        grid[rows - 1][columns - 1].isFinish = true;
    }
    return grid;
};

const createNode = (): GridNodeData => {
    return {
        isWall: false,
        isStart: false,
        isFinish: false,
        isVisited: false,
        isShortestPath: false,
    };
};

export default App;
