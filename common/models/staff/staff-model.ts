import type { PageableResponse, PaginationQueryParams } from "../api-base";

export type StaffObject = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
};

export interface ListStaffPayload extends PaginationQueryParams {
  search?: string;
  isActive?: boolean;
}

export type ListStaffResponse = PageableResponse<StaffObject>;

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
