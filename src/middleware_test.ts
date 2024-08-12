// import { NextRequest, NextResponse } from "next/server";

// let locales = ["en", "uk"];

// export function middleware(request: NextRequest) {
//   // Check if there is any supported locale in the pathname
//   const { pathname } = request.nextUrl;
//   const pathnameHasLocale = locales.some(
//     (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//   );

//   if (pathnameHasLocale) return;

//   // Redirect if there is no locale
//   //   const locale = getLocale(request);
//   const locale = "en";
//   const splitPaths = pathname.split("/");
//   console.log("splitPaths: ", { splitPaths });
//   request.nextUrl.pathname = pathname.replace(`/texts`, `/texts/${locale}`);
//   return NextResponse.redirect(request.nextUrl);
// }

// export const config = {
//   matcher: ["/texts/:path*"],
// };
