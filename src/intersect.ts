export const listIntersection = (list1: any[], list2: any[]) => {
  return list1.some((t) => list2.includes(t));
};

export const getListIntersection = (list1: any[], list2: any[]) => {
  return list1.filter((t) => list2.includes(t));
};
