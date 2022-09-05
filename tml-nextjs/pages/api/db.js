// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function getServerSideProps(req, res) {
  const data = await prisma.$queryRaw`  select t.id, t.tradeshopid, t.mmonth, t.discounttype, t.Amount, t.state, 
  CONVERT(varchar, t.createdate,120) createdate, t.createUser, t.OlgosonAmount
  , b.Name from SMTExchange_Anungoo.dbo.t_DiscountTML t inner join SMTTerms.dbo.t_tradeshops b 
   on t.tradeshopid = b.TradeShopId`
  res.status(200).send(data)
}
