import { createRouter, createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { authClient } from "./lib/auth";
import { queryClient } from "./lib/query";
import { AppShell } from "./components/app-shell";
import { LandingPage } from "./pages/landing";
import { LoginPage } from "./pages/auth";
import { SignupPage } from "./pages/auth";
import { WelcomePage } from "./pages/welcome";
import { DashboardPage } from "./pages/dashboard";
import { AtlasPage } from "./pages/atlas";
import { DomainPage } from "./pages/domain";
import { ConceptPage } from "./pages/concept";
import { CurriculumListPage } from "./pages/curriculum-list";
import { CurriculumDetailPage } from "./pages/curriculum-detail";
import { CurriculumNewPage } from "./pages/curriculum-new";
import { ReviewPage } from "./pages/review";
import { ProgressPage } from "./pages/progress";
import { TutorListPage } from "./pages/tutor-list";
import { TutorChatPage } from "./pages/tutor-chat";
import { SettingsPage } from "./pages/settings";
import { NotFoundPage } from "./pages/not-found";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage redirect={window.location.search.slice(1)} />,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/welcome",
  component: WelcomePage,
});

// Layout route for authenticated pages - no path segment, just wraps children
const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "",
  component: () => {
    const { data: session } = authClient.useSession();
    if (!session?.user) {
      throw new Response(null, { status: 302, headers: { Location: "/login?redirect=" + window.location.pathname } });
    }
    // Use the session user, profile will be loaded via useMe in AppShell
    const u = session.user;
    const user = {
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image ?? null,
      emailVerified: u.emailVerified,
      createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
    };
    return <AppShell me={{ user, profile: null, capabilities: { github: false, aiMode: "fixture" as const, devAuth: true } }}><Outlet /></AppShell>;
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "dashboard",
  component: DashboardPage,
});

const atlasRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "atlas",
  component: AtlasPage,
});

const domainRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "atlas/$domain",
  component: DomainPage,
});

const conceptRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "concepts/$slug",
  component: ConceptPage,
});

const curriculumListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "curriculum",
  component: CurriculumListPage,
});

const curriculumDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "curriculum/$id",
  component: CurriculumDetailPage,
});

const curriculumNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "curriculum/new",
  component: CurriculumNewPage,
});

const reviewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "review",
  component: ReviewPage,
});

const progressRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "progress",
  component: ProgressPage,
});

const tutorListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "tutor",
  component: TutorListPage,
});

const tutorChatRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "tutor/$threadId",
  component: TutorChatPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "settings",
  component: SettingsPage,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  welcomeRoute,
  authenticatedRoute.addChildren([
    dashboardRoute,
    atlasRoute,
    domainRoute,
    conceptRoute,
    curriculumListRoute,
    curriculumDetailRoute,
    curriculumNewRoute,
    reviewRoute,
    progressRoute,
    tutorListRoute,
    tutorChatRoute,
    settingsRoute,
  ]),
  notFoundRoute,
]);

export const router = createRouter({ routeTree, context: { queryClient } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}