import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/contact',
  '/leiding(.*)',
  '/maandlijst(.*)',
  '/uniform',
  '/sign-in(.*)',
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth.protect();
  }
});

//const isProtectedRoute = createRouteMatcher(['/dashboard/:path']);

// export default clerkMiddleware(async (auth, request) => {
//   if (isProtectedRoute(request)) await auth.protect();
// });

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
