const validateMiddleware = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    error?.issues?.map((obj) => console.log(obj?.message));
    res
      .status(400)
      .json({ errors: [...error?.issues?.map((obj) => obj?.message)] });
  }
};
export default validateMiddleware;
