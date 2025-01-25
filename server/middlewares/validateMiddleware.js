const validateMiddleware = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    error?.issues?.map((obj) => console.log(obj?.message));
    res.status(400).json({ error: error?.issues[0].message });
  }
};
export default validateMiddleware;
