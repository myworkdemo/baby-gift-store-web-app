// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  switch (req.method) {
    case "POST":
      return save(req, res);
      break;
    case "PUT":
      return updateRecord(req, res);
      break;
    case "GET":
      return getRecord(req, res);
      break;
    case "DELETE":
      return deleteRecord(req, res);
      break;
    default:
      return res.status(405).end();
      break;
  }
};

const saveRecord = () => {
  console.log("saveRecord");
};

const updateRecord = () => {
  console.log("updateRecord");
};

const getRecord = (res) => {
  console.log("getRecord");
  return res.status(200).json("post");
};

const deleteRecord = () => {
  console.log("deleteRecord");
};
