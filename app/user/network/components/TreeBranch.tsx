"use client";

import NetworkNode from "./NetworkNode";
import TreeConnector from "./TreeConnector";
import { NetworkMember } from "../types";
import { TreeNode } from "../types";

interface TreeBranchProps {
  member: NetworkMember;
  onNodeClick: (node: TreeNode) => void;
}

export default function TreeBranch({
  member,
  onNodeClick,
}: TreeBranchProps) {
  const children = member.children ?? [];

  return (
    <div className="flex flex-col items-center gap-10">

      {/* Parent */}

      <NetworkNode node={member} onNodeClick={onNodeClick} />

      {/* Children */}

      {children.length > 0 && (
        <>
        

          {/* Child Nodes */}

          <div className="flex items-start justify-center gap-28 xl:gap-36">
            {children.map((child) => (
              <TreeBranch
                key={child.id}
                member={child}
                onNodeClick={onNodeClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}