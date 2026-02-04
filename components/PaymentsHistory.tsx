
"use client";

import { Payment } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface PaymentsHistoryProps {
    payments: any[];
}

export default function PaymentsHistory({ payments }: PaymentsHistoryProps) {
    if (payments.length === 0) {
        return (
            <div className="text-center py-6 text-muted-foreground">
                No payment history found.
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell>{format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                            <TableCell>{payment.description}</TableCell>
                            <TableCell>€{payment.amount.toFixed(2)}</TableCell>
                            <TableCell>
                                <Badge variant={payment.status === 'COMPLETED' ? 'default' : payment.status === 'PENDING' ? 'outline' : 'destructive'}>
                                    {payment.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
