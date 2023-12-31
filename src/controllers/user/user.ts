import * as Middleware from '#middleware'

import { WebRoute, WebRouted } from '#/router/web-router'

export const Routes: Array<WebRoute> = [
  {
    controller: getMe,
    method: 'get',
    middleware: [Middleware.Auth.validateSession],
    name: 'web-me',
    path: '/api/user/me'
  }
]

export async function getMe(routed: WebRouted) {
  const user = await routed.DB.get('users', { id: routed.session.id })

  // Fetch avatar from discord
  // const discordUser = await routed.Bot.client.users.fetch(user.id)

  // console.log(discordUser)

  return routed.res.send({
    data: {
      // avatar: discordUser.avatar,
      // discriminator: discordUser.discriminator,
      // success: true,
      // userID: discordUser.id,
      // username: discordUser.username
    },
    success: true
  })
}
