import pkg from "@prisma/client";
import { prisma } from "../../database/prisma/client.js";
const { Role, ChurchType } = pkg;
/**
 * Service: Core business logic for C2B Validation
 */
export const validateC2BService = async (billRefNumber, msisdn) => {
    if (!billRefNumber) {
        return {
            isValid: false,
            resultDesc: 'Rejected: Missing account reference (BillRefNumber)'
        };
    }
    const cleanedRef = String(billRefNumber).trim();
    // Helper to normalize phone numbers (e.g. 254712345678)
    const cleanPhone = (phone) => {
        let p = phone.trim().replace(/\D/g, ''); // remove non-digits
        if (p.startsWith('0'))
            p = '254' + p.slice(1);
        if (p.startsWith('7'))
            p = '254' + p;
        return p;
    };
    const normalizedMSISDN = cleanPhone(String(msisdn));
    const normalizedRef = cleanPhone(cleanedRef);
    // 1. Check if BillRefNumber matches a Church ID
    const church = await prisma.church.findUnique({
        where: { id: cleanedRef }
    });
    if (church) {
        return {
            isValid: true,
            resultDesc: `Accepted: Matched Church (${church.name})`
        };
    }
    // 2. Check if BillRefNumber matches a Member ID
    const memberById = await prisma.member.findUnique({
        where: { id: cleanedRef }
    });
    if (memberById) {
        return {
            isValid: true,
            resultDesc: `Accepted: Matched Member by ID (${memberById.firstName} ${memberById.lastName})`
        };
    }
    // 3. Check if BillRefNumber or MSISDN matches a Member Phone Number
    const memberByPhone = await prisma.member.findFirst({
        where: {
            OR: [
                { phone: cleanedRef },
                { phone: normalizedRef },
                { phone: msisdn },
                { phone: normalizedMSISDN }
            ]
        }
    });
    if (memberByPhone) {
        return {
            isValid: true,
            resultDesc: `Accepted: Matched Member by Phone (${memberByPhone.firstName} ${memberByPhone.lastName})`
        };
    }
    return {
        isValid: false,
        resultDesc: `Rejected: No matching Church or Member found for reference "${cleanedRef}"`
    };
};
/**
 * Service: Core business logic for C2B Confirmation
 */
export const confirmC2BService = async (data) => {
    const { transId, transAmount, msisdn, billRefNumber, transTime, firstName, middleName, lastName } = data;
    if (!transId) {
        throw new Error("Invalid request: transId is missing");
    }
    // Check if transaction already exists in database (duplicate callback prevention)
    const existingPayment = await prisma.mpesaPayment.findUnique({
        where: { transId }
    });
    if (existingPayment) {
        return {
            status: "duplicate",
            message: `Transaction ${transId} already processed`
        };
    }
    // Persist transaction to database (rawCallback is removed per schema.prisma change)
    const payment = await prisma.mpesaPayment.create({
        data: {
            transId,
            transAmount: String(transAmount),
            msisdn: String(msisdn),
            billRefNumber: String(billRefNumber),
            transTime: String(transTime),
            firstName: firstName || null,
            middleName: middleName || null,
            lastName: lastName || null
        }
    });
    return {
        status: "success",
        payment
    };
};
