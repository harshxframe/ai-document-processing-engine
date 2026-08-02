export const uploadController = (req, res) => {
  const documentID = req.documentId;
  const file = req.file;
  res.send(documentID);

  try {
  } catch (e) {}
};
