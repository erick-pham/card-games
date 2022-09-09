export const generateCode = (length: number) => {
  // return (
  //   Math.random().toString(36).substring(2) +
  //   Math.random().toString(36).substring(2)
  // )
  //   .substring(0, length)
  //   .toLocaleUpperCase();
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
