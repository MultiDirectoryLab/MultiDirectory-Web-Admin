import { DnsRule } from '@models/dns/dns-rule';

export type DnsRuleDialogReturnData = DnsRule | null;

export interface DnsRuleDialogData {
  rule: DnsRule;
  isEdit?: boolean;
}
