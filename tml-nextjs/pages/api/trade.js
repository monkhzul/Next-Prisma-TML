// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const data = await prisma.$queryRaw`select distinct b.Name, b.TradeShopId from SMTTerms.dbo.t_SaleRep_TradeShops a inner join
    SMTTerms.dbo.t_tradeshops b on a.TradeShopID = b.TradeShopId and SectorID = 2`;
    res.status(200).json(data)
  }
  catch {
    res.status(500).json({ error: 'failed to load data' })
  }
}
