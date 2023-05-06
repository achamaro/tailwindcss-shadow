import { clamp } from "lodash-es";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";

export type DragPosition = [number, number];
export type PositionState = [
  DragPosition,
  Dispatch<SetStateAction<DragPosition>>
];
export type DragState = {
  isDragging: boolean;
};

/**
 * 0から1の範囲の座標を返す
 * @param initialPosition - 初期座標
 * @param containerRef - ハンドルにドラッグ開始ハンドラーを設定している場合はコンテナ要素への参照を指定する
 * @returns
 */
export function useDragOnRect(
  [position, setPosition]: [DragPosition, (value: DragPosition) => void],
  containerRef?: RefObject<Element>
) {
  const [isDragging, setIsDragging] = useState(false);
  const positionRef = useRef(position);
  positionRef.current = position;

  const dragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startPosition = [...positionRef.current];

      const currentTarget = e.currentTarget;

      let handleMove: (e: MouseEvent) => void;
      if (containerRef) {
        // ハンドルにドラッグ開始ハンドラーを設定している場合は
        // 開始地点からの移動量を元に座標を更新する
        const startMousePosition = [e.clientX, e.clientY];

        handleMove = (e: MouseEvent) => {
          const rect = containerRef.current!.getBoundingClientRect();
          const delta = [
            [e.clientX, rect.width],
            [e.clientY, rect.height],
          ].map(([pos, dimension], i) => {
            return (pos - startMousePosition[i]) / dimension;
          });

          setPosition(
            startPosition.map((p, i) => {
              return clamp(p + delta[i], 0, 1);
            }) as [number, number]
          );
        };
      } else {
        handleMove = (e: MouseEvent) => {
          const rect = currentTarget.getBoundingClientRect();
          const x = clamp(e.clientX - rect.left, 0, rect.width) / rect.width;
          const y = clamp(e.clientY - rect.top, 0, rect.height) / rect.height;

          setPosition([x, y]);
        };

        // コンテナそのものにドラッグ開始ハンドラーを設定している場合は
        // 座標を更新する
        handleMove(e.nativeEvent as MouseEvent);
      }

      function handleUp() {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
      }

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [containerRef, setPosition, setIsDragging]
  );

  return {
    isDragging,
    dragStart,
  };
}
