import * as Middleware from '#middleware'

import { WebRoute, WebRouted } from '#/router/web-router'

export const Routes: Array<WebRoute> = [
  {
    controller: getMyDataTotals,
    method: 'get',
    middleware: [Middleware.Auth.validateSession],
    name: 'web-my-data-totals',
    path: '/api/user/mydata/totals'
  }
]

export async function getMyDataTotals(routed: WebRouted) {
  return routed.res.send({
    data: [
      { count: await routed.DB.count('audit-log', { owner: routed.session.userID }), name: 'Audit Log', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('settings', { author: routed.session.userID }), name: 'Bot Settings', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('command-permissions', { userID: routed.session.userID }), name: 'Command Permissions', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('decision', { authorID: routed.session.userID }), name: 'Decisions', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('decision-log', { callerID: routed.session.userID }), name: 'Decision Log', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('messages', { callerID: routed.session.userID }), name: 'Message', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('muted-users', { id: routed.session.userID }), name: 'Muted as User', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('muted-users', { mutedById: routed.session.userID }), name: 'Muted as Muter', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('polls', { authorID: routed.session.userID }), name: 'Polls', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('server-settings', { authorID: routed.session.userID }), name: 'Server Settings', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('servers', { owner: routed.session.userID }), name: 'Servers as Owner', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('sessions', { userID: routed.session.userID }), name: 'Web Sessions', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('stats-servers', { userID: routed.session.userID }), name: 'Stats', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('stats-settings', { userID: routed.session.userID }), name: 'Stats Settings', scope: 'kiera', thirdParty: false },
      { count: await routed.DB.count('users', { id: routed.session.userID }), name: 'Users', scope: 'kiera', thirdParty: false },
    ],
    success: true
  })
}
