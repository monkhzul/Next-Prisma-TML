
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const tradeshopid = req.body.tradeshopid;
  const mmonth = req.body.mmonth;
  const discounttype = req.body.discounttype;
  const Amount = req.body.Amount;
  const state = req.body.state;
  const createUser = req.body.createUser;
  const UsedTotalAmount = req.body.UsedTotalAmount;
  
  const data = await prisma.$queryRaw`INSERT INTO [SMTExchange_Anungoo].[dbo].[t_DiscountTML]
        ([tradeshopid],[mmonth],[discounttype],[Amount],[state],[createdate],[createUser],[UsedTotalAmount])
        VALUES (${tradeshopid}, '${mmonth}', '${discounttype}', ${Amount}, ${state}, getdate(), ${createUser}, ${UsedTotalAmount})`

  res.status(200).json(data)
}
