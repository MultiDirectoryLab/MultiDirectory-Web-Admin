export class SwapPolicyResponse {
  first_policy_id: number = 0;
  first_policy_priority: number = 0;
  second_policy_id: number = 0;
  second_policy_priority: number = 0;

  constructor(obj: Partial<SwapPolicyResponse>) {
    Object.assign(this, obj);
  }
}
