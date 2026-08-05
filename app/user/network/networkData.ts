export interface NetworkUser {
  id: number;
  name: string;
  username: string;
  rank: string;
  status: "Active" | "Inactive";
  leftBusiness: number;
  rightBusiness: number;
  avatarColor: string;
  children?: NetworkUser[];
}

export const networkData: NetworkUser = {
  id: 1,
  name: "John Anderson",
  username: "john001",
  rank: "Diamond",
  status: "Active",
  leftBusiness: 48500,
  rightBusiness: 52700,
  avatarColor: "bg-violet-500",

  children: [
    {
      id: 2,
      name: "Sarah Wilson",
      username: "sarah01",
      rank: "Gold",
      status: "Active",
      leftBusiness: 18200,
      rightBusiness: 15100,
      avatarColor: "bg-sky-500",

      children: [
        {
          id: 4,
          name: "Emma Smith",
          username: "emma11",
          rank: "Silver",
          status: "Active",
          leftBusiness: 5000,
          rightBusiness: 4200,
          avatarColor: "bg-orange-500",
        },
        {
          id: 5,
          name: "Daniel Lee",
          username: "daniel88",
          rank: "Silver",
          status: "Inactive",
          leftBusiness: 3200,
          rightBusiness: 2900,
          avatarColor: "bg-pink-500",
        },
      ],
    },

    {
      id: 3,
      name: "Michael Brown",
      username: "mike99",
      rank: "Gold",
      status: "Active",
      leftBusiness: 23100,
      rightBusiness: 19400,
      avatarColor: "bg-emerald-500",

      children: [
        {
          id: 6,
          name: "Olivia Jones",
          username: "olivia7",
          rank: "Silver",
          status: "Active",
          leftBusiness: 3800,
          rightBusiness: 4500,
          avatarColor: "bg-red-500",
        },
        {
          id: 7,
          name: "James Clark",
          username: "james55",
          rank: "Silver",
          status: "Active",
          leftBusiness: 6200,
          rightBusiness: 5100,
          avatarColor: "bg-cyan-500",
        },
      ],
    },
  ],
};