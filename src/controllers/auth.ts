import DiscordOauth2 from 'discord-oauth2'
import * as Secrets from '#secrets'
import * as crypto from 'crypto'

import { WebRoute, WebRouted } from '#/router/web-router'

import { TrackedUser } from '#objects/user/index'
import { setCookie } from '../cookies.ts'

const discClientID = process.env.DISCORD_APP_ID
const discSecret = Secrets.read('DISCORD_APP_SECRET')
const discRedirectURI = process.env.DISCORD_REDIRECT_URI
const portalRedirectURI = process.env.API_EXT_DEFAULT_URL
const oauth = new DiscordOauth2()

export const Routes: Array<WebRoute> = [
  {
    controller: auth,
    method: 'get',
    name: 'auth',
    path: '/api/auth'
  },
  {
    controller: authCallback,
    method: 'get',
    name: 'auth-callback',
    path: '/api/auth-callback'
  }
]

export async function auth(routed: WebRouted) {
  const oauth = new DiscordOauth2({
    clientId: discClientID,
    clientSecret: discSecret,
    redirectUri: discRedirectURI
  })
  const url = oauth.generateAuthUrl({
    scope: ['identify', 'guilds'],
    state: crypto.randomBytes(16).toString('hex')
  })

  routed.res.redirect(url)
}

export async function authCallback(routed: WebRouted) {
  const state = {
    error: null,
    token: null,
    user: null
  } as { error: Error; token: DiscordOauth2.TokenRequestResult; user: DiscordOauth2.User }

  // * Fetch Token
  try {
    console.log('fetching Token')
    state.token = await oauth.tokenRequest({
      clientId: discClientID,
      clientSecret: discSecret,
      code: routed.req.statusCode.toString(),
      grantType: 'authorization_code',
      redirectUri: discRedirectURI,
      scope: ['identify', 'guilds']
    })

    console.log('token', state.token)
  } catch (error) {
    console.log('error fetching Token', error)
    return routed.res.send(402) // Stop here
  }

  // * Fetch User
  try {
    console.log('fetching User')
    state.user = await oauth.getUser(state.token.access_token)

    // Set Access Token on user
    const user = new TrackedUser(await routed.DB.get('users', { id: state.user.id }))

    // Set Web Token on user
    user.oauth(user)

    // Update user in db
    await routed.DB.update(
      'users',
      { id: state.user.id },
      { $set: { accessToken: state.token.access_token, refreshToken: state.token.refresh_token, webToken: user.webToken } },
      { atomic: true }
    )

    setCookie(routed.res, 'userID', user.id, { maxAge: 1000 * 60 * 60 * 3 })
    setCookie(routed.res, 'webToken', user.webToken, { maxAge: 1000 * 60 * 60 * 3 })

    // return routed.res.json(state.user)
    return routed.res.redirect(portalRedirectURI)
  } catch (error) {
    console.log('error', error)
  }
}
