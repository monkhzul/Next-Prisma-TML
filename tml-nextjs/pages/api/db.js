// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const data = await prisma.$queryRaw`SELECT [TradeShopId], [Name], [FullAddress], [DateRemove] FROM [SMTTerms].[dbo].[t_TradeShops]`
  res.status(200).send(data)
}
