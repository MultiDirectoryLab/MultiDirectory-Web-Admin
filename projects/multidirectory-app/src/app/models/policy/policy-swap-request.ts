export class SwapPolicyRequest {
  first_policy_id = 0;
  second_policy_id = 0;

  constructor(obj: Partial<SwapPolicyRequest>) {
    Object.assign(this, obj);
  }
}
