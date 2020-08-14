const categories = async (parent, args, { dataSources }, info) => {
  return await dataSources.categoryAPI.all()
}

const category = async (parent, { id }, { dataSources }, info) => {
  return await dataSources.categoryAPI.find(id)
}

export { categories, category }
