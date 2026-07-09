export type StaffObject = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
};

export type ListStaffResponse = {
  staff: StaffObject[];
};

export type CreateStaffRequest = {
  email: string;
  password: string;
  name?: string;
  phone?: string;
};

export type CreateStaffResponse = {
  staff: StaffObject;
};

export type UpdateStaffRequest = {
  name?: string;
  phone?: string | null;
  isActive?: boolean;
};

export type UpdateStaffResponse = {
  staff: StaffObject;
};

export type ResetStaffPasswordRequest = {
  password: string;
};

export type ResetStaffPasswordResponse = {
  ok: boolean;
};
