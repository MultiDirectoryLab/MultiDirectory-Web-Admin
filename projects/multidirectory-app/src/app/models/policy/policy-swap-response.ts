export class SwapPolicyResponse {
  first_policy_id = 0;
  first_policy_priority = 0;
  second_policy_id = 0;
  second_policy_priority = 0;

  constructor(obj: Partial<SwapPolicyResponse>) {
    Object.assign(this, obj);
  }
}
