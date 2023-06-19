import { User } from "@clerk/backend/dist/types/api/resources";

export const getPrimaryEmail = (user: User): string => {
  const primaryId = user.primaryEmailAddressId;
  const primaryEmail = user.emailAddresses.find((e) => e.id === primaryId);
  return primaryEmail?.emailAddress || "";
};
