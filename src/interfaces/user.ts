import { User } from "@/types/user";

export type PartionalUserWithRequiredEmail = Required<Pick<User, "email">> & Partial<Omit<User, "email">>

export default interface UserRepository {
    getUsersByEmail(email: string, ownerEmail?: string): Promise<User[]>;
    getUsersByEmailList(emails: string[]): Promise<User[]>;
    createOrUpdateUser(
        data: PartionalUserWithRequiredEmail,
        merge?: boolean
    ): void;
    retrieveUser(id: string): Promise<User | undefined>;
}