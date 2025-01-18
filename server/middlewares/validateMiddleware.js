const validateMiddleware = (schema, data) => {
  try {
    schema.parse(data);
    console.log("success");
  } catch (error) {
    console.log(error);
    throw error(error);
  }
};

export default validateMiddleware;
