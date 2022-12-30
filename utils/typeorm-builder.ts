export const getSortParams = (req: any) => {
  let rs = {} as any;
  if (req.query.sort) {
    let items = req.query.sort.split(",");
    items.forEach((element: string) => {
      if (element[0] === "-") {
        rs[element.slice(1)] = "DESC";
      } else {
        rs[element] = "ASC";
      }
    });
  }

  return rs;
};
