import { User as BaseUser } from "@/lib/types";

export interface AuthUser extends Omit<BaseUser, "password"> {
  hasPaidFor?: {
    courseIds: string[];
  };
}
