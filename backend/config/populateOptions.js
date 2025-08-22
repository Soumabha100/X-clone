const populateOptions = [
  {
    path: "userId",
    select: "name username profileImg",
  },
  {
    path: "comments.userId",
    select: "name username profileImg",
  },
];

export default populateOptions;