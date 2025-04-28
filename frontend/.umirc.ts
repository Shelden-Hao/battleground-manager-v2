import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '霹雳舞比赛管理系统',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      layout: false,
    },
    {
      name: '注册',
      path: '/register',
      component: './Register',
      layout: false,
    },
    {
      name: '用户管理',
      path: '/users',
      component: './Users',
      access: 'isAdmin',
    },
    {
      name: '比赛管理',
      path: '/competitions',
      routes: [
        {
          path: '/competitions',
          component: './Competitions',
        },
        {
          path: '/competitions/:id',
          component: './Competitions/Detail',
        },
      ],
    },
    {
      name: '我的比赛',
      path: '/my-matches',
      component: './MyMatches',
      access: 'isPlayer',
    },
    {
      name: '裁判评分',
      path: '/judge-matches',
      component: './JudgeMatches',
      access: 'isJudge',
    },
    {
      name: '选手评分',
      path: '/judge-scoring',
      component: './JudgeScoring',
      access: 'isJudge',
    },
    // {
    //   name: '报名管理',
    //   path: '/registrations',
    //   routes: [
    //     {
    //       path: '/registrations',
    //       component: './Registrations',
    //       access: 'isAdmin',
    //     },
    //     {
    //       path: '/registrations/my',
    //       component: './Registrations/My',
    //       access: 'isPlayer',
    //     },
    //   ],
    // },
    {
      name: '比赛对阵',
      path: '/matches',
      routes: [
        {
          path: '/matches',
          component: './Matches',
        },
        {
          path: '/matches/:id',
          component: './Matches/Detail',
        },
      ],
    },
    {
      name: '选手排名',
      path: '/rankings',
      routes: [
        {
          path: '/rankings/competition/:competitionId',
          component: './Rankings',
        },
        {
          path: '/rankings/competition/:competitionId/stage/:stageId',
          component: './Rankings',
        },
      ],
      hideInMenu: true,
    },
    {
      name: '对战表',
      path: '/matchups',
      routes: [
        {
          path: '/matchups/competition/:competitionId/stage/:stageId',
          component: './Matchups',
        },
      ],
      hideInMenu: true,
    },
  ],
  npmClient: 'npm',
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
});
