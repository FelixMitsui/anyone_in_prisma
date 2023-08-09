import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: '278287770009-p6ssovcjip1037fla3ep5fgbtrn1e2j2.apps.googleusercontent.com',
            clientSecret: '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'
        })],
        secret:process.env.NEXTAUTH_SECRET, 
    // callbacks: {
    
    // }
});