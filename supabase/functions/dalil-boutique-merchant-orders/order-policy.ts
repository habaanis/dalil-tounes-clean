export type OrderProtection = {
  status: string;
  payment_status: string;
  paid_amount: number | string;
  payment_provider: string | null;
  payment_reference: string | null;
  payment_verified_at: string | null;
  archived_at: string | null;
  deleted_at: string | null;
};

export const isClosedOrder = (status: string) =>
  ['completed', 'rejected', 'cancelled'].includes(status);

// Confirmed/completed services may have been paid outside Dalil. Keep their
// history. An unconfirmed unpaid request is cancelled atomically when removed.
export const canDeleteOrder = (order: OrderProtection) =>
  !order.deleted_at && ['received', 'in_progress', 'rejected', 'cancelled'].includes(order.status) &&
  ['not_requested', 'failed'].includes(order.payment_status) &&
  Number(order.paid_amount) === 0 && order.payment_provider === null &&
  order.payment_reference === null && order.payment_verified_at === null;

export const orderCapabilities = (order: OrderProtection) => ({
  can_archive: !order.deleted_at && !order.archived_at && isClosedOrder(order.status),
  can_restore: !order.deleted_at && Boolean(order.archived_at),
  can_delete: canDeleteOrder(order),
});
