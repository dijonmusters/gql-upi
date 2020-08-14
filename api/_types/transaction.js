const types = `
  type Transaction {
    id: String!
    status: String
    description: String
    amount: Amount
    account: Account
    tags: [Tag]
  }
`

export default types
