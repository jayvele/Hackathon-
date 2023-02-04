function checkRequired(req, fields) {
  // let absent = fields.filter(
  //   (e) =>
  //     !Object.hasOwnProperty.bind({ ...req.body, ...req.query })(e) ||
  //     req[e] == null
  // );
  let absent = fields.filter(
    (e) => req.body[e] == undefined || req.body[e] == ""
  );
  if (absent.length)
    throw new Error(`[${absent.join(",")}] Fields not present`);
}

export { checkRequired };
