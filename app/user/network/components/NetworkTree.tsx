"use client";

import { useState, useRef } from "react";
import NetworkNode from "./NetworkNode";
import EmptyNode from "./EmptyNode";
import { NetworkTreeData, TreeNode } from "../types";

interface Props {
  data: NetworkTreeData;
  onNodeClick: (node: TreeNode) => void;
}

export default function NetworkTree({ data, onNodeClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setDragging(false);
  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const { root, left1, right1, left2L, left2R, right2L, right2R } = data;

  // SVG connector dimensions
  const NODE_W = 96;
  const GAP_H = 80; // vertical gap between levels
  const L2_SPACING = 160; // horizontal spacing between level-2 siblings

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="
        relative overflow-x-auto overflow-y-visible
        cursor-grab active:cursor-grabbing
        py-10 select-none
        scrollbar-thin scrollbar-thumb-[#2B3164] scrollbar-track-transparent
      "
    >
      <div className="flex justify-center min-w-max px-20">
        {/* ── Root Level ── */}
        <div className="flex flex-col items-center">

          {/* Root node */}
          <div className="relative z-10">
            {root ? (
              <NetworkNode node={root} onNodeClick={onNodeClick} isRoot />
            ) : (
              <EmptyNode />
            )}
          </div>

          {/* Root → Level-1 connectors */}
          {(left1 || right1) && (
            <svg
              className="overflow-visible"
              width={NODE_W * 2 + L2_SPACING * 2}
              height={GAP_H}
              viewBox={`0 0 ${NODE_W * 2 + L2_SPACING * 2} ${GAP_H}`}
            >
              {/* vertical down from root */}
              <line
                x1="50%" y1={0}
                x2="50%" y2={GAP_H / 2}
                stroke="#2B3164" strokeWidth={2}
              />
              {/* horizontal bar */}
              <line
                x1="25%" y1={GAP_H / 2}
                x2="75%" y2={GAP_H / 2}
                stroke="#2B3164" strokeWidth={2}
              />
              {/* down to left1 */}
              <line
                x1="25%" y1={GAP_H / 2}
                x2="25%" y2={GAP_H}
                stroke="#2B3164" strokeWidth={2}
              />
              {/* down to right1 */}
              <line
                x1="75%" y1={GAP_H / 2}
                x2="75%" y2={GAP_H}
                stroke="#2B3164" strokeWidth={2}
              />
            </svg>
          )}

          {/* Level-1 nodes */}
          {(left1 || right1) && (
            <div className="flex gap-[200px] xl:gap-[260px] relative z-10">
              <div className="flex flex-col items-center">
                {left1 ? (
                  <NetworkNode node={left1} onNodeClick={onNodeClick} label="L" />
                ) : (
                  <EmptyNode label="L" />
                )}

                {/* L1 → L2 connectors */}
                {(left2L || left2R) && (
                  <>
                    <svg
                      className="overflow-visible"
                      width={NODE_W + L2_SPACING}
                      height={GAP_H}
                      viewBox={`0 0 ${NODE_W + L2_SPACING} ${GAP_H}`}
                    >
                      <line x1="50%" y1={0} x2="50%" y2={GAP_H / 2} stroke="#2B3164" strokeWidth={2} />
                      <line x1="25%" y1={GAP_H / 2} x2="75%" y2={GAP_H / 2} stroke="#2B3164" strokeWidth={2} />
                      <line x1="25%" y1={GAP_H / 2} x2="25%" y2={GAP_H} stroke="#2B3164" strokeWidth={2} />
                      <line x1="75%" y1={GAP_H / 2} x2="75%" y2={GAP_H} stroke="#2B3164" strokeWidth={2} />
                    </svg>
                    <div className="flex gap-[60px] xl:gap-[80px] relative z-10">
                      {left2L ? (
                        <NetworkNode node={left2L} onNodeClick={onNodeClick} label="L" small />
                      ) : (
                        <EmptyNode label="L" small />
                      )}
                      {left2R ? (
                        <NetworkNode node={left2R} onNodeClick={onNodeClick} label="R" small />
                      ) : (
                        <EmptyNode label="R" small />
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col items-center">
                {right1 ? (
                  <NetworkNode node={right1} onNodeClick={onNodeClick} label="R" />
                ) : (
                  <EmptyNode label="R" />
                )}

                {/* R1 → R2 connectors */}
                {(right2L || right2R) && (
                  <>
                    <svg
                      className="overflow-visible"
                      width={NODE_W + L2_SPACING}
                      height={GAP_H}
                      viewBox={`0 0 ${NODE_W + L2_SPACING} ${GAP_H}`}
                    >
                      <line x1="50%" y1={0} x2="50%" y2={GAP_H / 2} stroke="#2B3164" strokeWidth={2} />
                      <line x1="25%" y1={GAP_H / 2} x2="75%" y2={GAP_H / 2} stroke="#2B3164" strokeWidth={2} />
                      <line x1="25%" y1={GAP_H / 2} x2="25%" y2={GAP_H} stroke="#2B3164" strokeWidth={2} />
                      <line x1="75%" y1={GAP_H / 2} x2="75%" y2={GAP_H} stroke="#2B3164" strokeWidth={2} />
                    </svg>
                    <div className="flex gap-[60px] xl:gap-[80px] relative z-10">
                      {right2L ? (
                        <NetworkNode node={right2L} onNodeClick={onNodeClick} label="L" small />
                      ) : (
                        <EmptyNode label="L" small />
                      )}
                      {right2R ? (
                        <NetworkNode node={right2R} onNodeClick={onNodeClick} label="R" small />
                      ) : (
                        <EmptyNode label="R" small />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}