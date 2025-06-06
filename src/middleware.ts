import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function verifyUser(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
        return { isAuthenticated: false, role: 'guest' };
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); 
        return { isAuthenticated: true, role: payload.role || 'user' };
    } catch (e) {
        return { isAuthenticated: false, role: 'guest' };
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const user = await verifyUser(request);

    if (!user.isAuthenticated && (pathname.startsWith('/admin') || pathname.startsWith('/user'))) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    if (user.isAuthenticated) {
        if (pathname.startsWith('/admin') && user.role !== 'admin') {
            return NextResponse.redirect(new URL('/user/dashboard', request.url));
        }

        if (pathname.startsWith('/user') && user.role === 'admin') {
             return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/user/:path*'],
};