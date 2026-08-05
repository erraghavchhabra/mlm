export interface NetworkMember {
  id: number;
  ucode: string;
  full_name: string;
  rcode: string | null;
  position: "L" | "R" | null;
  paid_status: number;
  status: string;
  left_business: number;
  right_business: number;
  card_color: "green" | "yellow" | "red";
  children?: NetworkMember[];
}

export interface TreeNode {
  id: number;
  ucode: string;
  full_name: string;
  rcode: string | null;
  position: "L" | "R" | null;
  paid_status: number;
  status: string;
  left_business: number;
  right_business: number;
  card_color: "green" | "yellow" | "red";
}

export interface NetworkTreeData {
  root: TreeNode | null;
  left1: TreeNode | null;
  right1: TreeNode | null;
  left2L: TreeNode | null;
  left2R: TreeNode | null;
  right2L: TreeNode | null;
  right2R: TreeNode | null;
}