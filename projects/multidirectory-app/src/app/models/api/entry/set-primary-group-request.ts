export interface SetPrimaryGroupRequest {
  directory_dn: string; // dn объекта, для которого будет установлена основная группа
  group_dn: string;
}
