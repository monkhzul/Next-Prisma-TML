
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const tradeshopid = req.body.tradeshopid;
  const mmonth = req.body.mmonth;
  const discounttype = req.body.discounttype;
  const Amount = req.body.Amount;
  const state = req.body.state;
  const createdate = req.body.createdate;
  const createUser = req.body.createUser;
  
  const data = await prisma.$queryRaw`INSERT INTO [SMTExchange_Anungoo].[dbo].[t_DiscountTML]
        ([tradeshopid]
        ,[mmonth]
        ,[discounttype]
        ,[Amount]
        ,[state]
        ,[createdate]
        ,[createUser])
    VALUES (${tradeshopid}, '${mmonth}', '${discounttype}', ${Amount}, ${state}, ${createdate}, ${createUser})`
  res.status(200).send(data)
}


// INSERT INTO [SMTExchange_Anungoo].[dbo].[t_DiscountTML]
//            ([tradeshopid]
//            ,[mmonth]
//            ,[discounttype]
//            ,[Amount]
//            ,[state]
//            ,[createdate]
//            ,[createUser])
//      VALUES
//            (1, 'month', 'type', 23, 2, 2022-08-25, 2022-08-25)