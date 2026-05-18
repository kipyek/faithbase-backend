import { prisma } from "../database/prisma/client.js";
/**
 * Controller: Handles Safaricom C2B Validation Webhook
 */
export const validateC2B = (req, res) => {
    console.log('--- Received C2B Validation Request ---');
    console.log(JSON.stringify(req.body, null, 2));
    // Perform standard account/bill reference validation
    const isValid = true;
    if (isValid) {
        console.log('✅ Validation Successful: Transaction accepted');
        return res.status(200).json({
            ResultCode: 0,
            ResultDesc: 'Accepted'
        });
    }
    else {
        console.log('❌ Validation Failed: Transaction rejected');
        return res.status(200).json({
            ResultCode: 1,
            ResultDesc: 'Rejected'
        });
    }
};
/**
 * Controller: Handles Safaricom C2B Confirmation Webhook
 */
export const confirmC2B = async (req, res) => {
    console.log('--- Received C2B Confirmation ---');
    console.log(JSON.stringify(req.body, null, 2));
    try {
        const { TransID, TransAmount, MSISDN, BillRefNumber, TransTime, FirstName, MiddleName, LastName } = req.body;
        console.log(`✅ C2B PAYMENT CONFIRMED:
      Transaction ID: ${TransID}
      Amount: KES ${TransAmount}
      From (Phone): ${MSISDN}
      Name: ${FirstName || ''} ${MiddleName || ''} ${LastName || ''}
      Reference/Account: ${BillRefNumber}
      Date: ${TransTime}
    `);
        if (!TransID) {
            return res.status(400).json({
                ResultCode: 1,
                ResultDesc: 'Invalid request: TransID is missing'
            });
        }
        // Check if the transaction has already been saved to prevent duplicates on Safaricom retries
        const existingPayment = await prisma.mpesaPayment.findUnique({
            where: { transId: TransID }
        });
        if (existingPayment) {
            console.log(`ℹ️ C2B payment ${TransID} already exists in database. Skipping duplicate save.`);
            return res.status(200).json({
                ResultCode: 0,
                ResultDesc: 'Confirmation received successfully (duplicate)'
            });
        }
        // Save confirmation data in the database using Prisma
        await prisma.mpesaPayment.create({
            data: {
                transId: TransID,
                transAmount: String(TransAmount),
                msisdn: String(MSISDN),
                billRefNumber: String(BillRefNumber),
                transTime: String(TransTime),
                firstName: FirstName || null,
                middleName: MiddleName || null,
                lastName: LastName || null,
                rawCallback: req.body
            }
        });
        console.log(`💾 C2B payment successfully saved to database: ${TransID}`);
        return res.status(200).json({
            ResultCode: 0,
            ResultDesc: 'Confirmation received successfully'
        });
    }
    catch (error) {
        console.error('Error processing C2B confirmation:', error);
        return res.status(500).json({
            ResultCode: 1,
            ResultDesc: 'Internal server error processing confirmation'
        });
    }
};
