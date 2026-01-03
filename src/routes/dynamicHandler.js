// dynamicHandler.js
export const handleDynamicRequest = (prisma, modelName, action) => {
  return async (req, res) => {
    try {
      const model = prisma[modelName];
      let result;

      switch (action) {
        case 'findMany':
          result = await model.findMany();
          break;
        case 'findUnique':
          result = await model.findUnique({ where: { id: parseInt(req.params.id) } });
          break;
        case 'create':
          result = await model.create({ data: req.body });
          break;
        case 'update':
          result = await model.update({ 
            where: { id: parseInt(req.params.id) }, 
            data: req.body 
          });
          break;
        case 'delete':
          await model.delete({ where: { id: parseInt(req.params.id) } });
          return res.status(204).send();
        default:
          return res.status(400).json({ error: "Unsupported action" });
      }

      if (!result && action === 'findUnique') {
        return res.status(404).json({ error: "Not found" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};