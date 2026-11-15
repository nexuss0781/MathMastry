export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
}

export interface Profile {
  userId: string;
  displayName: string | null;
  timezone: string;
  goal: string | null;
  weeklyMinutes: number;
  role: string;
  onboardedAt: Date | null;
}

export interface AppEnv {
  Variables: {
    user: User;
    profile: Profile;
  };
}
