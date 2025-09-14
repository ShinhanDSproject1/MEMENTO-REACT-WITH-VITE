export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordSuccess {
  ok?: boolean;
  message?: string;
}

export interface UpdatePasswordErrorBody {
  message?: string;
  code?: string;
}

export class UpdatePasswordError extends Error {
  code?: string;
  status: number;

  constructor(message: string, opts?: { code?: string; status?: number }) {
    super(message);
    this.name = "UpdatePasswordError";
    this.code = opts?.code;
    this.status = opts?.status ?? 0;
  }
}
