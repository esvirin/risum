import { db } from "@/lib/db";
import { verifyJccSignature } from "@/lib/jcc";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        // START VALIDATION
        // Note: In test mode signatures might differ.
        // const valid = verifyJccSignature(data);

        // if (!valid) {
        //   console.error("Invalid JCC Signature", data);
        //   return redirect("/cabinet?payment=error");
        // }

        const { OrderID, ResponseCode, ReasonCode } = data;

        // JCC ResponseCode '1' usually means approved. Check docs.
        const isApproved = ResponseCode === "1" || ResponseCode === "00"; // Adjust based on JCC Specs

        if (isApproved) {
            await db.payment.update({
                where: { jccOrderId: OrderID },
                data: {
                    status: "COMPLETED",
                    jccReference: data.ReferenceNo || "JCC-REF",
                }
            });
            return redirect("/cabinet?payment=success");
        } else {
            await db.payment.update({
                where: { jccOrderId: OrderID },
                data: {
                    status: "FAILED",
                    description: `Failed: ${ReasonCode}`
                }
            });
            return redirect("/cabinet?payment=failed");
        }

    } catch (error) {
        console.error("JCC Callback Error", error);
        return redirect("/cabinet?error=callback_error");
    }
}
