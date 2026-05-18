import { validateC2BService, confirmC2BService } from "../modules/mpesa/mpesa.service.js";
/**
 * Controller: Handles Safaricom C2B Validation Webhook
 */
export const validateC2B = async (req, res, next) => {
    console.log('--- Received C2B Validation Request ---');
    console.log(JSON.stringify(req.body, null, 2));
    try {
        const { BillRefNumber, MSISDN } = req.body;
        const result = await validateC2BService(BillRefNumber, MSISDN);
        if (result.isValid) {
            console.log(`✅ Validation Successful: ${result.resultDesc}`);
            return res.status(200).json({
                ResultCode: 0,
                ResultDesc: 'Accepted'
            });
        }
        else {
            console.log(`❌ Validation Failed: ${result.resultDesc}`);
            return res.status(200).json({
                ResultCode: 1,
                ResultDesc: result.resultDesc
            });
        }
    }
    catch (error) {
        console.error('Error in validation controller:', error);
        // On internal error, fallback to Accept so that the transaction is processed and not lost
        return res.status(200).json({
            ResultCode: 0,
            ResultDesc: 'Accepted on fallback'
        });
    }
};
/**
 * Controller: Handles Safaricom C2B Confirmation Webhook
 */
export const confirmC2B = async (req, res, next) => {
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
        const result = await confirmC2BService({
            transId: TransID,
            transAmount: TransAmount,
            msisdn: MSISDN,
            billRefNumber: BillRefNumber,
            transTime: TransTime,
            firstName: FirstName,
            middleName: MiddleName,
            lastName: LastName
        });
        if (result.status === 'duplicate') {
            console.log(`ℹ️ C2B payment ${TransID} already exists. Skipping duplicate save.`);
            return res.status(200).json({
                ResultCode: 0,
                ResultDesc: 'Confirmation received successfully (duplicate)'
            });
        }
        console.log(`💾 C2B payment successfully saved to database: ${TransID}`);
        return res.status(200).json({
            ResultCode: 0,
            ResultDesc: 'Confirmation received successfully'
        });
    }
    catch (error) {
        console.error('Error in confirmation controller:', error);
        return res.status(200).json({
            ResultCode: 1,
            ResultDesc: 'Internal server error processing confirmation'
        });
    }
};
