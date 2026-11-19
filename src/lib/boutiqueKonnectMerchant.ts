// Shared, side-effect-free preparation for Konnect checkout.
// Never call this from the browser with a provider API key.
export type PaymentStage = 'deposit' | 'balance' | 'full';
export type GatewayEnvironment = 'sandbox' | 'production';

export type MerchantGatewayAccount = {
  receiverWalletId: string;
  credentialSecretRef: string; // Secret-store reference only: never the API key.
  environment: GatewayEnvironment;
  enabled: boolean;
  verified: boolean;
};
export type OrderPaymentSnapshot = {
  orderId: string;
  entrepriseId: string;
  currency: 'TND';
  kind: 'order' | 'quote';
  totalTnd: number;
  verifiedPaidTnd: number;
};
export type KonnectIntent = {
  receiverWalletId: string;
  token: 'TND';
  amount: number; // integer millimes, never float TND
  type: 'immediate';
  orderId: string;
  description: string;
};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Strict decimal conversion; floats with unrepresentable millimes are rejected.
export function tndToMillimes(amount:number):number {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Invalid positive amount');
  const millimes=Math.round(amount*1000);
  if (!Number.isSafeInteger(millimes) || Math.abs(millimes/1000-amount)>1e-7)
    throw new Error('Amount must use at most 3 decimal places');
  return millimes;
}
export function buildMerchantKonnectIntent(args:{
  order:OrderPaymentSnapshot;
  account:MerchantGatewayAccount;
  stage:PaymentStage;
  depositTnd?:number;
  approvedAccountEntrepriseId:string;
  sandboxOnly?:boolean;
}):KonnectIntent {
  const {order,account,stage,depositTnd,approvedAccountEntrepriseId}=args;
  if (order.kind!=='order' || order.currency!=='TND')throw new Error('Only priced TND orders can be paid');
  if(order.entrepriseId!==approvedAccountEntrepriseId)throw new Error('Merchant account does not own order');
  if(!account.enabled || !account.verified)throw new Error('Merchant gateway not approved');
  if(args.sandboxOnly!==false && account.environment!=='sandbox')throw new Error('Production payments remain disabled');
  if(!/^[a-zA-Z0-9_-]{8,100}$/.test(account.receiverWalletId))
    throw new Error('Invalid receiver wallet');
  if (!account.credentialSecretRef || account.credentialSecretRef.length<8)
    throw new Error('Server credential reference unavailable');
  if(!/^[0-9a-f-]{36}$/i.test(order.orderId)) throw new Error('Invalid order');
  const total=tndToMillimes(order.totalTnd);
  const alreadyPaid=order.verifiedPaidTnd===0?0:tndToMillimes(order.verifiedPaidTnd);
  if(alreadyPaid>=total || alreadyPaid<0)throw new Error('Order is already paid or inconsistent');
  const remaining=total-alreadyPaid;
  let amount=remaining;
  if(stage==='full' && alreadyPaid!==0)throw new Error('Use balance for an existing deposit');
  if(stage==='deposit'){
    if(alreadyPaid!==0 || depositTnd===undefined)throw new Error('Deposit requires an unpaid order and verified merchant policy');
    amount=tndToMillimes(depositTnd);
    if(amount>=total)throw new Error('Deposit must be smaller than full total');
  }
  // Never accept the amount, wallet or credited status from browser inputs.
  return {
    receiverWalletId:account.receiverWalletId,token:'TND',amount,
    type:'immediate',orderId:order.orderId,
    description:'Commande Dalil Tounes '+order.orderId.slice(0,8)+' · '+stage,
  };
}
export type ProviderPaymentEvidence = {
  paymentId:string; status:string; orderId:string; token:string;
  reachedAmount:number; receiverWalletId:string;
};
// Return "verified" only for EXACT order, wallet, currency and expected amount.
// A browser redirect or unverified webhook callback is NEVER payment evidence.
export function verifyMerchantKonnectEvidence(args:{
  evidence:ProviderPaymentEvidence;
  expectedPaymentRef:string;
  expectedOrderId:string;
  expectedReceiverWalletId:string;
  expectedMillimes:number;
}):boolean {
  const {evidence,expectedPaymentRef,expectedOrderId,expectedReceiverWalletId,expectedMillimes}=args;
  return evidence.paymentId===expectedPaymentRef &&
    evidence.orderId===expectedOrderId &&
    evidence.receiverWalletId===expectedReceiverWalletId &&
    evidence.token==='TND' &&
    evidence.status==='completed' &&
    Number.isSafeInteger(evidence.reachedAmount) &&
    evidence.reachedAmount===expectedMillimes;
}
